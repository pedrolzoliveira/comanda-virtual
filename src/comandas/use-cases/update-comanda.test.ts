import { type Comanda } from '@prisma/client'
import { updateComanda } from './update-comanda'
import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import { prismaClient } from '@/config/prisma/client'

describe('updateComanda', () => {
  let comanda: Comanda

  const NAME = faker.name.fullName()
  const CELLPHONE = faker.phone.number('###########')

  beforeAll(async () => {
    comanda = await factory.createComanda()
    await updateComanda({ id: comanda.id, name: NAME, cellphone: CELLPHONE })
  })

  it('updates the comanda', async () => {
    await expect(
      prismaClient.comanda.findUnique({ where: { id: comanda.id } })
    ).resolves.toEqual({
      id: comanda.id,
      amount: comanda.amount,
      name: NAME,
      cellphone: CELLPHONE,
      createdAt: expect.any(Date)
    })
  })
})
