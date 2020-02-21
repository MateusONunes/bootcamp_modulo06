const { date } = require('../../lib/utils') // desestruturando a funcao age.
const db = require('../../config/db')

module.exports = {
    all(callback){
        db.query(`select instructors.*, count(members) as total_students from instructors left join members 
        on (instructors.id = members.instructor_id) group by instructors.id
        order by total_students desc`, function(err, results){
            if(err) throw `Database error ${err}`

            let instructor = results.rows

            for(var i = 0, len = instructor.length; i < len; ++i) {
                instructor[i].services_arr = instructor[i].services.split(',');
            }
           
            callback(instructor)
        })

    },
    create(data, callback) {
        const query = `
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        ` 

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            date(Date.now()).iso
        ]

        console.log(values)
    
        db.query(query, values, function(err, results){
            if(err) throw `Database error ${err}`

            callback(results.rows[0]) 
        })        

    },

    find(id, callback) {
        db.query(`SELECT * 
                    FROM instructors 
                   WHERE id = $1`, 
                [id], 
                function(err, results){
                    if(err) throw `Database error ${err}`
                    callback(results.rows[0])
                })
    },

    findBy(filter, callback){

        const sql = `select instructors.*, count(members) as total_students from instructors 
            left join members 
            on (instructors.id = members.instructor_id)
            WHERE instructors.name ILIKE '%${filter}%' OR instructors.services ILIKE '%${filter}%'
            group by instructors.id
            order by total_students desc`

        db.query(sql, function(err, results){
            if(err) throw `Database error ${err}`

            let instructor = results.rows

            for(var i = 0, len = instructor.length; i < len; ++i) {
                instructor[i].services_arr = instructor[i].services.split(',');
            }
        
            callback(results.rows)
        })
    },

    update(data, callback) {
        const query = `
        UPDATE instructors 
           Set name = $1,
               avatar_url = $2,
               gender = $3,
               services = $4,
               birth = $5
         WHERE ID = $6`

         const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            data.id
         ]

         db.query(query, values, function(err, results){
            if(err) throw `Database error ${err}`
         
            callback()
         })
    },

    delete(id, callback) {
        db.query(`DELETE FROM instructors WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database error`

            return callback()
        })
    },

    paginate(params) {
        const {filter, limit, offset, callback} = params
        
        let filterQuery = ""

        if (filter) {
            filterQuery = `
            WHERE instructors.name ILIKE '%${filter}%'
            OR instructors.services ILIKE ' %${filter}%'`
        }
        
        let query = `select instructors.*, 
        (SELECT count(0) FROM instructors ${filterQuery}) as total, count(members) as total_students from instructors 
        left join members 
        on (instructors.id = members.instructor_id)
        ${filterQuery}
        group by instructors.id LIMIT ${limit} OFFSET ${offset}`

        console.log( query )

        db.query(query, [], function(err, results){
            if(err) throw `Database error ${err}`

            return callback(results.rows, filter) 
        })
    }

}