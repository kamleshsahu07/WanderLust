const User=require("../models/user.js");

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
};

module.exports.login= async (req,res) => {
    req.flash("success","welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.renderSignupform = ( req,res )=>{
    console.log(redirectUrl);
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res) => {
    try{
    let { username,email,password }=req.body;
    const newUser = new User({email,username});
    const registered = await User.register(newUser,password);
    console.log(registered);
    req.login(registered,(err)=>{
        if(err){
        return next(err);
    } 
    req.flash("success","Welcome To WanderLust !"); 
    res.redirect("/listings");
});
}catch(error){
        req.flash("error" , error.message);
        res.redirect("/login");
    }
};