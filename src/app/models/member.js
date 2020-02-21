const { date } = require('../../lib/utils') // desestruturando a funcao age.
const db = require('../../config/db')

module.exports = {
    all(callback){
        console.log('x')
        db.query(`select * from members`, function(err, results){
            if(err) return res.send("Database error")
        
            callback(results.rows)
        })

    },
    create(data, callback) {
        const query = `
            INSERT INTO members (
                name,
                avatar_url,
                gender,
                email,
                birth,
                blood,
                weight,
                height,
                instructor_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        ` 

        console.log(query)

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.email,
            date(data.birth).iso,
            data.blood,
            data.weight,
            data.height,
            data.instructor
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database error ${err}`

            callback(results.rows[0]) 
        })        

    },

    find(id, callback) {
        db.query(`SELECT members.* , instructors.name as instructor_name
                    FROM members left join instructors on (members.instructor_id = instructors.id)
                   WHERE members.id = $1`, 
                [id], 
                function(err, results){
                    if(err) throw `Database error ${err}`
                    callback(results.rows[0])
                })
    },

    update(data, callback) {
        const query = `
        UPDATE members 
           Set name = $1,
               avatar_url = $2,
               gender = $3,
               email = $4,
               birth = $5,
               blood = $6,
               weight = $7,
               height = $8,
               instructor_id=$9
         WHERE ID = $10`

         const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.email,
            date(data.birth).iso,
            data.blood,
            data.weight,
            data.height,
            data.instructor,
            data.id
         ]

         console.log(data.instructor)

         db.query(query, values, function(err, results){
            if(err) throw `Database error ${err}`
         
            callback()
         })
    },

    delete(id, callback) {
        db.query(`DELETE FROM members WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database error`

            return callback()
        })
    },

    instructorsSelectOptions(callback) {
        db.query(`SELECT id, name FROM instructors`, function(err, results) {
            if (err) throw `Database error ${err}`

            callback(results.rows)
        })
    },


    paginate(params) {
        const {filter, limit, offset, callback} = params
        
        let filterQuery = ""

        if (filter) {
            filterQuery = `
            WHERE members.name ILIKE '%${filter}%'
            OR members.email ILIKE ' %${filter}%'`
        }
        
        let query = `select members.*, 
        (SELECT count(0) FROM members ${filterQuery}) as total from members 
        ${filterQuery}
         LIMIT ${limit} OFFSET ${offset}`

        db.query(query, [], function(err, results){
            if(err) throw `Database error ${err}`

            return callback(results.rows, filter) 
        })    
    }

}