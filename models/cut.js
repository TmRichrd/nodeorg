var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/test')
var cutSchema = new Schema({
  _id: Schema.Types.ObjectId,
  cut: {
    type: String,
    required: true
  }
})
// var Cut = mongoose.model('Cut', cutSchema)

// const kitty = new Cut({ cut: '客户端测试' })
// kitty.save().then(() => console.log('meow'))
module.exports = mongoose.model('Cut', cutSchema)
