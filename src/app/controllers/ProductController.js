const { formatPrice, date } = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    create(req, res) {
        //pegar categorias
        Category.all()
        .then(function(results) {
            const categories = results.rows

            return res.render("products/create.njk", { categories })
        }).catch(function(err) {
            throw new Error(err)
        })

    },
    async post(req, res){
        const keys = Object.keys(req.body); /*Retorna apenas as chaves dos campos*/
    
        for (key of keys){
            if (req.body[key] == "")
              return res.send("Please, fill all fields");
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image')
        
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({...file, product_id: productId}))
        await Promise.all(filesPromise)        


        return res.redirect(`products/${productId}/edit`) //Template Literals ==>> ``
    },
    async show(req,res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Product Not Found!")

        const { day, hour, minutes, month } = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}`,
        }

        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(product.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/show", { product, files })
    },
    async edit(req, res) {
        let results = await Product.find(req.params.id)

        const product = results.rows[0]

        if (!product) return res.send("Product not found!!")

        // get categories
        results = await Category.all()
        const categories = results.rows

        // get images
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/edit.njk", { product, categories, files })

    },

    async put(req, res) {
        const keys = Object.keys(req.body); /*Retorna apenas as chaves dos campos*/
    
        for (key of keys){
            if ((key != 'old_price') && (key != 'removed_files') && (req.body[key] == "")) {
                return res.send("Preencha o campo " + key)
            }
        }

        // salvando imagens novas
        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => 
                File.create({...file, product_id: req.body.id}))
            
            await Promise.all(newFilesPromise)
        }

        // removendo imagens que foram deletadas
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",") // O removed_files está como "1,2,3,"
            removedFiles.splice(removedFiles.length - 1, 1) // remove a "," da última posição   "1,2,3"

            const removedFilesPromisse = removedFiles.map(id => File.delete(id)) // Criando array de promessas
            await Promise.all(removedFilesPromisse) // Executando as promessas 1 a 1
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)

    },

    async delete(req, res) {
        console.log(req.body)
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }

}
