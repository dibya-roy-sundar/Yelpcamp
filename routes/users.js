import express from "express";
import passport from "passport";
import { storeReturnTo } from "../middleware.js";
import {
  Register,
  login,
  loginForm,
  logout,
  registerForm,
} from "../controllers/users.js";
const router = express.Router();

passport.use(new LocalStrategy(User.authenticate()));

// stores user data in session
passport.serializeUser(User.serializeUser());
// delete user data from session
passport.deserializeUser(User.deserializeUser());

router
  .route("/register")
  .get( registerForm)
  .post( Register);

router
  .route("/login")
  .get( loginForm)
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );

router.get("/logout", logout);
export default router;
