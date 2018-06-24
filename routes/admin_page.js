const express = require('express');
const expressValidator = require('express-validator');
const router = express.Router();
const Page = require('../models/pageModel');

router.get('/', (req, res) => {
    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            pages: pages
        });
    });
});

// add pages
router.get('/add-page', (req, res) => {
   var title = '';
   var content = '';
   var slug = '';
   
   res.render('admin/add-page', {
       title: title,
       slug: slug,
       content: content
   });
});

router.post('/add-page', (req, res) => {

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();       
    var content = req.body.content;

    req.checkBody('title', "Title cannot be empty").notEmpty();
    req.checkBody('content', "Content must be filled").notEmpty();    

    var errors = req.validationErrors();

    if(errors){
        res.render('admin/add-page', {
            errors: errors,
            title: title,
            content: content,
            slug: slug
        });       
        
    }else{
        Page.findOne({slug:slug}, (err, page) => {
            if(page){
                req.flash('danger', "Page slug exists, choose another");
                res.render('admin/add-page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            }else{
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save((err) => {
                    if(err) console.log(err);
                    req.flash('success', "Page added!");
                    res.redirect('/admin');
                });
            }
        });
    }
});

// router.get('/edit-page/:slug', (req, res) => {
//     Page.findOne({slug: req.params.slug}, (err, page) => {
//         if(err) return console.log(err);
//         if(page){
//             res.render('admin/edit-page',{
//                 title: page.title,
//                 slug: page.slug,
//                 content: page.content,
//                 id: page._id
//             });
//         }
//     });
// });

// router.post('/edit-page/:slug', (req, res) => {

//     var title = req.body.title;
//     var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
//     if (slug == "")
//         slug = title.replace(/\s+/g, '-').toLowerCase();       
//     var content = req.body.content;
//     var id = req.body.id;

//     req.checkBody('title', "Title cannot be empty").notEmpty();
//     req.checkBody('content', "Content must be filled").notEmpty();    

//     var errors = req.validationErrors();

//     if(errors){
//         res.render('admin/edit-page', {
//             errors: errors,
//             title: title,
//             content: content,
//             slug: slug,
//             id: id
//         });       
        
//     }else{
//         Page.findOne({slug:slug, id: {'$ne': id}}, (err, page) => {
//             if(page){
//                 req.flash('danger', "Page slug exists, choose another");
//                 res.render('admin/add-page', {
//                     title: title,
//                     slug: slug,
//                     content: content,
//                     id: id
//                 });
//             }else{
                
//                 Page.findById(id, (err, pages) => {
//                     if(err) return console.log(err);
//                     page.title = title;
//                     page.slug = slug;
//                     page.content = content;

//                     page.save((err) => {
//                         if(err) console.log(err);
//                         req.flash('success', "Page added!");
//                         res.redirect('/admin');
//                     });
//                 });                
//             }
//         });
//     }
// });

router.get('/delete-page/:id', (req, res) => {
    Page.findByIdAndRemove(req.params.id, (err) => {
        if(err) return console.log(err);
        req.flash('success', "Page has been deleted");
        res.redirect('/admin');
    });
});


module.exports = router;