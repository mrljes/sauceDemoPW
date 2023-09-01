import { expect, Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly accountTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.accountTitle = page.locator('#accountTitle')
    
  }
  
  async goto() {
    await this.page.goto('/main')
  }

}