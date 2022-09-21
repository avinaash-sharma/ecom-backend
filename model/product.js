const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'please provide product name'],
    trim: true,
    maxLength: [120, 'product length maxLength is 120']
  },
  price:{
    type: Number,
    required: [true, 'please provide product price'],
    maxLength: [6, 'price is allowed up to 6 digits']
  },
  description: {
    type: String,
    required: [true, 'please provide product description'],

  },
  photos:[
    {
      id:{
        type: String,
        required: true
      },
      secure_url:{
        type: String,
        required: true
      }
    }
  ],
  category:{
    type: String,
    required: [true, 'please provide product category from shortsleeves, longsleeves, sweatshirts, hoodies'],
    enum:{
      values:[
        'shortsleeves','longsleeves',' hoodies', 'sweatshirts'
      ],
      message: 'please select from - shortsleeves, longsleeves, hoodies, sweatshirts'
    }
  },
  brand:{
    type: String,
    required: [true, 'please provide product brand']
  },
  rating:{
    type: String,
    default: 0
  },
  numberOfReviews:{
    type: Number,
    default:0
  },
  reviews:[
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type:String,
        required: true
      },
      rating: {
        type:Number,
        required: true,
      },
      comment: {
        type:String,
        required: true,
      }
      
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }

});



module.exports = mongoose.model('Product', productSchema);