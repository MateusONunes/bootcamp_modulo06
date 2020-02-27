const { Pool } = require("pg")

module.exports = new Pool({
    user: "postgres",
    password: "mateus",
    host: "localhost",
    port: 5432,
    database: "launchstiredb"

})