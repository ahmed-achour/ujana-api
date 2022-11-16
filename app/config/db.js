const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('🟢 Connection to database success ! ');
  })
  .catch((error) => {
    console.error(error);
    console.log('🔴 Error Connection to database ! ');
  });

module.exports = { mongoose };
