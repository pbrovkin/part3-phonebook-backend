const express = require('express')
const app = express()

app.use(express.json())

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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})