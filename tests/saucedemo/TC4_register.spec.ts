import {selectors} from '../selectors/common';
import { SSN, adress, city, firstName, lastName, password, phone, state, zipcode } from '../selectors/credentials'
import { test, expect } from '../util/fixtures';
let dt = new Date()
let random_username='user-'+dt.getTime()
let rightUsername

test('demo', async({ loginPage, app }) => {
    await loginPage.navigate()
    await app.click(selectors['registerTxt'], '')
    await app.typeText(selectors['firstNameReg'], firstName)
    await app.typeText(selectors['lastNameReg'], lastName)
    await app.typeText(selectors['adressReg'], adress)
    await app.typeText(selectors['cityReg'], city)
    await app.typeText(selectors['stateReg'], state) 
    await app.typeText(selectors['zipReg'], zipcode)
    await app.typeText(selectors['phoneReg'], phone)
    await app.typeText(selectors['ssnReg'], SSN)
    await app.typeText(selectors['usernameReg'], random_username)
    await app.typeText(selectors['passwordReg'], password)
    await app.typeText(selectors['confirmReg'], password)
    rightUsername = await app.storeValue(selectors['usernameReg'])
    await app.click(selectors['registerBtn'], '')
    await app.waitForText(selectors['welcomeH1'], 'Welcome') 
    await app.click(selectors['logout'], '')
    // Login with correct username and passowrd
    await app.typeText(selectors['usernameLogin'], rightUsername)
    await app.typeText(selectors['passwordLogin'], password)
    await app.click(selectors['loggin'], '')
    await app.click(selectors['logout'], '')
    // Login with correctpassword and wrong useranme
    await app.typeText(selectors['usernameLogin'], 'test')
    await app.typeText(selectors['passwordLogin'], password)
    await app.click(selectors['loggin'], '')
    await app.assertVisible(selectors['errorPasswordOrUsername'], 'The username and password could not be verified.')
    // Login with correct Username and wrong password
    await app.typeText(selectors['usernameLogin'], rightUsername)
    await app.typeText(selectors['passwordLogin'], 'test123')
    await app.click(selectors['loggin'], '')
    await app.break()
})

