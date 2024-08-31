import puppeteer from 'puppeteer';

const BROWSERLESS_API_URL = 'https://chrome.browserless.io'; // Replace with your Browserless API URL
const BROWSERLESS_API_KEY = 'QlT5BCNI21Q3Hy4cd4c6b78753a8463397070c19f0'; // Replace with your Browserless API key

export async function GET() {
  try {
    // Connect to Browserless API
    const browser = await puppeteer.connect({
      browserWSEndpoint: `${BROWSERLESS_API_URL}/?token=${BROWSERLESS_API_KEY}`,
    });

    const page = await browser.newPage();

    await page.goto('https://medium.oldcai.com/', { waitUntil: 'networkidle2' });

    // Wait for the table to load
    await page.waitForSelector('table.table.table-bordered.table-striped.table-hover');

    // Extract the table data
    const tags = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.table.table-bordered.table-striped.table-hover tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 5) {
          return {
            rank: cells[0].innerText.trim(),
            name: cells[1].innerText.trim().split(' ')[0], // Remove the icon
            value: cells[2].innerText.trim(),
            followers: cells[3].innerText.trim(),
            stories: cells[4].innerText.trim(),
          };
        }
        return null;
      }).filter(row => row !== null);
    });

    await browser.disconnect(); // Close the connection

    return new Response(JSON.stringify(tags), { status: 200 });
  } catch (error) {
    console.error('Error in /api/scrape:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}
