const cookieToken = (user, response) =>{
    
    const token= user.getJwtToken();
    console.log("🚀 ~ file: cookieToken.js ~ line 5 ~ cookieToken ~ token", token)
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_TIME *24 *60 * 60 * 1000),
        httpOnly: true
    }

    user.password = undefined;
    response.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}



module.exports = cookieToken;