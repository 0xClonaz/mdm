import puppeteer from 'puppeteer';

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

    await browser.close();

    return new Response(JSON.stringify(tags), { status: 200 });
  } catch (error) {
    console.error('Error in /api/scrape:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}
