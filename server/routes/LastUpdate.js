// routes/LastUpdate.js
const express = require('express');
const router  = express.Router();
const { getLastUpdate } = require('../src/db');
const getDataModule     = require('../src/GetData');

router.get('/', async (_req, res) => {
  // ① When did we last write to the DB?
  const lastUpdate = await getLastUpdate();          
  // ② When did we last ping the external API?
  const LastDBping = await getDataModule.ReturnDate();              
  // Send back both in one object
  res.json({ lastUpdate, LastDBping });
});

module.exports = router;
