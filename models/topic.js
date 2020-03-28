var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/test', { useUnifiedTopology: true })
var topicSchema = new Schema({
  _id: Schema.Types.ObjectId,
  // 标题
  title: {
    type: String,
    required: true
  },
  // 类型
  cut: {
    type: Schema.Types.ObjectId,
    /**
     * 0是分享，1是精华，2是问答，3是招聘，4是客户端测试
     */
    ref: 'Cut'
  },
  // 作者
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // 浏览次数
  browse: {
    type: Number,
    default: 0
  },
  // 内容
  content: {
    type: String,
    required: true
  },
  // 发表时间
  publishTime: {
    type: Date,
    default: Date.now
  },
  // 点赞数
  like: {
    type: Number,
    default: 0
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comments'
  }
})
module.exports = mongoose.model('topic', topicSchema)
