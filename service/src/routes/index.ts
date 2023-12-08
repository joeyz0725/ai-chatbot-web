import { Router } from 'express'
import coreRoutes from './core'
import chatRoutes from './chat'
import userRoutes from './user'
import commonRoutes from './common'
import configRoutes from './config'
import adminRoutes from './admin'

const router = Router()
router.use('', coreRoutes)
router.use('/chat', chatRoutes)
router.use('/user', userRoutes)
router.use('/common', commonRoutes)
router.use('/config', configRoutes)
router.use('/admin', adminRoutes)

export default router
