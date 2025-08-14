if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
// const Chat=require("./models/chats.js");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("./schema.js");
const listingsrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// C:\Users\Nitesh J Sahu\Downloads\Wanderlust\routes\listing.js
app.engine("ejs",ejsMate);
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const Review=require("./models/review.js");
const Userrouter=require("./routes/user.js");
const dburl = process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session",err);
})
const sessionOptions = {
    store:store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log(res.locals.success);
    next();
})

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err)
});

async function main(){
    await mongoose.connect(dburl);
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",Userrouter);

app.get("/demo",async(req,res) => {
    let fakeUser=new User({
        email:"Student@gmail.com",
        username:"delta AC",
    });
    let registereduser = await User.register(fakeUser,"helloworld");
    res.send(registereduser);
})
//middleware
app.use((err,req,res,next)=>{
    let { statusCode=500,message } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{ message });
});

app.get("/",(req,res)=>{
    res.send("hi i am root");
});

app.listen(8080,()=>{
    console.log("listening on port 8080");
});