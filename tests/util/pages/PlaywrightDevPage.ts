// playwright-dev-page.ts
import { expect, Locator, Page } from "@playwright/test";
import assert from "assert";
import {selectors} from '../../selectors/common';
const path = require("path");

export class PlaywrightDevPage {
  readonly page: Page;
  readonly admin_username: String;
  readonly admin_password: String;
  readonly administrationlink: Locator;
  readonly terminalslink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.administrationlink = page.locator('a:has-text("Administration")');
    this.terminalslink = page.locator('a:has-text("Terminals")');
  }

  async deleteUser(username, password, user) {
    await this.typeText("#login_name", username);
    await this.typeText("#login_password", password);
    await this.clickAndWait("[name='commit']", "");
    await this.waitForNotVisible("#global_loading_indicator", "");
    await this.clickAndWait("a:has-text('Users')", "");
    await this.typeText("#search", user);
    await this.click("input[name='commit']", "");
    await this.waitForNotVisible("#global_loading_indicator", "");
    // Delete the user if exists
    if (
      await this.isVisible(
        "css=tbody#contact-tbody td:has-text('" + user + "') >> nth=0"
      )
    ) {
      await this.click("tbody#contact-tbody > tr >> nth=0", "");
      await this.waitForNotVisible("#global_loading_indicator", "");
      await this.click("a:has-text('Login')", "");
      await this.waitForNotVisible("#global_loading_indicator", "");
      this.page.on("dialog", (dialog) => dialog.accept());
      await this.click("a#delete_user_link", "");
      await this.waitForNotVisible("#global_loading_indicator", "");
    }
  }

  async readOnlyUser(user) {
    await this.typeText("#login_name", this.admin_username);
    await this.typeText("#login_password", this.admin_password);
    await this.clickAndWait("[name='commit']", "");
    await this.clickAndWait("a:has-text('Home')", "");
    await this.clickAndWait("a:has-text('Users')", "");
    await this.typeText("#search", user);
    await this.click("input[name='commit']", "");
    await this.waitForNotVisible("#global_loading_indicator", "");
    await this.click("tbody#contact-tbody > tr >> nth=0", "");
    await this.waitForNotVisible("#global_loading_indicator", "");
    await this.click("a:has-text('Login')", "");
    await this.waitForNotVisible("#global_loading_indicator", "");
    await this.select("#user_role", "Read Only");
    await this.click("input[name='commit']", "");
    await this.waitForNotVisible("#global_loading_indicator", "");
  }

  async createTransaction() {
    await this.select("#merchant_select", "FD Processor CAD");
    await this.select("#terminal_select", "FD Processor CAD Terminal 1 (CAD)");
    //await this.assertSelectedLabel(selectors[12],'350')
    await this.select("#transaction_type_select", "Purchase");
    await this.assertText("#terminal_currency_display", "CAD");
    await this.typeText("#vpos_request_amount", "1001");
    await this.typeText("#vpos_request_cardholder_name", "purchase1");
    await this.typeText("#vpos_request_cc_number", "5500000000000004");
    await this.typeText("#vpos_request_reference_no", "ref num at purchase");
    await this.typeText("#vpos_request_customer_ref", "cust ref at purchase");
    await this.typeText("#vpos_request_reference_3", "ref num3 at purchase");
    await this.click("#processTransaction", "");
    await this.waitForVisible("#receipt", "");
    await this.assertVisible(".ui-widget-overlay", "");
    let element = this.page.locator(".ui-widget-overlay >> nth=0");
    const color = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue("background-color");
    });
    await expect(color).toBe("rgb(133, 187, 239)");
    await this.assertText("css=span.vpos_receipt_status_approved", "APPROVED");
    await this.assertMatches("css=div#receipt pre", ".*REFERENCE.*#.*:.*M.*");
    let receiptText = await this.storeText("css=pre");
    let receiptAuth1 = receiptText.match(/ET\d[0-9]*/);
    //-verify receipt information-
    //-verify receipt buttons-
    await this.assertElementPresent(
      "div#email_receipt_controls button#receipt_print_button",
      ""
    );
    await this.assertElementPresent(
      "div#email_receipt_controls button#show_email_form_button",
      ""
    );
    await this.assertElementPresent(
      "div#email_receipt_controls button#receipt_close_button",
      ""
    );
  }

  async waitToDeleteRecurringPlans() {
    if ("0" == (await this.page.locator(selectors["365"]).innerText())) return;
    let wait_time = 3000;
    // Loop if and while "idx" plan is in Queued for Processing
    while (
      await this.isVisible(
        "css=tbody#mbatch-tbody td:has-text('Queued for Processing') >> nth=0"
      )
    ) {
      await this.page.waitForTimeout(wait_time);
      await this.clickAndWait(selectors["all_plans_link"], "");
    }
    // Loop while "idx" plan is in Processing
    while (
      await this.isVisible(
        "css=tbody#mbatch-tbody td:has-text('Processing') >> nth=0"
      )
    ) {
      await this.page.waitForTimeout(wait_time);
      await this.clickAndWait(selectors["all_plans_link"], "");
    }
  }

  async waitForRecurringProcessing() {
    let wait_time = 3000;
    // Loop until Queued for Processing appears to any plan (the first one)
    while (
      !(await this.isVisible(
        "css=tbody#mbatch-tbody tr:has-text('Queued for Processing') >> nth=0"
      ))
    ) {
      await this.page.waitForTimeout(wait_time);
      await this.clickAndWait(selectors["all_plans_link"], "");
    }
    // Loop until Queued for Processing is visible for any plan (the first one)
    while (
      await this.isVisible(
        "css=tbody#mbatch-tbody tr:has-text('Queued for Processing') >> nth=0"
      )
    ) {
      await this.page.waitForTimeout(wait_time);
      await this.clickAndWait(selectors["all_plans_link"], "");
    }
    // Loop until Processing is visible for any plan (the first one)
    while (
      await this.isVisible(
        "css=tbody#mbatch-tbody td:has-text('Processing') >> nth=0"
      )
    ) {
      await this.page.waitForTimeout(wait_time);
      await this.clickAndWait(selectors["all_plans_link"], "");
    }
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async awaitElementToShow(selector, text) {
    while (expect(this.page.locator(selector).textContent() == text)) {
      await this.page.waitForTimeout(500);
    }
  }

  async assertText(locator, text) {
    await expect(this.page.locator(locator).first()).toHaveText(text);
  }

  async assertMatches(locator, text) {
    await expect(this.page.locator(locator).first()).toContainText(
      new RegExp(text)
    );
  }

  async verifyReceipt(locator, text) {
    // let element=this.page.locator(locator)
    // let innertext=element.innerText()
    // (await innertext).replace(/\n+/g, '')
    // console.log(innertext)
    // await expect(innertext.).toMatch(new RegExp(text))
    await expect(
      (await this.page.locator(locator).first().innerText()).replace(/\s+/g, "")
    ).toMatch(new RegExp(text.replace(/\s+/g, "")));
  }

  async assertTextPresent(locator, text) {
    await expect(this.page.locator(locator)).toContainText(text);
  }

  async assertSelectOptions(locator, text) {
    await this.page.waitForLoadState();
    const rows = this.page.locator(locator + " option");
    const items = await rows.allTextContents();
    await expect(items.sort()).toEqual(text.sort());
  }

  async clickonTable(locator, rowContents, additionalOptions = "") {
    await this.page.waitForLoadState();
    let rows = this.page.locator(locator + " tr");
    for (let i = 0; i < rowContents.length; i++) {
      rows = rows.filter({ hasText: rowContents[i] });
    }
    if (additionalOptions != "") {
      await rows.locator(additionalOptions).click();
    } else {
      await rows.click();
    }
  }

  async assertTableRow(locator, rowContents, additionalOptions = "") {
    let rows = this.page.locator(locator + " tr");
    for (let i = 0; i < rowContents.length; i++) {
      rows = rows.filter({ hasText: rowContents[i] });
    }
    if (additionalOptions != "") {
      await expect(rows.locator(additionalOptions)).toBeVisible();
    } else {
      await expect(rows).toBeVisible();
    }
  }

  async assertTableHeader(locator, rowContents) {
    let rows = this.page.locator(locator + " th");
    console.log(rows);
    for (let i = 0; i < rowContents.length; i++) {
      await expect(rows.filter({ hasText: rowContents[i] })).toBeVisible();
    }
  }

  async assertNotText(locator, text) {
    await expect(this.page.locator(locator)).not.toHaveText(text);
  }

  async assertLocation(url, text) {
    await expect(this.page).toHaveURL(url);
  }

  async waitForConfirmation(title, text) {
    await this.page.on("dialog", (dialog) => dialog.accept());
  }

  async waitForTitle(title, text) {
    await expect(this.page).toHaveTitle(title);
  }

  async assertTextNotPresent(locator, text) {
    await expect(this.page.locator(locator)).not.toContainText(text);
  }

  async assertElementPresent(locator, text) {
    await expect(this.page.locator(locator)).toBeVisible();
  }

  async assertElementPresentFirst(locator, text) {
    await this.page.locator(locator).first();
    await expect(this.page.locator(locator).first()).toBeVisible();
  }

  async assertElementsPresent(locator, text) {
    await expect(this.page.$$(locator)).toBeDefined();
  }

  async assertElementNotPresent(locator, text) {
    await expect(this.page.locator(locator)).not.toBeVisible();
  }

  async waitForElementPresentIn(locator, text) {
    await this.page.waitForTimeout(300);
    await expect(this.page.locator(locator)).toBeVisible({ timeout: 150000 });
  }

  async waitForElementPresent(locator, text) {
    await this.page.waitForSelector(locator, { state: "visible" });
  }

  async assertValue(locator, value) {
    await expect(this.page.locator(locator)).toHaveValue(value);
  }

  async assertNotValue(locator, value) {
    await expect(this.page.locator(locator)).not.toHaveValue(value);
  }

  async storeValue(locator) {
    return this.page.locator(locator).inputValue();
  }

  async storeText(locator) {
    return this.page.locator(locator).first().innerText();
  }

  async storeOptions(locator) {
    const rows = this.page.locator(locator + " option");
    const items = await rows.allTextContents();
    return items.sort();
  }

  async assertVisible(locator, value) {
    await expect(this.page.locator(locator)).toBeVisible();
  }

  async assertNotVisible(locator, value) {
    await expect(this.page.locator(locator)).not.toBeVisible();
  }

  async waitForVisible(locator, value) {
    await this.page.waitForSelector(locator, { state: "visible" });
  }

  async waitForNotVisible(locator, value) {
    await this.page.waitForSelector(locator, { state: "hidden" });
  }

  async waitForText(locator, text) {
    await this.page.waitForLoadState();
    await this.page.waitForSelector(locator, { state: "visible" });
    await expect(this.page.locator(locator)).toContainText(text);
  }

  async typeText(locator, text) {
    await this.page.waitForLoadState();
    await this.page.locator(locator).fill(text);
  }

  async uploadFile(locator, file) {
    var filePath = path.join(__dirname, "../fixtures/" + file);
    await this.page.setInputFiles(locator, filePath);
  }

  async isVisible(locator) {
    return await this.page.locator(locator).isVisible();
  }

  async clickAndWait(locator, text) {
    await this.page.waitForLoadState();
    await this.page.locator(locator).click();
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async clickAndWaitFirst(locator, text) {
    await this.page.waitForLoadState();
    await this.page.click(locator);
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async clickAndWaitForElement(locator, text) {
    await this.page.waitForLoadState();
    await this.page.locator(locator).click();
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 150000 });
  }

  async clickOnOkOnly() {
    this.page.on("dialog", async (dialog) => {
      //Click on OK Button
      await dialog.accept();
    });
    // Click on Trigger a Confirmation button
    await this.page.click("#delete_user_link");
  }

  async click(locator, text) {
    await this.page.waitForLoadState();
    await this.page.locator(locator).click();
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async clickAOF() {
    await this.page.waitForLoadState();
    await this.page.click('button:has-text("[ add optional fields ]")');
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async clickFirst(locator, text) {
    await this.page.waitForLoadState();
    await this.page.locator(locator).first().click();
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async select(locator, text) {
    await this.page.selectOption(locator, { label: text });
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async selectByValue(locator, valueText) {
    await this.page.selectOption(locator, { value: valueText });
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async selectAndWait(locator, text) {
    await this.page.selectOption(locator, { label: text });
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
  }

  async assertCssCount(locator, len) {
    const list = this.page.locator(locator);
    var y: number = +len;
    await expect(list).toHaveCount(y);
  }

  async uncheckIfChecked(locator) {
    await this.page.waitForLoadState();
    if (await this.page.locator(locator).isChecked()) {
      await this.page.locator(locator).click();
      await expect(this.page.locator(locator)).not.toBeChecked();
    }
  }

  async check(locator, len) {
    await this.page.waitForLoadState();
    if (await this.page.locator(locator).isChecked()) {
      await expect(this.page.locator(locator)).toBeChecked();
    } else {
      //this.page.on('dialog', dialog => dialog.accept())
      await this.page.locator(locator).click();
      await expect(
        this.page.locator("#global_loading_indicator")
      ).not.toBeVisible({ timeout: 30000 });
      await expect(this.page.locator(locator)).toBeChecked();
    }
  }

  async checkFirst(locator, len) {
    await this.page.waitForLoadState();
    if (await this.page.locator(locator).first().isChecked()) {
      await expect(this.page.locator(locator).first()).toBeChecked();
    } else {
      //this.page.on('dialog', dialog => dialog.accept())
      await this.page.locator(locator).first().click();
      await expect(
        this.page.locator("#global_loading_indicator")
      ).not.toBeVisible({ timeout: 30000 });
      await expect(this.page.locator(locator).first()).toBeChecked();
    }
  }

  async uncheck(locator, len) {
    await this.page.waitForLoadState();
    if (await this.page.locator(locator).isChecked()) {
      //this.page.on('dialog', dialog => dialog.accept())
      await this.page.locator(locator).click();
      await expect(
        this.page.locator("#global_loading_indicator")
      ).not.toBeVisible({ timeout: 30000 });
      await expect(this.page.locator(locator)).not.toBeChecked();
    } else {
      await expect(this.page.locator(locator)).not.toBeChecked();
    }
  }

  async unselect(locator, len) {
    await this.page.waitForLoadState();
    if (await this.page.locator(locator).isChecked()) {
      //this.page.on('dialog', dialog => dialog.accept())
      await this.page.locator(locator).click();
      await expect(
        this.page.locator("#global_loading_indicator")
      ).not.toBeVisible({ timeout: 30000 });
      // await expect(this.page.locator(locator)).not.toBeChecked()
    } else {
      // await expect(this.page.locator(locator)).not.toBeChecked()
    }
  }

  async assertAttribute(locator, key, value) {
    await expect(this.page.locator(locator)).toHaveAttribute(key, value);
  }

  async assertDisabled(locator, value) {
    await expect(this.page.locator(locator)).toBeDisabled();
  }

  async assertChecked(locator, value) {
    await expect(this.page.locator(locator).first()).toBeChecked();
  }

  async assertNotChecked(locator, value) {
    await expect(this.page.locator(locator)).not.toBeChecked();
  }

  async assertEditable(locator, value) {
    await expect(this.page.locator(locator)).toBeEditable();
  }

  async assertNotEditable(locator, value) {
    await expect(this.page.locator(locator)).not.toBeEditable();
  }

  async assertSelectedLabel(selector, label) {
    if (label == "None") {
      await expect(this.page.locator(selector)).toHaveText("");
    } else {
      let elem = this.page.locator(selector);
      let chil = elem.locator(' option[selected="selected"]');
      if ((await chil.count()) != 0) {
        await expect(chil).toHaveText(label);
      } else {
        chil = elem.locator(" option");
        await expect(this.page.locator(selector)).toContainText(label);
      }
    }
  }

  // async assertSelectOptions(selector,values) {
  //   let elem= this.page.locator(selector)
  //   for (let item of values) {
  //     await expect(this.page.locator(selector)).toHaveText(item)
  //   }
  // }

  async inputFile(selector, filepath) {
    await this.page.setInputFiles(selector, filepath);
  }

  async storeEval(value) {
    return eval(value);
  }

  async fireEvent(selector) {
    await this.page.locator(selector).evaluate((e) => e.blur());
  }

  async typeKeys(locator, text) {
    await this.page.locator(locator).click();
    await this.page.keyboard.press(" ");
  }

  async mouseOver(selector) {
    await this.page.hover(selector);
  }
  //TODO: Find another way to wait for condition
  async waitForNotText(locator, text) {
    while ((await this.page.locator(locator).innerText()).valueOf() == text) {
      await this.page.waitForTimeout(50);
    }
  }

  //TODO: Find another way to wait for condition
  async waitForChecked(locator) {
    while (!(await this.page.locator(locator).isChecked())) {
      await this.page.waitForTimeout(50);
    }
  }

  //TODO: Find another way to wait for condition
  async waitForCssCount(locator, value) {
    while (!(await this.page.locator(locator).count()) == value) {
      await this.page.waitForTimeout(50);
    }
  }

  async assertNotTable(locator, text) {
    await expect(this.page.locator(locator)).not.toHaveText(text);
  }

  async assertAllFields(selector) {
    var array = selector.split(",");
    array.forEach((e) => expect(this.page.locator(e)).toBeVisible());
  }

  async assertAllFieldsPresentInDOM(selector) {
    var array = selector.split(",");
    array.forEach((e) => expect(this.page.locator(e)).toHaveCount(1));
  }

  async assertExpression(actual, expected) {
    assert.match(actual, new RegExp(expected));
  }

  async storeCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = (today.getDate() < 10 ? "0" : "") + today.getDate();
    return yyyy + "/0" + mm + "/" + dd; // TODO "0"
  }

  async verifyElementNotPresent(selector) {
    await expect(this.page.locator(selector)).toHaveCount(0);
  }
  //This function for checbox check if checked or not and for element it will check text
  async verifyValue(selector, value) {
    if (value == "on") {
      await expect(this.page.locator(selector).isChecked()).toBeTruthy();
    } else if (value == "off") {
      await expect(this.page.locator(selector).isChecked()).toBeFalsy();
    } else {
      await expect(this.page.locator(selector)).toHaveValue(value);
    }
  }

  async storeSelectOptions(selector) {
    return (await this.page.locator(selector).innerText()).valueOf();
  }

  async assertConfirmation(selector) {
    this.page.on("dialog", async (dialog) => {
      //TODO: check if first expect is needed
      // expect(dialog.type()).toContain('alert')
      // expect(dialog.message()).toContain(selector)
      await dialog.accept();
    });
  }

  async assertAlert(selector) {
    this.page.on("dialog", async (dialog) => {
      //TODO: check if first expect is needed
      // expect(dialog.type()).toContain('alert')
      // expect(dialog.message()).toContain(selector)
      await dialog.accept();
    });
  }

  //TODO: "acceptConfirmation" same function, there are many functions for accepting alert
  async chooseOkOnNextConfirmation(selector) {
    await this.page.waitForLoadState();
    this.page.once("dialog", async (dialog) => {
      //TODO: check if first expect is needed
      // expect(dialog.type()).toContain('confirm')
      // expect(dialog.message()).toContain(selector)
      await dialog.accept();
    });
  }
  async chooseOkOnNextConfirmationActivate(locator, selector) {
    await this.page.waitForLoadState();
    await this.page.locator(locator).first().click();
    await expect(
      this.page.locator("#global_loading_indicator")
    ).not.toBeVisible({ timeout: 30000 });
    this.page.once("dialog", async (dialog) => {
      //TODO: check if first expect is needed
      // expect(dialog.type()).toContain('confirm')
      // expect(dialog.message()).toContain(selector)
      await dialog.accept();
    });
  }

  async acceptConfirmation(selector) {
    this.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
  }

  async focus(selector) {
    await this.page.locator(selector).focus();
  }

  async assertEval(actual, expected) {
    expect(eval(actual)).toEqual(expected);
  }

  async waitForTextPresent(selector) {
    await expect(this.page.locator(selector)).not.toHaveText(selector);
  }
  //TODO: in Selenium IDE verifyTable verifies the text of targeted table's row and column, check if this will work f
  async verifyTable(selector, text) {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  async verifyVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async waitForSelectOptions(selector, value) {
    await expect(this.page.locator(selector)).toContainText(value);
  }

  async waitForNotChecked(locator) {
    while (await this.page.locator(locator).isChecked()) {
      await this.page.waitForTimeout(50);
    }
  }

  async open(url) {
    await this.page.goto(url);
  }

  async assertAllWindowTitles(title) {
    await expect(this.page).toHaveTitle(title);
  }
  //TODO: Check date format
  async storeCurrentDateMMDDYY() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    return mm + "/" + dd + "/" + yyyy;
  }

  async assertNotSelectOptions(locator, text) {
    const rows = this.page.locator(locator + " option");
    const items = await rows.allTextContents();
    await expect(items.sort()).not.toEqual(text.sort());
  }
  /*  
  TODO: waitForAttribute(attributeLocator, pattern)
  *attributeLocator - an element locator followed by an @ sign and then the name of the attribute, e.g. "foo@bar"
  this is way we use split finction
  CHECK is it working
  */
  async waitForAttribute(selector, value) {
    let sel = selector.split("@");
    await expect(this.page.locator(sel[0])).toHaveAttribute(sel[1], value);
  }

  async goBackAndWait() {
    await this.page.goBack();
  }

  async clickAt(selector) {
    await this.page.locator(selector).click();
  }

  // async isVisible(selector) {
  //   return this.page.locator(selector).isVisible()
  // }

  async deleteUserIfExist() {
    if (await this.isVisible(selectors[3093])) {
      await this.click(selectors[3093], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.click(selectors["loginLink"], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.clickAndWait(selectors["delete_user_link"], "");
      //await this.clickAndWait(selectors["delete_user_link"], '')
    }
  }

  async deleteUserIfExistFD() {
    if (await this.isVisible(selectors[3093])) {
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.click(selectors[3093], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.click(selectors["loginLink"], "");
      await this.select(selectors["user_role"], "Read Only");
      await this.click(selectors["submitButton"], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.typeText(selectors["search"], "seleniumFDnew");
      await this.click(selectors["submitButton"], "Search");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.click(selectors[3093], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.click(selectors["loginLink"], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.clickAndWait(selectors["delete_user_link"], "");
      //await this.clickAndWait(selectors["delete_user_link"], '')
    }
  }

  async moveToRestrictedIfAllowed() {
    if (
      await this.isVisible(
        '#allowed option:has-text("E-xact Testing - Recurring")'
      )
    ) {
      await this.select(selectors["allowed"], "E-xact Testing - Recurring");
      await this.click(selectors["add_to_restricted_list_bt"], "");
    }
  }

  async moveToRestrictedIfAllowedMerchAdmin() {
    if (
      await this.isVisible(
        '#allowed option:has-text("E-xact Testing - Recurring")'
      )
    ) {
      await this.select(selectors["allowed"], "E-xact Testing - Recurring");
      await this.click(selectors["add_to_restricted_list_bt"], "");
    }
  }

  async moveToRestrictedIfAllowedPp() {
    if (
      await this.isVisible(
        '#allowed option:has-text("E-xact Testing - Payment Pages")'
      )
    ) {
      await this.select(selectors["allowed"], "E-xact Testing - Payment Pages");
      await this.click(selectors["add_to_restricted_list_bt"], "");
    }
  }

  async moveToRestrictedIfAllowedAPI() {
    if (
      await this.isVisible('#allowed option:has-text("E-xact Testing - API")')
    ) {
      await this.select(selectors["allowed"], "E-xact Testing - API");
      await this.click(selectors["add_to_restricted_list_bt"], "");
    }
  }

  async moveToRestrictedIfAllowedAT() {
    if (
      await this.isVisible(
        '#allowed option:has-text("E-xact Testing - Active Terminal")'
      )
    ) {
      await this.select(
        selectors["allowed"],
        "E-xact Testing - Active Terminal"
      );
      await this.click(selectors["add_to_restricted_list_bt"], "");
    }
  }

  async moveToRestrictedIfAllowedAN() {
    if (
      await this.isVisible(
        '#allowed option:has-text("E-xact Testing -- ACCOUNT..NAMES")'
      )
    ) {
      await this.select(
        selectors["allowed"],
        "E-xact Testing -- ACCOUNT..NAMES"
      );
      await this.click(selectors["add_to_restricted_list_bt"], "");
    }
  }

  //E-xact Testing -- ACCOUNT..NAMES

  async waitForElementNotPresent(selector) {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  async waitForValue(selector, value) {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  async assertToContainText(selector, value) {
    await expect(this.page.locator(selector)).toContainText(value);
  }

  async break() {
    await this.page.pause();
  }

  async verifyAttribute(selector, value) {
    let sel = selector.split("@");
    await expect(this.page.locator(sel[0])).toHaveAttribute(
      sel[1],
      new RegExp(value)
    );
  }

  async assertNotAttribute(selector, value) {
    let sel = selector.split("@");
    await expect(this.page.locator(sel[0])).not.toHaveAttribute(sel[1], value);
  }

  async goBack() {
    await this.page.goBack();
  }

  async verifyExpression(actual, expected) {
    expect(actual).toEqual(expected);
  }

  async verifyNotText(locator, text) {
    await expect(this.page.locator(locator)).not.toHaveText(text);
  }

  async waitForSelectedLabel(selector, label) {
    let elem = this.page.locator(selector);
    let chil = elem.locator(' option[selected="selected"]');
    if ((await chil.count()) != 0) {
      await expect(chil).toHaveText(label);
    } else {
      chil = elem.locator(" option");
      await expect(this.page.locator(selector)).toHaveValue(label);
    }
  }

  async waitForSelectedValue(selector, value) {
    let elem = this.page.locator(selector);
    let chil = elem.locator(' option[selected="selected"]');
    if ((await chil.count()) != 0) {
      await expect(chil).toHaveText(value);
    } else {
      chil = elem.locator(" option");
      await expect(this.page.locator(selector)).toHaveValue(value);
    }
  }

  async verifyText(locator, text) {
    await expect(this.page.locator(locator)).toHaveText(text);
  }

  async storeExpressionTnxTag() {
    var text = await this.page.locator("//h4").innerText();
    return text.match(/[0-9]+/)?.toString()!;
  }

  async storeMatchETd4(text) {
    return text.match(/ET\d{4}/)[0];
  }

  async storeMatchD13D13(text) {
    return text.match(/\d{1,3}.\d{1,3}/);
  }


  async store(value) {
    return value;
  }
  async assertTitle(title) {
    await expect(this.page).toHaveTitle(title);
  }

  async assertXpathCount(selector, len) {
    const list = this.page.locator(selector);
    var y: number = +len;
    await expect(list).toHaveCount(y);
  }

  async storeLocation() {
    return await this.page.url();
  }

  async echo(value) {
    console.log(value);
  }

  async assertNotExpression(actual, expected) {
    expect(actual).not.toEqual(expected);
  }

  async verifyChecked(locator) {
    await expect(this.page.locator(locator)).toBeChecked();
  }

  async verifyNotChecked(locator) {
    await expect(this.page.locator(locator)).not.toBeChecked();
  }

  async waitForLocation(url) {
    expect(await this.page.url()).toContain(url);
  }

  async waitForNotEditable(selector) {
    expect(await this.page.locator(selector)).not.toBeEditable();
  }

  async waitForSomethingSelected(selector) {
    let elem = this.page.locator(selector);
    expect(elem.locator(' option[selected="selected"]')).not.toBeEmpty();
  }

  async storeCurrentDateTime() {
    let dt = new Date();
    return dt.toLocaleTimeString();
  }

  async sendKeys(selector, value) {
    await this.page.locator(selector).fill(value);
  }

  //These two are replaced with logoutIfLoggedIn()
  async gotoIf(x, y) {}
  async label(x, y) {}

  async logoutIfLoggedIn() {
    if (await this.page.locator("SignoutLink").isVisible()) {
      await this.clickAndWait("SignoutLink", "");
    }
  }

  async waitForPageToLoad() {}

  //TODO: this function only return iframe, all action inside frame should be replaced, instead of page.locator should be iframe.locator
  async selectFrame(frameSelector) {
    return this.page.frame(frameSelector);
  }

  async clickInIFrame(frameSelector, selector) {
    await this.page.frameLocator(frameSelector).locator(selector).click();
  }

  async typeInIFrame(frameSelector, selector, text) {
    await this.page.frameLocator(frameSelector).locator(selector).fill(text);
  }

  async testAccountTitle(account_name) {
    await this.page.waitForLoadState();
    if (await this.page.locator(selectors["accountTitle"]).isVisible()) {
      await this.assertText(selectors["accountTitle"], account_name);
    } else {
      // code that handles the error
      await this.assertText(selectors["accountTitleNoSelect"], account_name);
    }
  }




  async setSystemVars(x, y) {}

  async runScript(value) {
    eval(value);
  }

  async deleteFraudFiltersIfExsist() {
    while (await this.page.locator("#fraud_filter-empty-message").isHidden()) {
      await this.clickFirst("tbody#fraud_filter-tbody tr", "");
      await this.click(selectors["delete_link"], "");
      await this.waitForNotVisible(selectors["global_loading_indicator"], "");
      await this.page.waitForTimeout(300);
    }
  }

  async pause(pauseTime) {
    await this.page.waitForTimeout(pauseTime);
  }

  // returns true if element is checked
  async checkIfElementIsChecked(locator) {
    return await this.page.locator(locator).isChecked();
  }
}