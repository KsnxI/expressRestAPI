const multer = require('multer')


const errorHandler = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Файл слишком большой, максимум 2 МБ'
            : err.message
        return res.status(400).json({ error: message })
    }


    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Некорректный JSON' })
    }


    if (err.status) {
        return res.status(err.status).json({ error: err.message })
    }


    console.error(err)
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
}

module.exports = errorHandler