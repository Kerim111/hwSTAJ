// routes/update.js
const express    = require('express');
const router     = express.Router();
const axios      = require('axios');
const getData    = require('../src/GetData');       
const { upsertData, getAccounts } = require('../src/db');  
const buildTree  = require('../src/buildTree');     


router.get('/', async (req, res) => {
  try {      
    const flat     = await getAccounts();  
    const tree     = buildTree(flat);       
    res.json(tree);
  } catch (err) {
    console.error('/update hata:', err);
    res.status(500).json({ error: 'Sync or buildTree failed' });
  }
});

module.exports = router;
