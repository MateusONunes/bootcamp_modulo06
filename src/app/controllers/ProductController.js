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

    async edit(req, res) {
        let results = await Product.find(req.params.id)

        const product = results.rows[0]

        if (!product) return res.send("Product not found!!")

        results = await Category.all()
        const categories = results.rows

        return res.render("products/edit.njk", { product, categories })

    },

    async put(req, res) {
        const keys = Object.keys(req.body); /*Retorna apenas as chaves dos campos*/
    
        for (key of keys){
            if ((key != 'old_price') && (req.body[key] == "")) {
                return res.send("Preencha o campo " + key)
            }
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}/edit`)

    },

    async delete(req, res) {
        console.log(req.body)
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }

}
