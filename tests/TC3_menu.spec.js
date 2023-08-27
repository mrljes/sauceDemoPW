const {test, expext, expect} = require('@playwright/test')
import {selectors} from './selectors/common';

test('Sauce hamburger button test', async({page}) => {
    await page.goto(selectors['url'])
    await page.locator(selectors['usernameInput']).fill(selectors['userName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await page.click(selectors['hamburgerBtn'])
    await page.click(selectors['closeHamburgerButton'])
    await page.click(selectors['hamburgerBtn'])
    await expect(page.locator(selectors['allItemsButton'])).toBeVisible()
    await page.click(selectors['aboutButton'])
    await expect(page.locator(selectors['textFromAnotherPage'])).toBeVisible()
    await page.goBack();
    await page.click(selectors['hamburgerBtn'])
    await page.click(selectors['logoutBtn'])
    await page.locator(selectors['usernameInput']).fill(selectors['userName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password'])
    await page.click(selectors['loginButton'])
    await page.click(selectors['hamburgerBtn'])
    await expect(page.locator(selectors['resetAppBtn'])).toBeVisible()
    await page.pause()
})
