const express = require('express')
const app = express()

app.use(express.json())

let contacts = [
    {
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})