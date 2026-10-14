
const logger = (req, res, next) => {
    const start = Date.now()

    // событие finish срабатывает, когда ответ уже отправлен
    res.on('finish', () => {
        const time = Date.now() - start
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`)
    })

    next()
}

module.exports = logger