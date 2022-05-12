const mongoose = require('mongoose');
const Campground = require('../models/camp')
const{descriptors,places} = require('./seedhelpers')
const cities = require('./cities')
// const MongoDBStore = require("connect-mongo")(session);


const dbUrl = process.env.databaseUrl || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex: true,})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)]


const seedDB = async () => {
    for(let i =1; i<70;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const camp = new Campground({author:"627cc2bdc1f4f4ffad19fe66",title:`${cities[random1000].city} ${cities[random1000].state}`,location:`${sample(descriptors)} ${sample(places)}`,
        description:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae voluptatibus praesentium eveniet nam ratione ex, consequuntur natus necessitatibus nobis? Eligendi adipisci minima quisquam ipsam dolore animi, ea laborum ipsa quae!",
        geometry: { "type" : "Point", "coordinates" : [cities[random1000].longitude,
        cities[random1000].latitude] },
        images:[{
            url:"https://res.cloudinary.com/doowbulgn/image/upload/v1652252908/yelpCamp/f9yzg0nunknoatotmecx.jpg" ,
            filename:"yelpCamp/f9yzg0nunknoatotmecx.jpg",
        },{
            url: "https://res.cloudinary.com/doowbulgn/image/upload/v1652252908/yelpCamp/vkaoa3feyolamyxiaf0k.jpg",
            filename:  "yelpCamp/vkaoa3feyolamyxiaf0k.jpg",

        }
    ]})
        await camp.save() 
        }
   
        
   
    
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})