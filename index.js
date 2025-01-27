require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(express.json())

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

morgan.token('contact', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))


app.get('/info', (request, response) => {
    Contact.count({}).then(contactsAmount => {
        response.send(
            `<p>Phonebook has info for ${contactsAmount} people</p>
             <p>${new Date()}</p>`
        )
    })
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
        .then(() => {
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

    contact.save()
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
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


