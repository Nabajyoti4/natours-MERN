const dotenv = require('dotenv');

  // uncaught exceptions
  process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION')

      process.exit(1)

  }) 


dotenv.config({ path: './config.env' });


const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 3000;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfull');

  });

  const server = app.listen(port, () => {
    console.log(`App running on ${port}`);
  });


  //handle unhandles rejection
  process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION')
    server.close(() => {
      process.exit(1)
    });
  })


