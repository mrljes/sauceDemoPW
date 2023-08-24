//import { text } from "stream/consumers"

async typeText(text){
    await page.locator("#input").fill(text);
}