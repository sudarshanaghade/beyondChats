const sequelize = require('./database');
const Article = require('./models/Article');

async function listArticles() {
    await sequelize.sync();
    const articles = await Article.findAll();
    articles.forEach(a => {
        console.log(`ID: ${a.id} | Title: ${a.title} | Link: ${a.link}`);
    });
}
listArticles();
