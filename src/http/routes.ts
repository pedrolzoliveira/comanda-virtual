import { comandasRouter } from '@/comandas/router'
import { Router } from 'express'

export const routes = Router()

routes.use('/comandas', comandasRouter)
