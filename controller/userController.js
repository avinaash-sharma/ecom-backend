const User = require("../model/user");
const HOCPromise = require("../middleware/HOCPromise");
const CustomErrorHandler = require("../util/customError");
const cookieToken = require("../util/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../util/emailHelper");
var crypto = require("crypto");

exports.signup = HOCPromise(async (req, res, next) => {
  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
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
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = HOCPromise(async (req, res, next) => {
  const { email, password } = req.body;

  //check for the account
  if (!email || !password) {
    return next(
      new CustomErrorHandler("Please provide both email and password", 400)
    );
  }

  //getting user from db.
  //here using select is because we have marked the password property in the model as false
  //but here in this case we need the password to check.
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new CustomErrorHandler(
        "This account is not available in our database. Please make sure to enter the correct email/password",
        400
      )
    );
  }

  const isPasswordCorrect = await user.isPasswordValid(password);

  if (!isPasswordCorrect) {
    return next(new CustomErrorHandler("The password is not correct.", 400));
  }

  // all is good then we return the token from the method cookieToken.
  cookieToken(user, res);
});

exports.logout = HOCPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "logout successful" });
});

exports.forgotPassword = HOCPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new CustomErrorHandler("This email is not registerd with us.", 400)
    );
  }

  const forgotToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  //   creating the url with token
  const url = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`;
  // created the message for the mail
  const message = `Copy paste this link in your URL and hit enter \n\n ${url}`;

  //an attempt was made to send the mail.
  try {
    await mailHelper({
      toEmail: user.email,
      subject: "Rest your ECOM Password",
      message: message,
    });
    //json response if the mail is sent successfully.
    res
      .status(200)
      .json({ status: "success", message: "Email sent successfully!!" });
  } catch (error) {
    //handling the error message and resetting the user field if anything goes wrong.
    user.forgot_password_token = undefined;
    user.forgot_password_expires_at = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new CustomErrorHandler(error.message, 500));
  }
});

exports.passwordReset = HOCPromise(async (req, res, next) => {
  const token = req.params.token;
//   console.log("🚀 ~ file: userController.js ~ line 128 ~ exports.passwordReset=HOCPromise ~ token", token)
  

  const encryptedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("🚀 ~ file: userController.js ~ line 132 ~ exports.passwordReset=HOCPromise ~ encryptedToken", encryptedToken)
  // $gt refers to greater than, here it would check if the time is greater than the current time.
  const tokenUser = await User.findOne({
    encryptedToken,
    forgot_password_expires_at: { $gt: Date.now() },
  });
  //   console.log("🚀 ~ file: userController.js ~ line 143 ~ exports.passwordReset=HOCPromise ~ tokenUser", tokenUser)

  if (!tokenUser) {
    return next(new CustomErrorHandler("Token is invalid", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomErrorHandler(
        "The password is invalid i.e the password and confirm password should be the same",
        400
      )
    );
  }
  tokenUser.password = req.body.password;
  tokenUser.forgot_password_token = undefined;
  tokenUser.forgot_password_expires_at = undefined;

  await tokenUser.save();
  //send a json response and can ask to go ahead and login again or we can also login and provide the latest token
  //here we are providing the token and making sure to make the person login.
  cookieToken(tokenUser, res);
});


exports.getLoggedInUser = HOCPromise(async (req, res, next) => {
  const user = await User.findById(req.user);

  

  res.status(200).json({ success: true, user});

});

exports.changePassword = HOCPromise(async (req, res, next) => {
  const userId = req.user.id;
  const oldPassword = req.body.oldPassword;

  const user = await User.findById(userId).select("+password");
  
  // console.log("🚀 ~ file: userController.js ~ line 176 ~ exports.changePassword=HOCPromise ~ user", user)
 
  
  const validOldPassword = await user.isPasswordValid(oldPassword)
  

  if(!validOldPassword) {
    return next(new CustomErrorHandler('old password is incorrect', 400));
  }

  user.password = req.body.password;
  await user.save();
  cookieToken(user, res);
});

exports.updateUserDetails = HOCPromise(async (req, res, next) => {

  const data = {
    name: req.body.name,
    email: req.body.email,
  };

  
  if(req.files){
    
    const user = await User.findById(req.user.id)
    const imageId = user.photo.id;
    //deleting the image on cloudinary.
    const resp = await cloudinary.v2.uploader.destroy(imageId);
    //uploading the latest one.
    result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
    data.photo = {
      id: result.public_id,
      secure_url: result.secure_url
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(
      new CustomErrorHandler("Something went wrong", 400)
    );
  }

  res.status(200).json({
    success: true,
    message: "User details updated successfully"
  })

});

exports.adminAllUser = HOCPromise(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({success: true, users});

});