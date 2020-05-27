const express = require('express')
const app = express()

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


app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${contacts.length} people</p>
         <p>${new Date()}</p>`
    )
})


app.get('/api/contacts', (req, res) => {
    res.json(contacts)
})


app.get('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(c => c.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})


app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(c => c.id !== id)

    response.status(204).end()
})


const getRandomId = () => {
    return Math.floor(Math.random() * (10000 - 5)) + 5
}


app.post('/api/contacts', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (contacts.find(c => c.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const contact = {
        id: getRandomId(),
        name: body.name,
        number: body.number
    }

    contacts = contacts.concat(contact)

    response.json(contact)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})