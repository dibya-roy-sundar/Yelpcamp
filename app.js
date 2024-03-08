import dotenv from "dotenv";
if(process.env.NODE_ENV!="production"){
  dotenv.config();
}

import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import { seeddb } from "./seeds/index.js";
import ejsMate from "ejs-mate";
import { ExpressError } from "./utils/ExpresssError.js";
import campgroundsRoutes from "./routes/campground.js";
import reviewsRoutes from "./routes/review.js";
import usersRoutes from "./routes/users.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "./models/user.js";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(mongoSanitize());

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("successfully connected to mongodb server");
    seeddb();
  })
  .catch((err) => {
    console.log("mongodb connection error!!!");
    console.log(err);
  });

const sessionconfig = {
  secret: "thisshouldbeabattersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // date.now() in ms , expires after 7 days
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.currentUser = req.user; // get the  current user data from pasport that store through serialise in current session
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", usersRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});
app.use((err,req,res,next)=>{
    const {statusCode=500,message="something went wrong!!!"}=err;
    res.status(statusCode).send(message);
})
app.listen(3000, () => {
  console.log("port has started at port 3000");
});
