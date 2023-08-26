import {selectors} from './selectors/common';
import {test, expect, expext} from '@playwright/test';

test('Sauce homepage test', async({page}) => {
    await page.goto(selectors['url'])
    await page.locator(selectors['usernameInput']).fill(selectors['userName'])
    await page.locator(selectors['passwordInput']).fill(selectors['password']) 
    await page.click(selectors['loginButton'])
    await expect(page.getByText(selectors['headerText'])).toBeVisible()
    await expect(page.locator(selectors['shoppingcartButton'])).toBeVisible()
    await expect(page.locator(selectors['hamburgerBtn'])).toBeVisible()
    await expect(page.locator(selectors['productsHeaderText'])).toBeVisible()
    await expect(page.locator(selectors['sortingProductButton'])).toBeVisible()
    await expect(page.locator(selectors['productDescription'])).toBeVisible()
    await expect(page.locator(selectors['addToCartButton'])).toBeVisible()
    await expect(page.locator(selectors['twitterButton'])).toBeVisible()
    await expect(page.locator(selectors['facebookButton'])).toBeVisible()
    await expect(page.locator(selectors['linkedinButton'])).toBeVisible()
    await expect(page.getByText(selectors['footerText'])).toBeVisible()
})
