import express, { json } from 'express'
import { routes } from './routes'

export const server = express()

server.use(json())

server.use(routes)
