const yargs = require('yargs');
const notes = require('./src/utilities');

//add a note
yargs.command({
  command: 'add',
  describe: 'add a new note',
  builder: {
    title: {
      describe: 'Note Title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: "Note's Body",
      demandOption: true,
      type: 'string',
    },
  },
  handler: function (argv) {
    notes.addNote(argv.title, argv.body);
  },
});

//remove a note
yargs.command({
  command: 'remove',
  describe: 'Remove Note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler: function (argv) {
    notes.removeNote(argv.title);
  },
});

//list a note
yargs.command({
  command: 'list',
  describe: 'List Notes',
  handler: function () {
    console.log(notes.getNotes());
  },
});

yargs.command({
  command: 'retrieve',
  describe: 'retrieve a note on basis of title',
  handler: function (argv) {
    console.log(notes.retrieveNote(argv.title));
  },
});
yargs.parse();
