import { v2 as cloudinary } from 'cloudinary';
import clodinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
const storage = new clodinaryStorage({
    cloudinary,
    params: {
        folder: 'YELPCAMP',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});
export {cloudinary,storage};
