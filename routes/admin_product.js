const express = require('express');
const expressValidator = require('express-validator');
const router = express.Router();
const mkdirp = require('mkdirp');
const resizeImg = require('resize-img');
const fs = require('fs-extra');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

router.get('/', (req, res) => {
    var count;
    Product.count(function(err, c){
        count = c;
    });
    Product.find((err, products) => {        
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
   // res.render('Product page');
});

router.get('/add-product', (req, res) => {
    var title = "";
    var desc = "";
    var price = "";

    Category.find((err, categories) => {
        res.render('admin/add-product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price,
        });
    });

    //res.render("Product");
});

router.post('/add-product', (req, res) => {
    res.render("ds");
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    req.checkBody('title', "Title is required").notEmpty();
    req.checkBody('desc', "Please provide a description").notEmpty();
    req.checkBody('price', "Provide a price!").isDecimal();
    req.checkBody('image', 'You must provide an image').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    var errors = req.validationErrors();

    if(errors){
        Category.find((err, categories) => {
            res.render('admin/add-product', {
                errors: errors,
                title: title,
                desc: desc,
                categories: categories,
                price: price,
            });
        });
    }else{
        Product.findOne({slug: slug}, (err, product) => {
            if(product){
                req.flash('danger', "Page slug exists, choose another");
                Category.find((err, categories) => {
                    res.render('admin/add-product', {                        
                        title: title,
                        desc: desc,
                        categories: categories,
                        price: price,
                    });
                });
            }else{
                var priceFloat = parseFloat(price).toFixed(2);

                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    category: category,
                    price: priceFloat,
                    image: imageFile
                });

                product.save((err) => {
                    if(err)
                        return console.log(err);
                        
                        mkdirp('public/product_images/' + product._id, (err) => {
                            return console.log(err);
                        });

                        // mkdirp('public/product_images/' + product._id + '/gallery', (err) => {
                        //     return console.log(err);
                        // });

                        // mkdirp('public/product_images/' + product._id + 'gallery/thumbs', (err) => {
                        //     return console.log(err);
                        // });

                        if(imageFile != ""){
                            var productImage = req.files.image;
                            var path = 'public/product_images/' + product._id + '/' + imageFile;

                            productImage.mv(path, (err) => {
                                return console.log(err);
                            });
                        }

                        req.flash('success', "Product added");
                        res.redirect('/admin/product');
                });
            }
        });
    }    
});

router.get('/delete-product/:id', (req, res ) => {
    var id = req.params.id;
    var path = '/public/product_images/' + id;

    fs.remove(path, (err) => {
        if(err) 
            return console.log(err);
        else{
            Product.findByIdAndRemove(id, (err) => {
                req.flash('success', "Product has been deleted");
                res.redirect('/admin/product');
            });
        }
    });
});

module.exports = router;