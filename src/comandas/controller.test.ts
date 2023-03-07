import { server } from '@/http/server'
import { faker } from '@faker-js/faker'
import request, { type Response } from 'supertest'

describe('comandasController', () => {
  let response: Response
  describe('POST /comandas', () => {
    describe('2XX', () => {
      const COMANDA_DATA = {
        name: faker.name.fullName(),
        cellPhone: faker.phone.number()
      }

      describe('creates a comanda', () => {
        beforeAll(async () => {
          response = await request(server).post('/comandas').send(COMANDA_DATA)
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
          response = await request(server).post('/comandas').send({ cellPhone: faker.phone.number() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
      describe('tries to create a request without a cellPhone', () => {
        beforeAll(async () => {
          response = await request(server).post('/comandas').send({ name: faker.name.fullName() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
    })
  })
})
