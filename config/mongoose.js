const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/OAuth`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database successfully');
});

module.exports = db;