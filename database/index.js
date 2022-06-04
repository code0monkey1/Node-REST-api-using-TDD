// const logger = require('../utils/logger')

const mongoose = require('mongoose')

// const config = require('../utils/config')

const { MongoMemoryServer } = require('mongodb-memory-server')

let db = null
let dbUrl ='mongodb+srv://vonnwatson:watson1985@test.ufapk.mongodb.net/test'

const connect = async () => {

    try {

        if (process.env.NODE_ENV === 'test') {
            db = await MongoMemoryServer.create()
            dbUrl = db.getUri()

        }

        const conn= await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch(error){
       console.error('error connecting to MongoDB:', error.message)
    }
}

const disconnect = async () => {

    try {
        await mongoose.connection.close()

        if(db) await db.stop()

    } catch (error) {
        console.error('error connecting from MongoDB:', error.message)

    }
}


module.exports={ connect,disconnect }

