const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://pavel:${password}@cluster0-tp6ec.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
})


contact.save().then(response => {
    console.log(`contact '${contact.name}, number: ${contact.number}' added to phonebook`)
    mongoose.connection.close()
})


Contact.find({}).then(result => {
    result.forEach(contact => {
        console.log(contact)
    })
    mongoose.connection.close()
})