const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const connection = require('./database/connection');
const user = require('./admin/User');

const categoriesController = require('./categories/CatergoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./admin/UserController');

const Article = require('./articles/Article');
const Category = require('./categories/Categorie');

//view engine
app.set('view engine', 'ejs');

//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Static

app.use(express.static('public'));

//Database Connection

connection.authenticate()
.then(() => {
    console.log('Conectado com o Database !');
})
.catch(e => console.log(e));

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController)



app.get('/', (req, res) => {
   
    Article.findAll({order:[
        ['id', 'DESC']
    ]})
    .then(articles => {
        Category.findAll()
        .then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });

    })
   
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll()
            .then(categories => {
                res.render('article', {article: article, categories: categories});
            });
    
        }else{
            res.redirect('/');
        }
    }).catch(e => {
             res.redirect('/');

    });
});

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll()
            .then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            })
        }else{
            res.redirect('/');
        }
    }).catch(() => {
        res.redirect('/');

    })
})



app.listen(2000, () => console.log('Servidor Iniciado'));