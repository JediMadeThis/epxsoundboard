const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get();

app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});
