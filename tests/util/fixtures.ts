import { test as base } from '@playwright/test'
import { PlaywrightDevPage } from '../util/pages/PlaywrightDevPage'
import { LoginPage } from '../util/pages/LoginPage'
import { HomePage } from '../util/pages/HomePage'

// Declare the types of your fixtures.
type Fixtures = {
    app: PlaywrightDevPage;
    loginPage: LoginPage;
    homePage: HomePage;
}

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
      await use(new PlaywrightDevPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  homePage : async ({ page }, use) => {
    await use(new HomePage(page))
  }
})
export { expect } from '@playwright/test';