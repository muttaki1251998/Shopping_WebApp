const express = require('express');
const expressValidator = require('express-validator');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Admin area');
});

// add pages
router.get('/add-page', (req, res) => {
   var title = '';
   var content = '';
//    var slug = '';
   
   res.render('admin/add-page', {
       title: title,
    //    slug: slug,
       content: content
   });
});

router.post('/add-page', (req, res) => {

    var title = req.body.title;
    // var slug = req.body.slug.replace(/\s+/g, '-').toLowecase();
    // if (slug == "") slug = title.replace(/\s+/g, '-').toLowecase();       
    var content = req.body.content;

    req.checkBody('title', "Title cannot be empty").notEmpty();
    req.checkBody('content', "Content must be filled").notEmpty();    

    var errors = req.validationErrors();

    if(errors){
        res.render('admin/add-page', {
            errors: errors,
            title: title,
            content: content,
            // slug: slug
        });
        console.log(errors.msg);
        
    }else{
        console.log('Success');
    }
});

module.exports = router;