const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/test')
const User = require('../../models/use')
const Gender = require('../../models/gender')
/**
 * 用户
 */
const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
})
/**
 * 文章
 */
const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
})

const Story = mongoose.model('Story', storySchema)
const Person = mongoose.model('Person', personSchema)

Person.find({ name: 'Tom Richard' })
  .populate('stories')
  .exec(function(err, person) {
    if (err) return handleError(err)
    console.log(person)
  })

// Story.find({ nickname: '' })
//   .populate('author')
//   .exec(function(err, user) {
//     if (err) return handleError(err)
//     console.log(user.gender.gender_name)
//   })

// const author = new Person({
//   _id: new mongoose.Types.ObjectId(),
//   name: 'Tom Richard',
//   age: 50
// })

// author.save(function(err) {
//   if (err) return handleError(err)

//   const story1 = new Story({
//     title: '小红帽',
//     author: author._id
//   })

//   story1.save(function(err) {
//     if (err) return handleError(err)
//   })
// })
