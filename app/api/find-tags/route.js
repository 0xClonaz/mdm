import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

<<<<<<< HEAD
const BROWSERLESS_API_URL = 'https://chrome.browserless.io'; // Replace with your Browserless API URL
const BROWSERLESS_API_KEY = process.env.NEXT_PUBLIC_BROWSERLESS_API_KEY; // Replace with your Browserless API key

=======
>>>>>>> dd014170031abab1302d77145d71257c38704bd4
export async function POST(request) {
  const { story } = await request.json();

  if (!story || typeof story !== 'string') {
    return NextResponse.json({ error: 'Invalid story content' }, { status: 400 });
  }

  try {
<<<<<<< HEAD
    // Connect to Browserless API
    const browser = await puppeteer.connect({
      browserWSEndpoint: `${BROWSERLESS_API_URL}/?token=${BROWSERLESS_API_KEY}`,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
=======
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

>>>>>>> dd014170031abab1302d77145d71257c38704bd4
    await page.setViewport({ width: 1280, height: 800 });

    // Debug: Log network and console errors
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', (error) => console.error('PAGE ERROR:', error));

    await page.goto('https://medium.oldcai.com/best-tags/', { waitUntil: 'networkidle2' });

    // Debug: Capture initial page screenshot
    await page.screenshot({ path: 'screenshot_initial.png' });

    // Ensure the textarea and submit button are available
    const contentSelector = '#content';
    const submitButtonSelector = '#submit-button';

    await page.waitForSelector(contentSelector, { visible: true, timeout: 30000 });
    await page.waitForSelector(submitButtonSelector, { visible: true, timeout: 30000 });

    // Fill in the form and submit
    await page.type(contentSelector, story);
    await page.click(submitButtonSelector);

    // Debug: Capture screenshot after clicking
    await page.screenshot({ path: 'screenshot_after_click.png' });

    // Wait for the table to be visible and populated
    await page.waitForFunction(() => {
      const table = document.querySelector('table.table.table-bordered.table-striped.table-hover');
      return table && table.querySelectorAll('tbody tr').length > 0;
    }, { timeout: 120000 });

    // Extract the table data
    const tags = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.table.table-bordered.table-striped.table-hover tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          rank: cells[0]?.innerText.trim() || '',
          name: cells[1]?.innerText.trim().split(' ')[0] || '',
          value: cells[2]?.innerText.trim() || '',
          followers: cells[3]?.innerText.trim() || '',
          stories: cells[4]?.innerText.trim() || '',
        };
      });
    });

<<<<<<< HEAD
    await browser.disconnect(); // Close the connection

=======
    await browser.close();
>>>>>>> dd014170031abab1302d77145d71257c38704bd4
    console.log(tags);
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error in /api/find-tags:', error.message);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
