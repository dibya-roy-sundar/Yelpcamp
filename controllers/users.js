import { User } from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";

const registerForm = (req, res) => {
  res.render("users/register");
};
const Register = catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registereduser = await User.register(user, password);
    // console.log(registereduser);
    req.login(registereduser, (e) => {
      if (e) {
        return next(e);
      } else {
        req.flash("success", "welcome to yelpcamp!");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    // for same user id there should ocurr an error
    req.flash("error", e.message);
    res.redirect("/register");
  }
});
const loginForm = (req, res) => {
  res.render("users/login");
};
const login = async (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds"; // update this line to use res.locals.returnTo now
  res.redirect(redirectUrl);
};
const logout = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    } else {
      req.flash("success", "good bye!");
      res.redirect("/campgrounds");
    }
  });
};
export { registerForm, Register, loginForm, login, logout };
