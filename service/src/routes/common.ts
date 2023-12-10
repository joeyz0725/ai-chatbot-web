import express from 'express'
import { authenticateUser } from '../middlewares/user/authenticateUser'
// import { encryptChangedPassword } from '../middlewares/user/passwordEncode'
import { CommonController } from '@/controllers/CommonController'

const commonRouter = express.Router()

commonRouter.use(express.static('public'))
commonRouter.use(express.json())

const commonController = new CommonController()

commonRouter.post('/login', [authenticateUser], async (req, res) => {
  await commonController.login(req, res)
})

commonRouter.post('/logout', [authenticateUser], async (req, res) => {
  await commonController.logout(req, res)
})

commonRouter.post('/refresh-left', [authenticateUser], async (req, res) => {
  await commonController.refreshLeft(req, res)
})

commonRouter.post('/change-password', [authenticateUser], async (req, res) => {
  await commonController.changePassword(req, res)
})

export default commonRouter
