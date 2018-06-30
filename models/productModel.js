const mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
    title: {
        type: String,
        
    },
    slug: {
        type: String
    },
    category: {
        type: String,
        
    },
    desc: {
        type: String,
        
    },
    image: {
        type: String        
    },
    price: {
        type: Number,
        
    }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);