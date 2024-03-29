require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :req-body'
  )
)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.get('/info', (request, response) => {
  const currentTime = new Date()
  const sizePhonebook = Phonebook.length
  response.send(
    `<p>Phonebook has info for ${sizePhonebook} <br /> ${currentTime}</p>`
  );
});

app.get('/api/persons/', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name and number not found' });
  }

  Person.findOne({ name: body.name }).then((result) => {
    if (result) {
      const person = {
        name: body.name,
        number: body.number,
      }

      Person.findByIdAndUpdate(
        result.id,
        person,
        { new: true },
        { runValidators: true }
      )
        .then((updatedPerson) => {
          response.json(updatedPerson)
        })
        .catch((error) => next(error))
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person
        .save()
        .then((Savedperson) => {
          response.json(Savedperson)
        })
        .catch((error) => next(error))
    }
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
