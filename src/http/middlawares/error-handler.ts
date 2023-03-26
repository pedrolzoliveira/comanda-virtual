import { type Request, type Response, type NextFunction } from 'express'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).send(error)
}
