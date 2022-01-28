const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/cars', require('./routes/cars'));

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
