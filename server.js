const express = require('express');
const logger = require('morgan')
const passport = require('passport');
const cors = require('cors')

const app = express();
const PORT = 3002;


app.use(logger('dev'));
app.use(express.urlencoded())
app.use(express.json())
app.use(passport.initialize());
app.use(cors())

require('./auth/passport')


app.use(require('./auth/routes'))
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})