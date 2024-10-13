const { remote } = require('webdriverio')
const fs = require('fs')
const path = require('path')

const capabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 14',
    'appium:platformVersion': '16.2',
    'appium:bundleId': 'com.apple.Preferences',
}

const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities,
}

// 检查或创建 img 文件夹
const imgDir = path.join(__dirname, 'img')
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
} else {
    // 清空 img 文件夹
    fs.readdirSync(imgDir).forEach(file => fs.unlinkSync(path.join(imgDir, file)))
}

async function runTest() {
    const driver = await remote(wdOpts)
    try {
        // 1. 点击 "设置" 主菜单项
        const settingsItem = await driver.$('//XCUIElementTypeStaticText[@name="设置"]')
        if (await settingsItem.isDisplayed()) {
            await settingsItem.click()
            console.log("Successfully clicked '设置' menu item.")
        }

        // 2. 点击 "通用" 菜单项
        const generalItem = await driver.$('~通用')
        if (await generalItem.isDisplayed()) {
            await generalItem.click()
            console.log("Successfully clicked '通用' menu item.")
        } else {
            console.error("'通用' menu item was not found.")
            return
        }

        // 3. 点击 "关于本机" 菜单项
        const aboutItem = await driver.$('~关于本机')
        if (await aboutItem.isDisplayed()) {
            await aboutItem.click()
            console.log("Successfully clicked '关于本机' menu item.")
            
            // 截图并保存到 img 文件夹
            const screenshotPath = path.join(imgDir, 'about_page.png')
            await driver.saveScreenshot(screenshotPath)
            console.log(`Screenshot saved at ${screenshotPath}`)
        } else {
            console.error("'关于本机' menu item was not found.")
            return
        }
        
    } catch (error) {
        console.error("An error occurred during the test:", error)
    } finally {
        await driver.pause(1000)
        await driver.deleteSession()
    }
}

runTest().catch(console.error)
