import { Router } from 'express'
import { comandasController } from './controller'

export const comandasRouter = Router()

comandasRouter.post('/', ...comandasController.create)
comandasRouter.post('/charges', ...comandasController.addCharge)
