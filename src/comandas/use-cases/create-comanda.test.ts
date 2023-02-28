import { type Comanda } from '@prisma/client'
import { createComanda } from './create-comanda'
import { faker } from '@faker-js/faker'

describe('createComanda', () => {
  describe('creates comanda', () => {
    let comanda: Comanda

    const COMANDA_PROPS = {
      name: faker.name.fullName(),
      cellPhone: faker.phone.number()
    }

    beforeAll(async () => {
      comanda = await createComanda(COMANDA_PROPS)
    })

    it('returns the comanda', () => {
      expect(comanda).toEqual({
        id: expect.any(String),
        name: COMANDA_PROPS.name,
        cellPhone: COMANDA_PROPS.cellPhone,
        amount: 0
      })
    })
  })
})