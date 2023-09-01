const {test, expext, expect} = require('@playwright/test')
import 
            test('My first test ', async ({page}) => {
           const Login = new LoginPage()
           await page.goto('https://google.com')
           await expect(page).toHaveTitle('Google')
           await page.locator('role=combobox[name="Тражи"]').fill('Milan Mrljes')
           //await page.click('//div/form/div/div/div[4]/center/input[1]')
           await page.click('//div[1]/div[3]/form/div[1]/div[1]/div[4]/center/input[2]')
           await.page.close()
            })