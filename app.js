const express = require('express');
const app = express();
const User = require('./routes/user');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(User);

app.listen(3000, () => {
    console.log('App will running Successfully');
});
