#!/usr/bin/node

const express = require('express');
const router = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`File Manager app is listening to ${port}`);
});
