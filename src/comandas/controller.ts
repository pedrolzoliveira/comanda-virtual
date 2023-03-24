import { schemaValidator } from '@/http/middlawares/schema-validator'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { type Request, type Response } from 'express'
import { addCharge } from './use-cases/add-charge'
import { createComanda } from './use-cases/create-comanda'

export const comandasController = {
  create: [
    schemaValidator({
      name: {
        isString: true
      },
      cellPhone: {
        isString: true
      }
    }),
    async (req: Request, res: Response) => {
      const data = req.body
      const comanda = await createComanda(data)
      return res.status(201).send(comanda)
    }
  ],
  addCharge: [
    schemaValidator({
      comandaId: {
        isUUID: true
      },
      description: {
        isString: true
      },
      value: {
        isInt: true
      }
    }),
    async (req: Request, res: Response) => {
      try {
        const charge = await addCharge(req.body)
        return res.status(201).send(charge)
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
          return res.sendStatus(404)
        } else {
          return res.sendStatus(200)
        }
      }
    }
  ]
} as const
