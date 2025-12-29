const sequelize = require('./database');
const Article = require('./models/Article');

async function verify() {
    try {
        await sequelize.sync();
        const count = await Article.count();
        console.log(`Total Articles in DB: ${count}`);

        if (count >= 5) {
            console.log('SUCCESS: At least 5 articles found.');
            const articles = await Article.findAll({ limit: 5 });
            articles.forEach(a => console.log(`- [${a.id}] ${a.title}`));
        } else {
            console.log('FAIL: Less than 5 articles found.');
        }
    } catch (e) {
        console.error('Verification failed:', e);
    }
}

verify();
