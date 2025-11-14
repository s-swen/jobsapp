const mongoose = require('mongoose')


const connectDB = async(url) => {
    try {
        await mongoose.connect(url)
        console.log('Connected to Mongo')
    } catch (error) {
        console.log('Failed to connect to Mongo')
        process.exit(1)
    }
}

module.exports = connectDB