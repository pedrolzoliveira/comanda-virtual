import { prismaClient } from '@/config/prisma/client'
import { faker } from '@faker-js/faker'

export const factory = {
  createComanda: async (data?: {
    name?: string
    cellPhone?: string
    amount?: number
  }) => await prismaClient.comanda.create({
    data: {
      name: data?.name ?? faker.name.fullName(),
      cellPhone: data?.cellPhone ?? faker.phone.number(),
      amount: data?.amount ?? 0
    }
  }),
  createTransaction: async (data?: {
    comandaId?: string
    amount?: number
    description?: string
    type?: 'charge' | 'payment'
  }) => await prismaClient.transaction.create({
    data: {
      amount: data?.amount ?? faker.datatype.number({ min: 100, max: 2500 }),
      description: data?.description ?? faker.random.words(5),
      type: data?.type ?? faker.helpers.arrayElement(['charge', 'payment']),
      comanda: {
        connect: {
          id: data?.comandaId ?? (await factory.createComanda()).id
        }
      }
    }
  })

}
