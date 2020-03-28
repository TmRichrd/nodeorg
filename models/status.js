var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/test')
var statusSchema = new mongoose.Schema({
  status_name: String
})
module.exports = mongoose.model('status', statusSchema)
