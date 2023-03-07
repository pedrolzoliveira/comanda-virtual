import { type NextFunction, type Request, type Response } from 'express'

export const comandasController = {
  create: [
    (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.name || !req.body.cellPhone) {
        return res.sendStatus(400)
      }
      next()
    },
    async (req: Request, res: Response) => {
      return res.send(req.body)
    }
  ]
} as const
