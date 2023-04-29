import { Router } from 'express'
import { comandasController } from './controller'

export const comandasRouter = Router()

comandasRouter.get('/', ...comandasController.get)

comandasRouter.put('/', ...comandasController.update)
comandasRouter.put('/adjust', ...comandasController.adjustAmount)

comandasRouter.post('/', ...comandasController.create)
comandasRouter.post('/charges', ...comandasController.addCharge)
comandasRouter.post('/payments', ...comandasController.addPayment)
comandasRouter.post('/adjustments', ...comandasController.addAdjustment)
