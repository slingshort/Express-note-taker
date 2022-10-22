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
  return res.json(notes);
})
  


// api post
app.post("/api/notes", (req, res) => {
  // make let variable for new entries
  console.info(`${req.method} request recieved to add a note`)
  const getNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"))
  const {title, text} = req.body;
  if ( title && text ) {
      const newNote = {
          title,
          text,
          id: uuid (),
      }
      getNotes.push(newNote);
      let newData = JSON.stringify(getNotes)
      fs.writeFile("./db/db.json", newData, (err) => {
          if (err) {
              console.log(err);
              return res.json("Error");
          }
          const response = {
              status: "Success",
              body: newNote,
          };
          return res.json(response);
      })
  } else {
      return res.json("Please complete both note title and text field.");
  }

  });


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
 