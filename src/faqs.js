const express = require('express')
const joi = require('joi')
const { json } = require('express')

const db = require('monk')('localhost/faqs')

const quest = db.get('quest')

const router = express.Router()
const schema = joi.object({
  question: joi.string().trim().required(),
  answer: joi.string().trim().required(),
  video_url: joi.string().uri(),
  
})

// GET ALL
router.get('/', async (req, res, next) => {
  try {
    const items = await quest.find({})
    res.json(items)  
  } catch (error) {
    next(error)
  }
})

// GET One
router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    const item = await quest.findOne({
      _id:id
    })
    if(!item) return next()
    return res.json(item)
  } catch (error) {
    next(error)
  }
})

// POST - Create one
router.post('', async (req, res, next) => {
  try{
    console.log(req.body)
    const value = await schema.validateAsync(req.body)
    const inserted = await quest.insert(value)
    res.json(inserted)
  }
  catch(error){
    next(error)
  }
})


// PUT - Update one
router.put('/:id', async (req, res, next) => {
  try{
    console.log(req.body)
    const {id} = req.params
    const value = await schema.validateAsync(req.body)
    const item = await quest.findOne({
      _id:id
    })
    if(!item) return next()
    
    await quest.update({
      _id: id
    },{
      $set:value
    })

    return res.json(value)
  }
  catch(error){
    next(error)
  }
})

// DELETE - Delete one
router.delete('/:id', async (req, res, next) => {
  try {
    const {id} = req.params
    await quest.remove({
      _id:id
    })
    res.json({
      message:'Success'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router