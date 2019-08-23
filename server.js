const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');
const path = require("path")
const indexRouter = require('./routes/index');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', pug);

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});


module.exports = app;
