const { PrismaClient } = require('@prisma/client')

async function main () {
  const client = new PrismaClient()
  await client.transaction.deleteMany()
  await client.comanda.deleteMany()
}

module.exports = main
