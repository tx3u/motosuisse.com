const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@motosuisse.com';
  const password = 'Admin1234!';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin "${email}" existe déjà, seed ignoré.`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { email, mot_de_passe_hash: hash } });

  console.log(`Admin créé : ${email} / ${password}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
