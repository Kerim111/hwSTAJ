// server/db.js
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL bağlantı havuzu
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }    // Render Postgres için gerekli
});

/**
 * 1) initDB: account_data tablosunu oluşturur (eğer yoksa)
 *    buildTree fonksiyonunun ihtiyaç duyduğu tüm sütunlar yer alır.
 */
async function initDB() {
  const sql = `
    CREATE TABLE IF NOT EXISTS account_data (
      hesap_kodu     VARCHAR(20) PRIMARY KEY,
      ust_hesap_id   VARCHAR(20),
      tipi           CHAR(1),
      borc           NUMERIC DEFAULT 0,
      alacak         NUMERIC DEFAULT 0,
      updated_at     TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(sql);
}

/**
 * 2) upsertData: API'den gelen flat kayıtları veritabanına yazar veya günceller
 * @param {Array<{hesap_kodu:string, ust_hesap_id:string, tipi:string, borc:number, alacak:number}>} records
 */
async function upsertData(records) {
  const sql = `
    INSERT INTO account_data(
      hesap_kodu, ust_hesap_id, tipi, borc, alacak
    ) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (hesap_kodu) DO UPDATE SET
      ust_hesap_id = EXCLUDED.ust_hesap_id,
      tipi         = EXCLUDED.tipi,
      borc         = EXCLUDED.borc,
      alacak       = EXCLUDED.alacak,
      updated_at   = NOW()
    WHERE account_data.borc   IS DISTINCT FROM EXCLUDED.borc
       OR account_data.alacak IS DISTINCT FROM EXCLUDED.alacak;
  `;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const rec of records) {
      await client.query(sql, [
        rec.hesap_kodu,
        rec.ust_hesap_id,
        rec.tipi,
        rec.borc,
        rec.alacak
      ]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * 3) getAccounts: Veritabanındaki tüm flat kayıtları döner
 *    buildTree({ hesap_kodu, ust_hesap_id, tipi, borc, alacak }) ile uyumludur.
 * @returns Promise<Array<{hesap_kodu:string, ust_hesap_id:string, tipi:string, borc:number, alacak:number}>>
 */
async function getAccounts() {
  const sql = `
    SELECT
      hesap_kodu,
      ust_hesap_id,
      tipi,
      borc,
      alacak
    FROM account_data
    ORDER BY hesap_kodu;
  `;
  const res = await pool.query(sql);
  return res.rows;
}

async function getLastUpdate() {
  const sql = `
    SELECT updated_at FROM account_data ORDER BY updated_at DESC LIMIT 1;
  `;
  const res = await pool.query(sql);
  return res.rows[0].updated_at;
}

module.exports = {
  initDB,
  upsertData,
  getAccounts,
  getLastUpdate
};
