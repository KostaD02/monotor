const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 2202;

const BASE_URL = path.join(__dirname, 'monotor-client-dist');

app.use(cors());
app.use(express.json());

app.use(express.static(BASE_URL));

app.get('*', (req, res) => {
  res.sendFile(path.join(BASE_URL, 'index.html'));
});

app.listen(PORT, () => {
  console.log(
    `[CLIENT] [LOG] [${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] Server is running on http://YOUR_LOCAL_IP_ADDRESS:${PORT}`,
  );
});
