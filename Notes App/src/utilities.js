const fs = require('fs');

//add a note
const addNote = function (title, body) {
  const notes = loadNotes();
  const duplicateNotes = notes.filter(function (note) {
    return note.title === title;
  });
  if (duplicateNotes.length === 0) {
    notes.push({
      title: title,
      body: body,
    });
    saveNotes(notes);
    console.log('New note added!');
  } else {
    console.log('Note title taken!');
  }
};

//remove a note
const removeNote = function (title) {
  const notes = loadNotes();
  const notesToKeep = notes.filter(function (note) {
    return note.title !== title;
  });

  if (notes.length > notesToKeep.length) {
    console.log('Note removed');
    saveNotes(notesToKeep);
  } else {
    console.log('No note found!');
  }
};

//saving a note
const saveNotes = function (notes) {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('./src/notes.json', dataJSON);
};

const getNotes = () => {
  const dataBuffer = fs.readFileSync('./src/notes.json');
  const dataObject = dataBuffer.toString();
  return JSON.parse(dataObject);
};
//LoadNotes
const loadNotes = function () {
  try {
    const dataBuffer = fs.readFileSync('./src/notes.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

//retrieve Note
const retrieveNote = (title) => {
  try {
    myArray = loadNotes();
    const body = myArray.find((note) => note.title === title);
    return body.body;
  } catch (e) {
    console.log('No Such Note with the title as ->', title);
    return '';
  }
};

//exports to app.js
module.exports = {
  getNotes: getNotes,
  addNote: addNote,
  removeNote: removeNote,
  retrieveNote: retrieveNote,
};
