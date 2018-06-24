const express = require('express');
const expressValidator = require('express-validator');
const router = express.Router();
// const Page = require('../models/pageModel');
const Category = require('../models/categoryModel');

router.get('/', (req, res) => {    
    Category.find((err, categories) => {
        if(err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });   
});

// add categories
router.get('/add-category', (req, res) => {
   var title = '';  
   var slug = '';
   
   res.render('admin/add-category', {
       title: title,         
   });
});

router.post('/add-category', (req, res) => {

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();   

    req.checkBody('title', "Title cannot be empty").notEmpty();     

    var errors = req.validationErrors();

    if(errors){
        res.render('admin/add-category', {
            errors: errors,
            title: title            
        });       
        
    }else{
        Category.findOne({slug:slug}, (err, category) => {
            if(category){
                req.flash('danger', "Catogory exists, choose another");
                res.render('admin/add-category', {
                    title: title                                      
                });
            }else{
                var category = new Category({
                    title: title,
                    slug: slug                    
                });
                category.save((err) => {
                    if(err) console.log(err);
                    req.flash('success', "Category added!");
                    res.redirect('/admin/category');
                });
            }
        });
    }
});




router.get('/delete-category/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err) => {
        if(err) return console.log(err);
        req.flash('success', "Category has been deleted");
        res.redirect('/admin/category');
    });
});


module.exports = router;