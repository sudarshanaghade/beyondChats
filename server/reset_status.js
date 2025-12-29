const sequelize = require('./database');
const Article = require('./models/Article');

async function reset() {
    await sequelize.sync();
    await Article.update({ is_enhanced: false }, { where: {} });
    console.log('Reset all articles to is_enhanced = false');

    const articles = await Article.findAll();
    console.log(`Current Count: ${articles.length}`);
    articles.forEach(a => console.log(`${a.id}: ${a.title} [Enhanced: ${a.is_enhanced}]`));
}
reset();
