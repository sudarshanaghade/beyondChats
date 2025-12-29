const sequelize = require('./database');
const Article = require('./models/Article');

async function clean() {
    await sequelize.sync();
    await Article.destroy({ where: { id: 1 } });
    console.log('Deleted Article 1');
}
clean();
