import { schemaValidator } from '@/http/middlawares/schema-validator'
import { type Request, type Response } from 'express'
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
  ]
} as const
