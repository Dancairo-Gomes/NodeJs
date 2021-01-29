const Sequelize = require('sequelize');
const connection = require('../database/connection');
const CategorY = require('../categories/Categorie');


const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

CategorY.hasMany(Article); // uma categoria pdoe ter muitos artigos
Article.belongsTo(CategorY); // um artigo pertence a uma categoria


module.exports = Article;