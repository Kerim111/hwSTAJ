const express = require("express");
const path = require("path");

const getData = require('./src/GetData');
const { initDB, upsertData, getAccounts } = require('./src/db');
const buildTree = require('./src/buildTree');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1) Serve React’s build output
//    (assumes you copied client/build → server/build in your Dockerfile)
app.use(express.static(path.join(__dirname, 'build')));

initDB().catch(console.error);

async function updateData() {
  const records = await getData.getData();
  await upsertData(records);
}

updateData();
setInterval(updateData, 3*60*1000);

// 2) Mount your API routes
const update = require('./routes/update');
app.use("/update", update);
const lastUpdate = require('./routes/LastUpdate');
app.use("/LastUpdate", lastUpdate);

// 3) All other GETs should send back React’s index.html
app.get('/:path*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const port = process.env.PORT || 5000;

console.log("= About to register these routes:");
app._router.stack
  .filter(r => r.route)
  .forEach(r => {
    const methods = Object.keys(r.route.methods).join(",");
    console.log(`${methods.toUpperCase()}  ${r.route.path}`);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
