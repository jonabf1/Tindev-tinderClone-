const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());

mongoose.connect('mongodb+srv://omnistack8:omnistack8@cluster0-vxghe.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true });

app.use(express.json());


app.use('/', require('./src/routes'));

app.listen(3333);