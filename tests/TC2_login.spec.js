const {test, expext, expect} = require('@playwright/test')
import {selectors} from './selectors/common';

test('Sauce demo login test', async({page}) => {
    // This is for standard_user
    await page.goto('https://www.saucedemo.com/')
    await page.locator(selectors['usernameInput']).fill(selectors['userName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await page.click(selectors['hamburgerBtn'])
    await page.click(selectors['logoutBtn'])
    // This is for locked out user
    await page.locator(selectors['usernameInput']).fill('locked_out_user')
    await page.locator('//*[@id="password"]').fill('secret_sauce')
    await page.click('//*[@id="login-button"]')
    await expect(page.locator('//*[@id="login_button_container"]/div/form/div[3]/h3')).toHaveText('Epic sadface: Sorry, this user has been locked out.')
    await page.locator('//*[@id="user-name"]').fill('')
    await page.locator('//*[@id="password"]').fill('')
    // This is for problem user
    await page.locator('//*[@id="user-name"]').fill('problem_user')
    await page.locator('//*[@id="password"]').fill('secret_sauce')
    await page.click('//*[@id="login-button"]')
    await expect(page.locator('//*[@id="item_4_img_link"]')).toBeVisible();
    await page.click('//*[@id="react-burger-menu-btn"]')
    await page.click('//*[@id="logout_sidebar_link"]')
    // This is for glitchy user
    await page.locator('//*[@id="user-name"]').fill('performance_glitch_user')
    await page.locator('//*[@id="password"]').fill('secret_sauce')
    await page.click('//*[@id="login-button"]')
    await page.click('//*[@id="react-burger-menu-btn"]')
    await page.click('//*[@id="logout_sidebar_link"]')
    // This is for user with correct username and wrong password
    await page.locator('//*[@id="user-name"]').fill('standard_user')
    await page.locator('//*[@id="password"]').fill('test123')
    await page.click('//*[@id="login-button"]')
    await expect(page.locator('//*[@id="login_button_container"]/div/form/div[3]/h3')).toHaveText('Epic sadface: Username and password do not match any user in this service')
    await page.locator('//*[@id="user-name"]').fill('')
    await page.locator('//*[@id="password"]').fill('')
    // This is for user with wrong username and correct password
    await page.locator('//*[@id="user-name"]').fill('testtest')
    await page.locator('//*[@id="password"]').fill('secret_sauce')
    await page.click('//*[@id="login-button"]')
    await expect(page.locator('//*[@id="login_button_container"]/div/form/div[3]/h3')).toHaveText('Epic sadface: Username and password do not match any user in this service')
    await page.locator('//*[@id="user-name"]').fill('')
    await page.locator('//*[@id="password"]').fill('')
    await page.pause()
})