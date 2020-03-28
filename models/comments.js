var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/test', { useUnifiedTopology: true })
var commentsSchema = new Schema({
  aid: {
    type: Schema.Types.ObjectId,
    ref: 'topic'
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  time: {
    type: Date
  },
  content: {
    type: String
  }
})
module.exports = mongoose.model('Comments', commentsSchema)
