import {selectors} from '../selectors/common';
import { standard_user , password,  } from '../selectors/credentials'
import { test, expect } from '../util/fixtures';
test('Sauce homepage test', async ({ loginPage, app }) => {
    await loginPage.navigate()
    await loginPage.login( standard_user , password)
    await app.assertTextPresent(selectors['headerText'], 'Swag Labs')
    await app.assertVisible(selectors['shoppingcartButton'], '')
    await app.assertVisible(selectors['hamburgerBtn'], '')
    await app.assertVisible(selectors['productsHeaderText'], '')
    await app.assertVisible(selectors['sortingProductButton'], '')
    await app.assertVisible(selectors['productDescription'], '')
    await app.assertVisible(selectors['addToCartButton'], '')
    await app.assertVisible(selectors['twitterButton'], '')
    await app.assertVisible(selectors['facebookButton'], '')
    await app.assertVisible(selectors['linkedinButton'], '')
    await app.assertTextPresent(selectors['footerText'], '© ')       
})
