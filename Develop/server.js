const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001;

const uuid = require('./helpers/uuid')
const db = require('./db/db.json');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(db));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/404.html')));


//  Post request to add new note
// {flag: 'w'} will need to require this to be able to overwrite db.json file
// Destructuring assignment from req.body 
app.post('/api/notes', (req, res) => {
    const { title, text} = req.body;
    
    const newNote = {
        title, 
        text,
        id: uuid(),
    };
    
    db.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(db), {flag: 'w'});
    res.send(newNote);
});


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});