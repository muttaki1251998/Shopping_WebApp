const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const auth = require('../config/auth');
const isUser = auth.isUser;

router.get('/', (req, res) => {
    //res.render("sd");
    Product.find((err, products) => {
        if(err) console.log(err);

        res.render('all_products', {
            title: 'All Products',
            products: products
        });
    });
});

router.get('/:category', (req, res) => {
    
    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, (err, c) => {
        Product.find({category: categorySlug}, (err, products) => {
            if(err) console.log(err);

            res.render('cat_products', {
               title: c.title,
                products: products
            });  
        });
    });    
});

router.get('/:category/:product', (req, res) => {    
    
    var productSlug = req.params.product;
    var loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: productSlug}, (err, product) => {
       var images = null;
        if(err)
            console.log(err);
        else{
            var imageDir = 'public/product_images/' + product._id;

            fs.readdir(imageDir, (err, files) => {
                if(err)
                    console.log(err);
                else{
                    images = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        images: images,
                        loggedIn: loggedIn
                    });
                }
            });
        }
    });
});



module.exports = router;