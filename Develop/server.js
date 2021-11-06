const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
// Helper method for generating unique ids
// Db is where my objects are
const uuid = require('./helpers/uuid')
const db = require('./db/db.json');

// Will need express for this application 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
//  get route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
//  get route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});
// get route for all of the information in the db.json file
app.get('/api/notes', (req, res) => res.json(db));
// get route wildcard
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/404.html')));


// Post request to add new note
// Destructuring req.body to add id which will be randomly generated using the uuid.js helper function
app.post('/api/notes', (req, res) => {
    const { title, text} = req.body;
    
    const newNote = {
        title, 
        text,
        id: uuid(),
    };
// Will take newNote and push to db.json 
// then will overwrite the new db.json from the old one and db will need to be stringified to do so
// finally send back the new note
// {flag: 'w'} will need to require this to be able to overwrite db.json file
    db.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(db), {flag: 'w'});
    res.send(newNote);
});


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});