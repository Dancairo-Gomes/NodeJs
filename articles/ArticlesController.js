const express = require('express');
const Category = require('../categories/Categorie');
const router = express.Router();
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (res, req) => {
    
    Article.findAll({
        include: [{model: Category}]
    })
    .then(articles => {
        
        req.render('admin/articles/index', {articles: articles});

    })
});


router.get('/admin/articles/new', (res, req) => {
   
    Category.findAll()
    .then(categorias => {
        req.render('./admin/articles/new', {categories: categorias});

    })
});

router.post('/articles/save', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() =>{
        res.redirect('/admin/articles');
    })  

});

router.post('/articles/delete', (req, res) => {

    const id = req.body.id;

    if(id != undefined){
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        })
    }else{
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    const id = req.params.id;

    Article.findByPk(id)
    .then(article => {
        if(article != undefined){
            Category.findAll()
            .then(categories => {
                res.render('admin/articles/edit', {categories: categories, article: article});
            });

        }else{
            res.redirect('/');
        }
    }).catch(() => {
        res.redirect('/');
    })
    
})

router.post('/articles/update', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category

    console.log(id);

    if(id != undefined){
        Article.update({
            title: title,
            body: body,
            categoryId: category, 
            slug:slugify(title)  
        }, {where : {
            id: id
        }}).then(() => {
            res.redirect('/admin/articles')
        }).catch(() => {
            res.redirect('/admin/articles')
        })
    }else{
        res.redirect('/');

    }
});

router.get('/articles/page/:num', (req, res) => {

    var page = req.params.num;
    var offseat = 0;
    if(isNaN(page) || page == 1){
         offseat = 0;
    }else{
        offseat = parseInt(page) * 4;
    }
        Article.findAndCountAll({
            limit: 5,
            offseat: offseat
        })
        .then(articles => {

            var next;

            if(offseat + 4 >= articles.count){
                next = false;
            }else{
                next = true;
            }

            const result = {
                next: next,
                articles: articles
            }
            Category.findAll().then(categories => {
                res.render('./admin/articles/page', {result: result, categories: categories});
            })

        })
})

module.exports = router;

