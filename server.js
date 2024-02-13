const express = require('express');
const mapRouter = require('./routes/index');

const app = express();

const port = process.env.PORT || 5000;

mapRouter(app);

app.listen(port, () => {
  console.log(`File Manager app is listening to ${port}`);
});
