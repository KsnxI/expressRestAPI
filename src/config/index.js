const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    port: process.env.PORT || 3000,
    uploadsRoot: path.resolve(__dirname, '../../uploads'),
    uploadDir: path.resolve(__dirname, '../../uploads/products'),
    maxFileSize: 2 * 1024 * 1024
}