import express from "express";
import { expect } from "chai";
import path from "path";
import { chromium } from "playwright";

const app = express();
app.use(express.static(path.join(process.cwd(), "dist")));
app.use(express.static(path.join(process.cwd(), "public")));

const url = "http://localhost:3000";

describe("End to End Tests", function () {
    this.timeout(10000);

    let httpServer = null;
    let browser = null;
    let page = null;

    before(async () => {
        httpServer = app.listen(3000);
        browser = await chromium.launch();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(url);
    });

    afterEach(async () => {
        await page.close();
    });

    after(async () => {
        await browser.close();
        httpServer.close();
    });

    // This is where your code is going to go
    it("should contain a <h1> element for the page title", async () => {
    await page.waitForSelector("h1", { timeout: 2000 });
    const header = await page.locator("h1").textContent();
    expect(header).to.not.be.null;
    expect(header.trim()).to.equal("Mortgage Calculator");
    });

    it('should contain a Calculate button', async () => {
        await page.waitForSelector("#calculate", { timeout: 2000 });
        const buttonText = await page.locator("#calculate").textContent();
        expect(buttonText).to.not.be.null;
        expect(buttonText.trim()).to.equal("Calculate");
    });

    it('should contain a Monthly option', async () => {
        await page.waitForSelector("option[value='12']", {state: "attached", timeout: 2000 });
        const monthlyText = await page.locator("option[value='12']").textContent();
        expect(monthlyText).to.not.be.null;
        expect(monthlyText.trim()).to.equal("Monthly");
    });

    it('should contain a Quarterly option', async () => {
        await page.waitForSelector("option[value='4']", {state: "attached", timeout: 2000 });
        const quarterlyText = await page.locator("option[value='4']").textContent();
        expect(quarterlyText).to.not.be.null;
        expect(quarterlyText.trim()).to.equal("Quarterly");
    });

    it('should contain a principal input', async () => {
        await page.waitForSelector("input[name=principal]", { timeout: 2000 });
        const principalVisible = await page.locator("input[name=principal]").isVisible();
        expect(principalVisible).to.be.true;
    });

    it('should contain an interest rate input', async () => {
        await page.waitForSelector("input[name=interestRate]", { timeout: 2000 });
        const interestRateVisible = await page.locator("input[name=interestRate]").isVisible();
        expect(interestRateVisible).to.be.true;
    });

    it('should contain a loan term input', async () => {
        await page.waitForSelector("input[name=loanTerm]", { timeout: 2000 });
        const loanTermVisible = await page.locator("input[name=loanTerm]").isVisible();
        expect(loanTermVisible).to.be.true;
    });

    it("should correctly calculate mortgage", async () => {
      await page.fill("input[name=principal]", "300000");
      await page.fill("input[name=interestRate]", "3.75");
      await page.fill("input[name=loanTerm]", "30");
      await page.selectOption("select[name=period]", "12");
      await page.click("button#calculate");
      await page.waitForSelector("#output", { timeout: 4000 });
      const outputText = await page.locator("#output").textContent();
      expect(outputText.trim()).to.equal("$1389.35");
    }).timeout(6500);
});