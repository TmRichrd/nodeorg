var express = require('express')
var session = require('express-session')
var app = express()
var path = require('path')
var router = require('./router')
var dateFormat = require('dateformat')
var template = require('art-template')
var bodyParser = require('body-parser')
var Topic = require('./models/topic')
var User = require('./models/use')
var Cut = require('./models/cut')
var Comments = require('./models/comments')

// body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/**
 * session 一定要在router之前使用
 *添加session数据:req.session.foo='bar'
 *访问session数据:req.session.foo
 */
app.use(
  session({
    /**
     * 配置加密字符串,他会在原有的字符串上加上这个字符串拼接起来去加密
     * 目的是增加安全性，防止客户端恶意伪造
     */
    secret: 'test',
    resave: false,
    saveUninitialized: true, // 无论你是否使用session，都默认给你分配一把钥匙
    cookie: { maxAge: 1000 * 60 * 60 } // 设置有效期为5分钟
  })
)

// 静态资源
app.use(
  '/node_modules/',
  express.static(path.join(__dirname, './node_modules/'))
)
app.use('/public/', express.static(path.join(__dirname, './public/')))
// 引擎渲染
app.engine('html', require('express-art-template'))
template.defaults.imports.dateFormat = dateFormat
app.get('/', async function(req, res) {
  // 默认当前页
  var page = req.query.page || 1
  // 每一页的数据
  var pagesize = 10
  // 跳到第几个数据
  var start = (page - 1) * pagesize

  var topicdata = await Topic.find()
    .limit(pagesize)
    .skip(start)
    .populate('cut')
    .populate('author')
  var count = await Topic.countDocuments({})
  // console.log(count)
  var total = Math.ceil(count / pagesize)
  // console.log(topicdata)
  /**
   * 作者其它话题
   * 1.根据作者id找到相关联的topic文章信息
   */

  res.render('index.html', {
    title: 'SaKItama Studio.',
    user: req.session.user,
    page: page,
    total: total,
    topicdata: topicdata
  })
  // Topic.find(async function(err, topic) {
  //   if (err) {
  //     return res.status(500).json({
  //       err_code: 500,
  //       message: 'Server error'
  //     })
  //   }
  //   // 数据长度
  //   const count = await Topic.countDocuments({})
  //   // 总页数
  //   const total = Math.ceil(count / pagesize)
  //   Topic.find()
  //     .populate('cut')
  //     .populate('author')
  //     .exec((err, cut) => {
  //       if (err) {
  //         return res.status(500).json({
  //           err_code: 500,
  //           message: 'Server error'
  //         })
  //       }
  //       // topic.cut=cut.cut
  //       // cut.forEach(item => {
  //       //   topic.forEach(item1 => {
  //       //     console.log(item1.cut)
  //       //     console.log(item.cut._id)
  //       //   })
  //       // })

  //       res.render('index.html', {
  //         title: 'SaKItama Studio.',
  //         user: req.session.user,
  //         topic: topic,
  //         page: page,
  //         total: total,
  //         cut: cut
  //       })
  //     })
  // })
  //   .limit(pagesize)
  //   .skip(start)
})
// 端口
app.listen(3000, function() {
  console.log('running...')
})
/**
 * 路由拦截
 * ***拦截必须放在静态资源后，路由器前
 */
// app.use(function(req, res, next) {
//   var url = req.originalUrl
//   var user = req.session.user
//   console.log(url)
//   if (url != '/blog/login' && !user) {
//     return res.redirect('/blog/login')
//   }
//   next()
// })
// router
app.use(router)
module.exports = app
