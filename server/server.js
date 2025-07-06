const express = require("express");

const getData = require('./src/GetData');
const { initDB, upsertData, getAccounts } = require('./src/db');
const buildTree = require('./src/buildTree');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(cors());

app.use(express.json());

initDB().catch(console.error);

async function updateData() {
  const records = await getData.getData();  // flat liste
  await upsertData(records);
}

updateData();
setInterval(updateData, 3*60*1000);

const update = require('./routes/update');
app.use("/update", update);

const lastUpdate = require('./routes/LastUpdate');
app.use("/LastUpdate", lastUpdate);

const port = process.env.PORT || 5000;
app.listen(port,   () => {
    console.log(`Server is running on port ${port}`);
 });
