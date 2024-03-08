import { Campground } from "../models/campground.js";
import { catchAsync } from "../utils/catchAsync.js";

const index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", {
    campgrounds,
  });
});
const showCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
}).populate('author');
  res.render("campgrounds/show", {
    campground,
  });
});

const newForm = catchAsync((req, res) => {
  res.render("campgrounds/new");
});

const createCampground = catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.images=req.files.map((f) =>{
    return  {url:f.path , filename:f.filename}
  })
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
});

const editForm = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "can't find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", {
    campground,
  });
});

const editCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    { new: true }
  );
  const imgs=req.files.map((f) =>{
    return  {url:f.path , filename:f.filename}
  });
  campground.images.push({...imgs});
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
}
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

const deleteCampground = catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

export {
  index,
  showCampground,
  newForm,
  createCampground,
  editForm,
  editCampground,
  deleteCampground,
};
