var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
var genderSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  gender_name: String,
})
module.exports = mongoose.model('Gender', genderSchema)
