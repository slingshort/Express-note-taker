const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');

const app = express();
const PORT = process.env.port || 3001;

// middlewards
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// home page
app.get('/', (req, res) => 
  res.send(path.join(__dirname,'/public/index.html'))
  );

// notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname,'/public/notes.html'))
);

// api get
app.get('/api/notes', (req,res) => {
  console.info(`${req.method} request recieved to retrieve notes`)

  fs.readFile(notes, 'utf-8', (err,data) => {
    if (err) {
      console.error(err)
      res.status(404).json('status:"get req fail"')
     } else {
      console.log('connection made')
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);
      res.status(200).json('status:"get req success"')
    }

  });
})
  


// api post
app.post('api/notes', (req, res) => {
  console.info(`${req.method} request recieved to add a note`)

  const {title, text} = req.body;

  if(title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    fs.readFile(notes, 'utf-8', (err, data) => {
      if(err) {
        console.error(err);
      } else {
        console.log('connection made')
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        fs.writeFile(
          'notes',
          JSON.stringify(parsedNotes, null, 3),
          (err) =>
            err
            ? console.error(err)
            : console.info('Successfully added note.')
            
        );
      } 
    });

    const response = {
      status: 'success',
      body: newNote,    
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('status: Error in post');
  }
})


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
 