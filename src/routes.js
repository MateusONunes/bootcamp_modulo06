const express = require('express')
const routes = express.Router()


// HTTP VERBS
// Get: Receber um resource(Apesar de as vezes ser utilizado para passar informações pelo get(string url)) - Resource(Uma entidade)
// Post: Criar ou Salvar um novo resource com dados enviados
// Put: Atualizar um Resource
// Delete: Deletar um resource

routes.get('/', function(req, res){
    return res.send("ok")
})


module.exports = routes