import { Router } from 'express'
import { comandasController } from './controller'

export const comandasRouter = Router()

comandasRouter.post('/', ...comandasController.create)
