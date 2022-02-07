const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.use(require('./api/middleware/AuthFilter'));

app.use('/api/auth', require('./api/controllers/AuthConteroller'));
app.use('/api/users', require('./api/controllers/UserController'));
app.use('/api/cars', require('./api/controllers/CarController'));

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
