const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://scherepa:sFnnHESHJ9nocBgW@toys-hackeru.aifll.mongodb.net/cards_project?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongo connected to cards_project");
  // we're connected!
});

module.exports = db;