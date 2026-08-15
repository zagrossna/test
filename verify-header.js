const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForSelector("header#home");
  await page.waitForTimeout(1500); // let video start playing

  const videoState = await page.evaluate(() => {
    const v = document.querySelector("video");
    if (!v) return null;
    return {
      src: v.currentSrc,
      readyState: v.readyState,
      paused: v.paused,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      currentTime: v.currentTime,
    };
  });

  const dir = await page.evaluate(() => document.documentElement.dir);
  const lang = await page.evaluate(() => document.documentElement.lang);

  await page.screenshot({ path: "C:\\Users\\dell\\AppData\\Local\\Temp\\claude\\C--Users-dell\\3ba12740-498e-437f-bc81-7bd64772d355\\scratchpad\\header-desktop.png" });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:\\Users\\dell\\AppData\\Local\\Temp\\claude\\C--Users-dell\\3ba12740-498e-437f-bc81-7bd64772d355\\scratchpad\\header-mobile.png" });

  console.log(JSON.stringify({ videoState, dir, lang, errors }, null, 2));

  await browser.close();
})();
