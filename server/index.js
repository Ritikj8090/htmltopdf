const app = require("express")();

chrome = require("chrome-aws-lambda");
puppeteer = require("puppeteer-core");

app.get("/api", async (req, res) => {
  options = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  };

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://www.google.com");
    res.send(await page.title());
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started");
});

module.exports = app;
