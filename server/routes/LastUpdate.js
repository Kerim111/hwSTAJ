// routes/LastUpdate.js
const express = require('express');
const router  = express.Router();
const { getLastUpdate } = require('../src/db');
const getDataModule     = require('../src/GetData');

router.get('/', async (_req, res) => {
  const lastUpdate = await getLastUpdate();          
  const LastDBping = await getDataModule.ReturnDate();              
  res.json({ lastUpdate, LastDBping });
});

module.exports = router;
