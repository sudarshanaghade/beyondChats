const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    date_published: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_enhanced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    enhanced_content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cited_sources: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = Article;
