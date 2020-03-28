var express = require('express')
var fs = require('fs')
var User = require('./models/use')
// markdown 插件让markdown转为html
var showdown = require('showdown')
var mongoose = require('mongoose')
// mongoose.set('useFindAndModify', false)
var Topic = require('./models/topic')
var md5 = require('blueimp-md5')
var path = require('path')
var Gender = require('./models/gender')
var Cut = require('./models/cut')
var multer = require('multer')
var Comments = require('./models/comments')
// 图片二进制保存的数据路径
var upload = multer({ dest: 'upload_tmp/' })
var router = express.Router()

/**
 * 返回首页
 * 获取文章信息
 */
router.get('/', function(req, res) {
  /**
   * 分页功能
   */

  Topic.find(function(err, topic) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server error'
      })
    }
    // console.log(topic)
    res.render('index.html', {
      user: req.session.user,
      topic: topic
    })
  })
  // var user=req.session.user
  // console.log(user)
  // var nickname=user.nickname
  // console.log(nickname)
})
/**
 * 博客登录
 * 处理跳转到登录和注册页面请求
 */
router.get('/blog/login', function(req, res) {
  res.render('login.html')
})
/**
 * 处理注册请求
 */
router.post('/register', function(req, res) {
  var str = JSON.stringify(req.body)
  str = JSON.parse(str)
  // console.log(str)
  User.findOne(
    {
      $or: [{ email: str.regemail }, { nickname: str.nickname }]
    },
    function(err, data) {
      // 如果查找发生错误
      if (err) {
        console.log('111111111111')
        return res.status(500).json({
          err_code: 500,
          message: '服务器错误!'
        })
      }
      // 如果有这个数据
      if (data) {
        console.log('22222222222222')
        return res.status(200).json({
          err_code: 1,
          message: '用户名或者昵称已存在!'
        })
      }
      str.password = md5(str.password)
      // 如果没有这个数据
      // 密码加密

      const gender = new Gender({
        _id: new mongoose.Types.ObjectId(),
        gender_name: '保密'
      })
      gender.save(function(err) {
        if (err) {
          console.log('3333333333333333')
          return res.status(500).json({
            err_code: 500,
            message: 'Server error'
          })
        }
      })

      str.gender = gender._id
      str._id = new mongoose.Types.ObjectId()
      // console.log(str)
      new User(str).save(function(err, user) {
        if (err) {
          console.log(err)
          return res.status(500).json({
            err_code: 500,
            message: '服务器错误!'
          })
        }
        // 注册成功后保存用户session
        req.session.user = user

        // console.log(gender)

        // User.find()
        //   .populate('Gender')
        //   .exec(function(err, user) {
        //     if (err) {
        //       return handleError(err)
        //     }
        //     console.log(user)
        //   })
        res.status(200).json({
          err_code: 0,
          message: 'ok!'
        })
        /**
         * 重定向只对同步请求有用，异步请求无效
         */
        // res.redirect('/')
      })
    }
  )
})
/**
 * 处理登录请求
 */
router.post('/login', function(req, res) {
  var loginStr = JSON.stringify(req.body)
  loginStr = JSON.parse(loginStr)
  // console.log(loginStr)
  User.findOne(
    {
      email: loginStr.loginemail,
      password: md5(loginStr.loginpassword)
    },
    function(err, user) {
      // 登录错误
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: err.message
        })
      }
      // 用户不存在
      if (!user) {
        // console.log(md5(loginStr.loginpassword))
        return res.status(200).json({
          err_code: 1,
          message: '邮箱或者密码错误!'
        })
      }
      // 如果存在，通过req.session记录登录状态
      req.session.user = user
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    }
  )
})
/**
 * 路由拦截功能
 */
router.get('*', function(req, res, next) {
  var path = req.path
  var user = req.session.user
  // console.log('session', user)
  if (path != '/login' && path != '/') {
    if (!user) {
      res.redirect('/blog/login')
    }
  }
  next()
})
/**
 * 处理退出功能
 */
router.get('/logout', function(req, res) {
  // 清除session
  // 重定位
  req.session.user = null
  res.redirect('/')
})
/**
 * 跳转到发表文章界面
 */
router.get('/title', function(req, res) {
  var user = req.session.user
  res.render('publish.html', {
    user: user
  })
})
/**
 * 发表文章
 */
router.post('/blog/publish', async function(req, res) {
  var publish = JSON.stringify(req.body)
  publish = JSON.parse(publish)
  var user = req.session.user
  publish.author = user._id
  var cutdata = publish.cut
  const cut = new Cut({
    _id: new mongoose.Types.ObjectId(),
    cut: cutdata
  })
  // 实例化showdown
  ;(converter = new showdown.Converter()),
    (text = publish.content),
    (showhtml = converter.makeHtml(text))
  // console.log(showhtml)

  cut.save(err => {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误!'
      })
    }
  })
  /**
   *
   */
  // var comments = new Comments({
  //   _id: new mongoose.Types.ObjectId(),

  // })

  var topicdata = {
    _id: new mongoose.Types.ObjectId(),
    title: publish.title,
    cut: cut._id,
    author: publish.author,
    content: showhtml
    // comments:comments._id
  }

  /**
   * 实现显示作者全部文章功能
   */

  /**
   * 实现发帖增加积分功能
   */
  let jf = await User.findOne({ _id: user._id })
  // console.log(jf)

  var jfint = jf.integral
  // console.log(jfint)
  jfint += 2
  var resultjf = {
    integral: jfint
  }
  User.findByIdAndUpdate({ _id: user._id }, resultjf, err => {
    if (err) {
      return res.json({
        err_code: 500,
        message: '插入失败!'
      })
    }
  })

  new Topic(topicdata).save(async (err, topic) => {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误!'
      })
    }

    /**
     *评论数组表等到评论之后设置
     *1.评论的时候获取内容和用户以及时间
     *2.将内容插入到comments表中
     *3.同时将comments中的ObjectId插入到topic表的comments中去
     */
    // comments.save(err => {
    //   if (err) {
    //     return res.status(500).json({
    //       err_code: 500,
    //       message: '评论错误!'
    //     })
    //   }

    // })
    res.status(200).json({
      err_code: 0,
      message: 'ok!'
    })
  })
})
/**
 * 个人主页
 */
router.get('/personal', function(req, res) {
  var user = req.session.user
  // console.log(user.nickname)
  // User.findOne({ nickname: user.nickname })
  //   .populate('gender')
  //   .exec(function(err, user) {
  //     if (err) return handleError(err)
  //     console.log(user.gender.gender_name)

  //   })
  User.findOne({ nickname: user.nickname })
    .populate('gender')
    .exec(function(err, user) {
      if (err)
        return res.status(500).json({
          err_code: 500,
          message: 'Server error'
        })
      var gender_name = user.gender.gender_name
      // console.log(gender_name)
      // console.log(user.gender.gender_name)
      res.render('personal.html', {
        user: user,
        gender_name: gender_name
      })
    })
})
/**
 * 修改信息
 */
router.post('/personal', upload.any(), async function(req, res, next) {
  var files = req.files[0].originalname
  // console.log(req.files[0])
  // 通过拼接的方式设置文件保存的路径
  var des_file = './public/images/' + files
  // console.log(des_file)
  // 读取上传文件的目录
  fs.readFile(req.files[0].path, function(err, data) {
    // console.log(data)
    // 将文件写入设置的路径：des_file
    fs.writeFile(des_file, data, function(err) {
      if (err) {
        return err
      }
      response = {
        message: '文件上传成功!',
        filename: req.files[0].originalname
      }
      // console.log(response)
      // res.send(JSON.stringify(response))
    })
  })
  // 获取前端传来的数据
  var personal = JSON.stringify(req.body)
  personal = JSON.parse(personal)
  // 获取前端传来的改变性别的值
  /**
   * 如果用户没有上传头像，我就设置为默认头像
   * 如果用户上传了头像，就将路径保存到数据库
   * multer不知道怎么解决
   */
  // 获取session中的数据
  var user = req.session.user
  personal.avater = des_file
  // personal.nickname=user.nickname
  /**
   * 覆盖原有数据
   */
  // ！！！！！将前端传来的字符串转为json格式
  var perGender_name = {
    gender_name: personal.gender_name
  }
  // console.log(personal, user.gender, perGender_name)
  /**
   * 根据session中user._id更新用户，personal格式为json对象
   * 更新成功后同时更新gender中id对应的Gender model中的gender_name数据
   */
  User.findByIdAndUpdate(user._id, personal, err => {
    if (err) {
      return res.send('更新失败!')
    }
    /**
     * 根据用户session中gender值去查询Gender模型中的数据
     */
    Gender.findByIdAndUpdate(user.gender, perGender_name, async err => {
      if (err) {
        return res.json({
          err_code: 1,
          message: '修改失败!'
        })
      }
      /**
       * 解决重定向后信息不更新的问题
       * 1.重新到mongodb中根据id查找用户
       */
      await User.findOne({ _id: user._id }, (err, user) => {
        if (err) {
          return res.status(500).json({
            err_code: 500,
            message: err.message
          })
        }
        // 2.把修改后的信息重新保存到session中
        req.session.user = user
      })
      // 重定位到主页
      res.redirect('/')
    })
  })
})
/**
 * 修改密码
 */
router.post('/changePassword', (req, res) => {
  var newpassword = JSON.stringify(req.body)
  newpassword = JSON.parse(newpassword)
  // console.log(newpassword)
  var npw = newpassword.newpassword
  npw = md5(npw)
  var updatepassword = {
    password: npw
  }

  var user = req.session.user
  User.findByIdAndUpdate(user._id, updatepassword, err => {
    if (err) {
      return res.json({
        err_code: 1,
        message: '修改失败!'
      })
    }
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})
/**
 * 跳转到文章详情页面
 */
router.get('/article', async (req, res) => {
  var query = JSON.stringify(req.query)
  var user = req.session.user
  var id = req.query.id
  query = JSON.parse(query)
  // console.log(query)
  /**
   * 查询文章所有评论
   */
  let comments = await Comments.find({ aid: query.title_id }).populate('uid')

  Topic.find({ _id: query.title_id }, (err, topic) => {
    if (err) {
      // console.log(err)
      return res.status(500).json({
        err_code: 500,
        message: '服务器错误!'
      })
    }
    if (!topic) {
      return res.status(500).json({
        err_code: 500,
        message: '找不到这篇文章了!'
      })
    }
    // console.log(topic[0].author)

    /**
     * 关联查询
     */
    Topic.findOne({ _id: topic[0]._id })
      .populate('author')
      .populate('cut')
      .exec(async (err, awdata) => {
        if (err) {
          return res.json({
            err_code: 500,
            message: '查询失败!'
          })
        }
        let author_other = await Topic.find({ author: user._id }).populate(
          'author'
        )
        console.log(author_other)
        /**
         * 实现浏览次数增加功能
         */
        // console.log(awdata._id)
        Topic.findOne({ _id: topic[0]._id }, (err, browseData) => {
          if (err) {
            return res.json({
              err_code: 500,
              message: '插入失败!'
            })
          }
          var nbrowse = browseData.browse
          nbrowse += 1
          /**
           * 更新到数据库中
           */
          var sbrowse = {
            browse: nbrowse
          }
          Topic.findByIdAndUpdate(topic[0]._id, sbrowse, err => {
            if (err) {
              return res.json({
                err_code: 500,
                message: '插入失败!'
              })
            }
            res.render('article.html', {
              user: user,
              topic: topic,
              awdata: awdata,
              author_other: author_other,
              comments: comments
            })
          })
        })

        // nbrowse += 1
        // var sbrowse = {
        //   browse: nbrowse
        // }
        // console.log(awdata._id)
        // Topic.findByIdAndUpdate(awdata._id, sbrowse, err => {
        //   if (err) {

        //   }

        // })

        // console.log(nbrowse)

        // console.log(awdata.browse)
      })
  })
})
/**
 * 添加评论
 */
router.post('/comments', async (req, res) => {
  const { content, uid, aid } = req.body
  await Comments.create({
    content: content,
    uid: uid,
    aid: aid,
    time: new Date()
  })
  res.redirect('/article?title_id=' + aid)
})
module.exports = router
