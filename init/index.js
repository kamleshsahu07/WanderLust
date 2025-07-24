const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initdb= async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:'6879d10ff62356d2d0c895bd'}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initdb();