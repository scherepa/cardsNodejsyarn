const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI||"mongodb://0.0.0.0:27017/cards_project", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongo connected to cards_project");
  // we're connected!
});

module.exports = db;