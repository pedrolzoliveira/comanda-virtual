import 'express-async-errors'
import express, { json } from 'express'
import cors from 'cors'
import { env } from '@/config/env'
import { errorHandler } from './middlawares/error-handler'
import { routes } from './routes'

export const server = express()

server.use(
  cors({ origin: env.CORS_ORIGIN })
)

server.use(json())

server.use(routes)

server.use(errorHandler)
