const User = require("../model/user");
const HOCPromise = require("../middleware/HOCPromise");
const CustomErrorHandler = require("../util/customError");
const cookieToken = require("../util/cookieToken");
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

exports.signup = HOCPromise(async (req, res, next) => {

    let result;
    if(req.files){
        let file =req.files.photo;
        result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
            folder: "users",
            width: 150,
            crop: "scale"
        })
    }

    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        // return next(new CustomErrorHandler('please send a valid email', 400));
        return next(
        new Error(
            "Please send a valid name, email & password for a successful registration"
        )
        );
    }

    const user = await User.create({
        name,
        email,
        password,
        photo:{
            id: result.public_id,
            secure_url: result.secure_url
        }
    });

    cookieToken(user, res);
});
