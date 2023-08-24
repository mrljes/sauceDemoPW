const {test, expext, expect} = require('@playwright/test')

test('Sauce demo login test', async({page}) => {
    await page.goto('https://www.saucedemo.com/')
    await page.locator('//*[@id="user-name"]').fill('standard_user')
    await page.locator('//*[@id="password"]').fill('secret_sauce')
    await page.click('//*[@id="login-button"]')
})