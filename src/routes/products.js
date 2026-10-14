const fs = require('fs')
const path = require('path')
const express = require('express')
const config = require('../config')
const upload = require('../middleware/upload')
const { validate, createSchema, patchSchema } = require('../middleware/validate')

const router = express.Router()

const products = []
let nextId = 1


const findProduct = (req, res, next) => {
    const id = Number(req.params.id)
    const product = products.find((item) => item.id === id)

    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' })
    }

    req.product = product
    next()
}


const removeImage = (imageUrl) => {
    if (!imageUrl) return
    const filePath = path.join(config.uploadDir, path.basename(imageUrl))
    fs.unlink(filePath, () => {})
}


router.get('/', (req, res) => {
    const { category, minPrice, maxPrice } = req.query
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 10, 1)


    let filtered = products

    if (category) {
        filtered = filtered.filter((item) => item.category === category)
    }
    if (minPrice !== undefined && !isNaN(minPrice)) {
        filtered = filtered.filter((item) => item.price >= Number(minPrice))
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
        filtered = filtered.filter((item) => item.price <= Number(maxPrice))
    }


    const offset = (page - 1) * limit
    const data = filtered.slice(offset, offset + limit)

    res.json({
        data,
        total: filtered.length,
        page,
        limit
    })
})


router.get('/:id', findProduct, (req, res) => {
    res.json(req.product)
})


router.post('/', validate(createSchema), (req, res) => {
    const newProduct = {
        id: nextId++,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        description: req.body.description,
        imageUrl: null,
        createdAt: new Date().toISOString()
    }

    products.push(newProduct)
    res.status(201).json(newProduct)
})


router.put('/:id', findProduct, validate(createSchema), (req, res) => {
    const old = req.product
    const index = products.indexOf(old)


    const replaced = {
        id: old.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        description: req.body.description,
        imageUrl: old.imageUrl,
        createdAt: old.createdAt
    }

    products[index] = replaced
    res.json(replaced)
})


router.patch('/:id', findProduct, validate(patchSchema), (req, res) => {
    Object.assign(req.product, req.body)
    res.json(req.product)
})


router.delete('/:id', findProduct, (req, res) => {
    removeImage(req.product.imageUrl)
    products.splice(products.indexOf(req.product), 1)
    res.status(204).end()
})


router.post('/:id/image', findProduct, upload, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не передан (поле image)' })
    }


    removeImage(req.product.imageUrl)

    req.product.imageUrl = `/uploads/products/${req.file.filename}`
    res.json(req.product)
})

module.exports = router