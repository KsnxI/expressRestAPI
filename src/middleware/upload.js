const fs = require('fs')
const path = require('path')
const multer = require('multer')
const config = require('../config')


fs.mkdirSync(config.uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueName + path.extname(file.originalname).toLowerCase())
    }
})


const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png']

    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        const err = new Error('Разрешены только изображения JPEG и PNG')
        err.status = 400
        cb(err)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: config.maxFileSize }
})


module.exports = upload.single('image')