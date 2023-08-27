const {test, expext, expect} = require('@playwright/test')
import {selectors} from './selectors/common';

test('Sauce demo login test', async({page}) => {
    // This is for standard_user
    await page.goto(selectors['url'])
    await page.locator(selectors['usernameInput']).fill(selectors['userName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await page.click(selectors['hamburgerBtn'])
    await page.click(selectors['logoutBtn'])
    // This is for locked out user
    await page.locator(selectors['usernameInput']).fill(selectors['lockedOutUsername'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await expect(page.locator(selectors['lockedOutUserErrorMessage'])).toHaveText(selectors['errorMessageTextForLockedUser'])
    await page.locator(selectors['usernameInput']).fill('')
    await page.locator(selectors['passwordInput']).fill('')
    // This is for problem user
    await page.locator(selectors['usernameInput']).fill(selectors['problemUserName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await expect(page.locator(selectors['itemImage'])).toBeVisible();
    await page.click(selectors['hamburgerBtn'])
    await page.click(selectors['logoutBtn'])
    // This is for glitchy user
    await page.locator(selectors['usernameInput']).fill(selectors['glitchUserName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await page.click(selectors['hamburgerBtn'])
    await page.click(selectors['logoutBtn'])
    // This is for user with correct username and wrong password
    await page.locator(selectors['usernameInput']).fill(selectors['userName'])
    await page.locator(selectors['passwordInput']).fill(selectors['wrongPassword'])
    await page.click(selectors['loginButton'])
    await expect(page.locator(selectors['wrongPasswordErrorMessage'])).toHaveText(selectors['errorMessageTextForWrongUserNameAndPassowrd'])
    await page.locator(selectors['usernameInput']).fill('')
    await page.locator(selectors['passwordInput']).fill('')
    // This is for user with wrong username and correct password
    await page.locator(selectors['usernameInput']).fill('testtest')
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await expect(page.locator(selectors['wrongPasswordErrorMessage'])).toHaveText(selectors['errorMessageTextForWrongUserNameAndPassowrd'])
    await page.locator(selectors['usernameInput']).fill('')
    await page.locator(selectors['passwordInput']).fill('')
    await page.pause()
})