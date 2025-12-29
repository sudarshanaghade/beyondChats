const puppeteer = require('puppeteer');
const Article = require('./models/Article');
const sequelize = require('./database');

async function scrapeArticles() {
    console.log('Starting scraper...');

    // Connect DB
    await sequelize.sync();

    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to blog...');
        await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'networkidle0', timeout: 120000 });

        let lastPageNum = 1;
        try {
            const pageNumbers = await page.evaluate(() => {
                const elements = document.querySelectorAll('.page-numbers, .pagination a');
                const nums = [];
                elements.forEach(el => {
                    const txt = el.innerText;
                    if (!isNaN(txt)) nums.push(parseInt(txt));
                });
                return nums;
            });

            if (pageNumbers.length > 0) {
                lastPageNum = Math.max(...pageNumbers);
            }
            console.log(`Found last page: ${lastPageNum}`);

        } catch (e) {
            console.log('Could not determine pagination, using page 1 or manual logic needed.', e);
        }

        const lastPageUrl = `https://beyondchats.com/blogs/page/${lastPageNum}/`;
        console.log(`Navigating to last page: ${lastPageUrl}`);
        await page.goto(lastPageUrl, { waitUntil: 'networkidle0' });

        const articleLinks = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));
            const links = anchors
                .map(a => a.href)
                .filter(href => href.includes('/blogs/') && href.length > 35)
                .filter((v, i, a) => a.indexOf(v) === i);

            return links;
        });

        console.log(`Found ${articleLinks.length} article links on last page.`);

        // Take 5 oldest (last 5 on the page)
        let targetLinks = articleLinks.slice(-5);
        console.log('Targeting links:', targetLinks);

        for (const link of targetLinks) {
            console.log(`Scraping: ${link}`);
            try {
                const articlePage = await browser.newPage();
                await articlePage.goto(link, { waitUntil: 'domcontentloaded' });

                const data = await articlePage.evaluate(() => {
                    const title = document.querySelector('h1')?.innerText
                        || document.querySelector('.entry-title')?.innerText
                        || document.querySelector('.post-title')?.innerText
                        || document.title
                        || 'No Title';
                    const contentEl = document.querySelector('.entry-content') || document.querySelector('article') || document.body;

                    const clone = contentEl.cloneNode(true);
                    const scripts = clone.querySelectorAll('script, style, iframe, nav, footer, header');
                    scripts.forEach(s => s.remove());

                    return {
                        title,
                        content: clone.innerText.trim(),
                        date: new Date().toISOString()
                    };
                });

                const existing = await Article.findOne({ where: { link: link } });
                if (!existing) {
                    await Article.create({
                        title: data.title,
                        content: data.content,
                        link: link,
                        date_published: data.date
                    });
                    console.log('Saved:', data.title);
                } else {
                    console.log('Already exists:', data.title);
                }

                await articlePage.close();

            } catch (err) {
                console.error(`Failed to scrape ${link}:`, err.message);
            }
        }

    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await browser.close();
        console.log('Done.');
    }
}

scrapeArticles();
