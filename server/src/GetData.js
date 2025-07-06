const axios = require('axios');
const https = require('https');
const buildTree = require('./buildTree');
const parseData = require('./ParseData');

var LocalDate;

async function ReturnDate() {
    return LocalDate;
}

async function getData() {
    var data = {};
    var SessionToken = '';
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.post(
        'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions',
        {},
        {
          httpsAgent: agent,
          auth: { username: 'apitest', password: 'test123' },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      SessionToken = response.data.response.token;
      console.log(SessionToken);
      console.log("--------------------------------");
      try {
        const url = 'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1';   
        
        const agent = new https.Agent({ rejectUnauthorized: false });

        const response = await axios.patch(
          url,
          {
            fieldData: {},
            script: 'getData'
          },
          {
            httpsAgent: agent,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SessionToken}`
            }
          }
        );
    
        data = response.data.response.scriptResult;
        let raw = parseData(data);
        LocalDate = new Date();
        return raw.map(r => ({
            hesap_kodu: r.hesap_kodu,
            ust_hesap_id: r.ust_hesap_id || null,
            tipi: r.tipi || 'B', // Default to 'B' if not specified
            borc: r.borc || 0,
            alacak: r.alacak || 0
          }));

      } catch (err) {
        console.error('Hata:', err.response ? err.response.data : err.message);
      }

    } catch (err) {
      console.error('Axios hata:', err);
    }
}

module.exports = {getData, ReturnDate};




