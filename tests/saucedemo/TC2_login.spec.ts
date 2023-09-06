import {selectors} from '../selectors/common';
import { standard_user , password, locked_user, problem_user, glitchy_user, random_password, random_user,  } from '../selectors/credentials'
import { test, expect } from '../util/fixtures';

test('Sauce demo login test', async({ loginPage, app }) => {

    // This is for standard_user
    await loginPage.navigate()
    await loginPage.login( standard_user , password)
    await app.click(selectors['hamburgerBtn'], '')
    await app.click(selectors['logoutBtn'], '')
    
    // This is for locked out user
    await loginPage.login( locked_user , password)
    await app.assertTextPresent(selectors['lockedOutUserErrorMessage'], 'Epic sadface: Sorry, this user has been locked out.')
  
    // This is for problem user
    await loginPage.login (problem_user , password)
    await app.assertVisible(selectors['itemImage'], '')
    await app.click(selectors['hamburgerBtn'], '')
    await app.click(selectors['logoutBtn'], '')

    // This is for glitchy user
    await loginPage.login (glitchy_user , password)
    await app.click(selectors['hamburgerBtn'], '')
    await app.click(selectors['logoutBtn'], '')

    // This is for user with correct username and wrong password
    await loginPage.login (standard_user , random_password)
    await app.assertVisible(selectors['wrongPasswordErrorMessage'], 'Epic sadface: Username and password do not match any user in this service')

    // This is for user with wrong username and correct password
    await loginPage.login (random_user, password)
    await app.assertVisible(selectors['wrongPasswordErrorMessage'], 'Epic sadface: Username and password do not match any user in this service')
    await app.pause(1000)
})