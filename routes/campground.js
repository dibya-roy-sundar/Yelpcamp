import express from "express";
import { isAuthor, isLoggedIn, validatecampground } from "../middleware.js";
import {
  createCampground,
  deleteCampground,
  editCampground,
  editForm,
  index,
  newForm,
  showCampground,
} from "../controllers/campgrounds.js";
import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({storage})

const router = express.Router({mergeParams:true});

router
  .route("/")
  .get(index)
  .post(isLoggedIn, upload.array('image'),validatecampground, createCampground);
  

router.get("/new", isLoggedIn, newForm);
router
  .route("/:id")
  .get(showCampground)
  .put(isLoggedIn, isAuthor, upload.array('image'), validatecampground, editCampground)
  .delete(isLoggedIn, isAuthor, deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, editForm);

export default router;
