const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE);
const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});

const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

