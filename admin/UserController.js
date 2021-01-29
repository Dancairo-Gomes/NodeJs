const express = require('express');
const Category = require('../categories/Categorie');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');


router.get('/admin/users', (req, res) =>{

    User.findAll().then(users => {
        res.render('admin/users/index', ({users: users}));
    })

});

router.get('/admin/users/create', (req, res) => {
    res.render('./admin/users/create');
});

router.post('/users/create', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined){

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

    User.create({
        email: email,
        password: hash
    }).then(() => {
        res.redirect('/');
    }).catch(() => {
        res.redirect('/');
    });
        }else{
            res.redirect('/admin/users/create');
        }
    })

});

router.post('/users/delete', (req, res) => {

    const id = req.body.id;

    User.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/users');
    }).catch(() => {
        res.redirect('/admin/users');

    });
});

router.get('/admin/users/edit/:id', (req, res) =>{
    const id = req.params.id;
    User.findByPk(id).then(user => {
        res.render('admin/users/edit', {user: user})
    }).catch(() => {
        res.redirect('/admin/users');
    });
});

router.post('/admin/users/update', (req, res) => {
    
const email = req.body.email;
const id = req.body.id;

User.update({email: email}, {where: {id: id}})
.then(() => {
    res.redirect('/admin/users');
}).catch(() => {
    res.redirect('/admin/users');
}); 
})
;
module.exports = router;