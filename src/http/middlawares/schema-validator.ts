import { type NextFunction, type Request, type Response } from 'express'
import { checkSchema, type Schema } from 'express-validator'

export const schemaValidator = (schema: Schema) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    const resultArr = await checkSchema(schema).run(req)
    const errors = resultArr.map(result => result.array()).flat()
    if (errors.length) {
      return res.status(400).send({
        errors,
        schema
      })
    } else {
      next()
    }
  }
}
