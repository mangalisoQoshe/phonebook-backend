const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_KEY

console.log('Connecting to MongoDB')

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  });

function validator(val) {
  if (val.length >= 8) {
    const parts = val.split('-')
    if (parts[0].length < 2 || parts[0].length > 3 || parts.length !== 2) {
      return false    }
    return true
  }
  return false
}

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: { type: String, validate: validator },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
