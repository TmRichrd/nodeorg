var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
var userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  // 昵称
  nickname: {
    type: String,
    required: true
  },
  // 邮箱
  email: {
    type: String,
    unique: true,
    required: true
  },
  // 密码
  password: {
    type: String,
    required: true
  },
  // 注册时间
  create_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  // 最后登录的时间
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  // 用户默认头像
  avater: {
    type: String,
    default: '/public/images/avater.png'
  },
  // 简介
  bio: {
    type: String,
    default: '这家伙很懒，什么个性签名都没有留下。'
  },
  // 性别
  gender: { type: Schema.Types.ObjectId, ref: 'Gender' },
  // 生日
  birthday: {
    type: Date
  },
  // 积分
  integral: {
    type: Number,
    default: 0
  },
  // 状态
  status: {
    // 0是启用
    // 1是封禁
    type: Number,
    enum: [0, 1],
    defalut: 0
  },
  // 所有文章
  works: [
    {
      type: Schema.Types.ObjectId,
      ref: 'topic'
    }
  ]
})
module.exports = mongoose.model('User', userSchema)
