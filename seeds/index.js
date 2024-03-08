import mongoose from "mongoose";
import dotenv from "dotenv";
import { Campground } from "../models/campground.js";
import { cities } from "./cities.js";
import { places,descriptors } from "./seedHelpers.js";

dotenv.config();

const dburl=process.env.ATLAS_URL;
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("successfully connected to mongodb server");
})
.catch((err)=>{
    console.log("mongodb connection error!!!");
    console.log(err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];

export const seeddb=async ()=>{
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
       
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }

}

// seeddb().then(()=>{

//     mongoose.connection.close();
// }
// )

