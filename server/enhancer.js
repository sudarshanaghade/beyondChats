const puppeteer = require('puppeteer');
const Article = require('./models/Article');
const sequelize = require('./database');

// Mock LLM function - Replace with actual API call (OpenAI/Gemini)
async function callLLM(prompt) {
    console.log('--- LLM PROMPT ---');
    console.log(prompt.substring(0, 200) + '...');
    console.log('------------------');

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));

    return `[AI ENHANCED VERSION]\n\nThis is a simulated AI rewritten version of the article. It incorporates insights from the searched sources to provide a more comprehensive overview.\n\n(Real LLM would produce actual content here based on the inputs).`;
}

async function enhanceArticles() {
    console.log('Starting Enhancer...');
    await sequelize.sync();

    const articles = await Article.findAll({ where: { is_enhanced: false } });
    console.log(`Found ${articles.length} articles to enhance.`);

    if (articles.length === 0) return;

    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        for (const article of articles) {
            console.log(`\nProcessing: ${article.title}`);
            const page = await browser.newPage();
            // Set User Agent to avoid bot detection
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            try {
                // 1. Search Google
                const query = encodeURIComponent(article.title);
                const searchUrl = `https://www.google.com/search?q=${query}`;
                console.log(`Searching: ${searchUrl}`);

                await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

                // 2. Extract Top 2 Links
                const searchResults = await page.evaluate(() => {
                    // Try multiple selectors
                    const selectors = ['#search div.g a', '#rso div.g a', 'div#main div a', 'a h3'];
                    let anchors = [];
                    // Simple approach: grab all anchors, filter by valid HREF
                    const allAnchors = Array.from(document.querySelectorAll('a'));
                    const validAnchors = allAnchors
                        .map(a => a.href)
                        .filter(href => href && href.startsWith('http') && !href.includes('google.com') && !href.includes('beyondchats.com') && !href.includes('youtube.com'));

                    // Deduplicate
                    return [...new Set(validAnchors)].slice(0, 2);
                });

                console.log('Found sources:', searchResults);

                let combinedContext = "";
                const citedSources = [];

                // 3. Scrape Sources
                for (const url of searchResults) {
                    console.log(`Scraping Source: ${url}`);
                    try {
                        const sourcePage = await browser.newPage();
                        await sourcePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                        await sourcePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

                        const text = await sourcePage.evaluate(() => {
                            return document.body.innerText.substring(0, 2000); // Limit context size
                        });

                        combinedContext += `\n--- SOURCE: ${url} ---\n${text}\n`;
                        citedSources.push(url);
                        await sourcePage.close();
                    } catch (e) {
                        console.error(`Failed to scrape source ${url}:`, e.message);
                    }
                }

                // 4. Call LLM
                const prompt = `
                You are an expert content editor. Rewrite the following article to make it more comprehensive, using the provided context from other sources.
                
                ORIGINAL TITLE: ${article.title}
                
                ORIGINAL CONTENT:
                ${article.content.substring(0, 3000)}
                
                ADDITIONAL CONTEXT FROM WEB:
                ${combinedContext}
                
                Please produce a high-quality, professional blog post.
                `;

                const newContent = await callLLM(prompt);

                // 5. Update DB
                await article.update({
                    enhanced_content: newContent,
                    cited_sources: citedSources,
                    is_enhanced: true
                });

                console.log('Article Enhanced and Saved.');

            } catch (err) {
                console.error(`Error processing article ${article.id}:`, err);
            } finally {
                await page.close();
            }
        }
    } catch (err) {
        console.error('Enhancer fatal error:', err);
    } finally {
        await browser.close();
    }
}

enhanceArticles();
