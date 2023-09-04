import { expect, Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page
  readonly username_input: Locator
  readonly password_input: Locator
  readonly login_button: Locator
  readonly legend: Locator
  readonly forgot_password_link: Locator
  readonly bottom_links: Locator

  constructor(page: Page) {
    this.page = page
    this.username_input = page.locator('//*[@id="user-name"]')
    this.password_input = page.locator('//*[@id="password"]')
    this.login_button = page.locator('//*[@id="login-button"]')
    this.legend = page.locator('.legend')
    this.forgot_password_link = page.locator('a:has-text("Forgot your Password?")')
    this.bottom_links = page.locator('#bottom-links')
  }

  async navigate() {
    await this.page.goto('/')
  }

  async login(username,password) {
    await this.username_input.fill(username)
    await this.password_input.fill(password)
    await this.login_button.click()
  }

}