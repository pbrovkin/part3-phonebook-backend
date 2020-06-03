require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(express.json())

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

morgan.token('contact', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))

let contacts = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
]


app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${contacts.length} people</p>
         <p>${new Date()}</p>`
    )
})


app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts.map(contact => contact.toJSON()))
    })
})


app.get('/api/contacts/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(204).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/contacts/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/contacts', (request, response, next) => {
    const body = request.body

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact
        .save()
        .then(savedContact => {
            response.json(savedContact.toJSON())
        })
        .catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
    const body = request.body

    const contact = {
        name: body.name,
        number: body.number,
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
        .then(updatedContact => {
            response.json(updatedContact.toJSON())
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


