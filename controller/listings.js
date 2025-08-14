const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    // let {id}=req.params;
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
};

module.exports.rendernewform=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });
};
module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    // console.log(req.user);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New listing Created");
    res.redirect("/listings");
};
module.exports.renderEditForm=async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listings you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{ listing , originalImageUrl });
};
module.exports.updateListing=async (req,res)=>{

    if(!req.body.listing){ 
        throw new ExpressError(400,"send valid data for listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined" ){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image = { url , filename };
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async (req,res)=>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};