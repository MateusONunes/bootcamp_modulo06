const express = require('express')
const nunjucks = require('nunjucks') // reaproveitamento de código
const routes = require("./routes")
const methodOverride = require('method-override') // Ativar o Método Put

const server = express()

server.use(express.urlencoded({ extended: true })) // Esta linha permite receber o "body" de um "Form" pelo "post"
server.use(express.static('public'))
server.use(methodOverride('_method')) // Ativar o Método Put
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function(){
    console.log("server is running")
})