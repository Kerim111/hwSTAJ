const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upsertData(records) {
  for (const record of records) {
    await prisma.accountData.upsert({
      where: { hesap_kodu: record.hesap_kodu },
      update: {
        ust_hesap_id: record.ust_hesap_id,
        tipi:         record.tipi,
        borc:         record.borc,
        alacak:       record.alacak,
        updated_at:   new Date(),
      },
      create: {
        hesap_kodu:   record.hesap_kodu,
        ust_hesap_id: record.ust_hesap_id,
        tipi:         record.tipi,
        borc:         record.borc,
        alacak:       record.alacak,
      },
    });
  }
}

async function getAccounts() {
  return prisma.accountData.findMany({ orderBy: { hesap_kodu: 'asc' } });
}

async function getLastUpdate() {
  const last = await prisma.accountData.findFirst({
    orderBy: { updated_at: 'desc' },
    select:  { updated_at: true },
  });
  return last?.updated_at;
}

module.exports = {
  upsertData,
  getAccounts,
  getLastUpdate
};
