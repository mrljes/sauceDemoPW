import {selectors} from '../selectors/common';
import { SSN, adress, city, firstName, lastName, password, phone, state, zipcode, wrong_password, wrong_username } from '../selectors/credentials'
import { test, expect } from '../util/fixtures';
let dt = new Date()
let random_username='user-'+dt.getTime()
let rightUsername

test('Billpay and check transaction', async({ loginPage, app }) => {
    await loginPage.navigate()
    // Registration
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
    // Bill payment error 1
    await app.click(selectors['billPayBtn'], '')
    await app.click(selectors['sendPaymentBtn'], '')
    await app.assertTextPresent(selectors['requiredText'], 'Payee name is required.')
    // Bill payment error 2
    await app.typeText(selectors['paymeeName'], 's')
    await app.typeText(selectors['adressPaymee'], 's')
    await app.typeText(selectors['cityPaymee'], 's')
    await app.typeText(selectors['statePaymee'], 's')
    await app.typeText(selectors['zipPaymee'], 's')
    await app.typeText(selectors['phonePaymee'], 's')
    await app.typeText(selectors['accountPaymee'], 's')
    await app.typeText(selectors['verifyAccPaymee'], 's')
    await app.typeText(selectors['amountPaymee'], '22')
    await app.click(selectors['sendPaymentBtn'], '')
    await app.assertTextPresent(selectors['validNumber'], 'Please enter a valid number.')
    await app.assertTextPresent(selectors['validAmount'], 'Please enter a valid amount.')
    // Bill payment successfuly 
    await app.typeText(selectors['paymeeName'], 'Pera')
    await app.typeText(selectors['adressPaymee'], 'Kneza Milosa')
    await app.typeText(selectors['cityPaymee'], 'Arandjelovac')
    await app.typeText(selectors['statePaymee'], 'Sumadija')
    await app.typeText(selectors['zipPaymee'], '34300')
    await app.typeText(selectors['phonePaymee'], '+381655555')
    await app.typeText(selectors['accountPaymee'], '2')
    await app.typeText(selectors['verifyAccPaymee'], '2')
    await app.typeText(selectors['amountPaymee'], '22')
    await app.click(selectors['sendPaymentBtn'], '')
    await app.assertTextPresent(selectors['paymentCompleteText'], 'Bill Payment Complete')
    // Find transaction button
    await app.click(selectors['findTransactionBtn'], '')
    await app.typeText(selectors['findAmmInput'], '22')
    await app.click(selectors['findTransBtn'], '')
    // await app.assertVisible(selectors['transactionResults'], '')
    await app.click(selectors['adminPageBtn'], '')
    await app.click(selectors['soapRadioBtn'], '')
    
    await app.break() 
    })