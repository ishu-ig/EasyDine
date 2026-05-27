const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../cloudinary")

function createUploader(folder) {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            const cleanName = file.originalname
                .replace(/\s+/g, '_')
                .replace(/[()]/g, '')
                .replace(/[^a-zA-Z0-9._-]/g, '')

            const isPdf = file.mimetype === 'application/pdf'

            return {
                folder:           `EasyDine/${folder}`,
                allowed_formats:  ["jpg", "jpeg", "png", "webp", "pdf"],
                resource_type:    isPdf ? 'raw' : 'image',
                // Store WITHOUT folder prefix — req.file.filename will be just
                // the public_id. To delete, pass the full path including folder.
                public_id:        `${Date.now()}_${cleanName.split(".")[0]}`,
            }
        },
    })
    return multer({ storage })
}

module.exports = {
    maincategoryUploader: createUploader("maincategory"),
    subcategoryUploader: createUploader("subcategory"),
    resturentUploader: createUploader("resturent"),
    testimonialUploader: createUploader("testimonial"),
    productUploader: createUploader("product"),
    userUploader: createUploader("user")
}