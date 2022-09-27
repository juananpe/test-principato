const puppeteer = require('puppeteer');
const Jimp = require('jimp');

let capture = async (page, index) => {
  let selector = "#image"
  await page.waitForSelector(selector);
  const element = await page.$(selector);

  if (index==7) element.click()

  // Capture screenshot
  await element.screenshot({
    path: `img${index}.jpg`,
  });

}


(async () => {

  // Create a browser instance
  const browser = await puppeteer.launch({ headless: true });

  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1280, height: 720 });

  const website_url = 'http://localhost:5500/';

  // Open URL in current page
  await page.goto(website_url);


  for (let i = 0; i <= 7; i++) {

    await capture(page, i)

    await new Promise(r => setTimeout(r, 3100));
  }

  // capture(7) and capture(8) should be exactly the same (carrousel is stopped)
  await capture(page, 8)

  // Close the browser instance
  await browser.close();


  for (let i = 0; i <= 8; i++) {
    await Promise.all([Jimp.read(`./img${i}.jpg`), Jimp.read(`imgs/img${i}.jpg`)]).then(([img1, img2]) => {
      var distance = Jimp.distance(img1, img2); // perceived distance
      var diff = Jimp.diff(img1, img2); // pixel difference

      if (distance < 0.15 || diff.percent < 0.15) {
        console.log(`img${i} match`)
      } else {
        console.log(`img${i} not a match`)
      }
    })
  }

})();




