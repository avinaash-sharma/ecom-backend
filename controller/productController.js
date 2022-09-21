const Product = require("../model/product");
const HOCPromise = require("../middleware/HOCPromise");
const CustomErrorHandler = require("../util/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../util/whereClause");


exports.addProduct = HOCPromise(async (req, res, next) =>{
  console.log(req)
  let imageArray = [];
  if(!req.files){
    return next(new CustomErrorHandler('images are required', 401));
  }

  if(req.files){
    for(let index = 0; index < req.files.length; index++){
      let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePtath, {folder: 'products'})
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      })
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product: product 
  })

});

exports.getAllProduct = HOCPromise(async (req, res,next) => {
  const resultPerPage = 6;
  const countTotalProduct = await Product.countDocuments()
  const products = new WhereClause(Product.find(), req.query).search().filter();
  
  const filterProductNumber = products.length;
  products.pager(resultPerPage);
  products = await products.base;

  res.status(200).json({ success: true, products, filterProductNumber, countTotalProduct})
})