import { server } from '@/http/server'
import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import request, { type Response } from 'supertest'

describe('comandasController', () => {
  let response: Response
  describe('POST /comandas', () => {
    const makeRequest = async (data: any) => await request(server).post('/comandas').send(data)

    describe('2XX', () => {
      const COMANDA_DATA = {
        name: faker.name.fullName(),
        cellPhone: faker.phone.number()
      }

      describe('creates a comanda', () => {
        beforeAll(async () => {
          response = await makeRequest(COMANDA_DATA)
        })

        it('returns 201', () => {
          expect(response.statusCode).toBe(201)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({
            id: expect.any(String),
            name: COMANDA_DATA.name,
            cellPhone: COMANDA_DATA.cellPhone,
            amount: 0
          })
        })
      })
    })
    describe('4XX', () => {
      describe('tries to create a request withou name', () => {
        beforeAll(async () => {
          response = await makeRequest({ cellPhone: faker.phone.number() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
      describe('tries to create a request without a cellPhone', () => {
        beforeAll(async () => {
          response = await makeRequest({ name: faker.name.fullName() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
    })
  })
  describe('POST /comandas/charges', () => {
    const makeRequest = async (data: any) => await request(server).post('/comandas/charges').send(data)

    const createValidBody = (data: { comandaId?: string, description?: string, value?: number } = {}) => ({
      comandaId: data.comandaId ?? faker.datatype.uuid(),
      description: data.description ?? faker.random.words(3),
      value: data.value ?? faker.datatype.number({ min: 100, max: 2500 })
    })

    describe('2XX', () => {
      describe('creates a charge', () => {
        let CHARGE_DATA: ReturnType<typeof createValidBody>
        beforeAll(async () => {
          const { id: comandaId } = await factory.createComanda()
          CHARGE_DATA = createValidBody({ comandaId })
          response = await makeRequest(CHARGE_DATA)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({
            id: expect.any(String),
            comandaId: CHARGE_DATA.comandaId,
            type: 'charge',
            description: CHARGE_DATA.description,
            amount: CHARGE_DATA.value
          })
        })

        it('returns 201', () => {
          expect(response.statusCode).toBe(201)
        })
      })
    })

    describe('4XX', () => {
      describe('tries to create a charge without comandaId', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            comandaId: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge without description', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            description: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge without value', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            value: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge with comandaId as random word', () => {
        beforeAll(async () => {
          response = await makeRequest(createValidBody({ comandaId: faker.random.word() }))
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge with an inexisting comanda', () => {
        beforeAll(async () => {
          response = await makeRequest(createValidBody())
        })

        it('returns 404', () => {
          expect(response.statusCode).toBe(404)
        })
      })
    })
  })
})
