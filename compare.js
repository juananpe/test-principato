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
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
  
  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1280, height: 720 });

  const website_url = process.argv[2] || 'http://localhost:5500/'


  // Open URL in current page
  await page.goto(website_url);

  //       fre  lim  mand  manz    mel   sesamo  fre
  // 0-3  3-6   6-9  9-12  12-15  15-18  18-21  21-24
  // 1.5  4.5   7.5  10.5   13.5   16.5   19.5   22.5

  await new Promise(r => setTimeout(r, 1500));

  for (let i = 0; i <= 7; i++) {

    await capture(page, i)

    await new Promise(r => setTimeout(r, 3000));
  }

  // capture(7) and capture(8) should be exactly the same (carrousel is stopped)
  await capture(page, 8)

  // Close the browser instance
  await browser.close();


  // Compare images
  let numEquivalent = 0
  for (let i = 0; i <= 8; i++) {
    await Promise.all([Jimp.read(`./img${i}.jpg`), Jimp.read(`imgs/img${i}.jpg`)]).then(([img1, img2]) => {
      let distance = Jimp.distance(img1, img2); // perceived distance
      let diff = Jimp.diff(img1, img2); // pixel difference

      if (distance < 0.15 || diff.percent < 0.15) {
        // console.log(`img${i} match`)
        numEquivalent++
      } else {
        console.log(`img${i} not a match`)
      }
    })
  }
  if (numEquivalent == 9) {
    console.log("Todo OK!")
  }

})();




