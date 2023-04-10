import { type Comanda } from '@prisma/client'
import { createComanda } from './create-comanda'
import { faker } from '@faker-js/faker'

describe('createComanda', () => {
  describe('creates comanda', () => {
    let comanda: Comanda

    const COMANDA_PROPS = {
      name: faker.name.fullName(),
      cellphone: faker.phone.number()
    }

    beforeAll(async () => {
      comanda = await createComanda(COMANDA_PROPS)
    })

    it('returns the comanda', () => {
      expect(comanda).toEqual({
        id: expect.any(String),
        name: COMANDA_PROPS.name,
        cellphone: COMANDA_PROPS.cellphone,
        amount: 0,
        createdAt: expect.any(Date)
      })
    })
  })

  describe('tries to create two comandas with same cellPhone', () => {
    const CELL_PHONE = faker.phone.number()
    beforeAll(async () => {
      return await createComanda({
        name: faker.name.fullName(),
        cellphone: CELL_PHONE
      })
    })

    it('throws', async () => {
      await expect(
        createComanda({
          name: faker.name.fullName(),
          cellphone: CELL_PHONE
        })
      ).rejects.toThrow()
    })
  })
})
