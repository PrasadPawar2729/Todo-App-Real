const mongoose = require('mongoose')

const connection = mongoose.connect('mongodb://localhost:27017/Todo-App-web')

module.exports={connection}