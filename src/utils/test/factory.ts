import { prismaClient } from '@/config/prisma/client'
import { faker } from '@faker-js/faker'

export const factory = {
  createComanda: async (data?: {
    name?: string
    cellPhone?: string
    amount?: number
  }) => {
    return await prismaClient.comanda.create({
      data: {
        name: data?.name ?? faker.name.fullName(),
        cellPhone: data?.cellPhone ?? faker.phone.number(),
        amount: data?.amount ?? 0
      }
    })
  }
}
