import {selectors} from '../selectors/common';
import { standard_user , password,  } from '../selectors/credentials'
import { test, expect } from '../util/fixtures';

test('Sauce hamburger button test', async({ loginPage, app }) => {
    await loginPage.navigate()
    await loginPage.login( standard_user , password)
    await app.click(selectors['hamburgerBtn'], '')
    await app.click(selectors['closeHamburgerButton'], '')
    await app.click(selectors['hamburgerBtn'], '')
    await app.assertVisible(selectors['allItemsButton'], '')
    await app.click(selectors['aboutButton'], '')
    await app.assertVisible(selectors['textFromAnotherPage'], '')
    await app.goBack()
    await app.click(selectors['hamburgerBtn'], '')
    await app.click(selectors['logoutBtn'], '')
    await loginPage.login (standard_user , password)
    await app.click(selectors['hamburgerBtn'], '')
    await app.assertVisible(selectors['resetAppBtn'], '')
    await app.pause(10)
})
