import express from 'express'
import { authenticateUser } from '../middlewares/user/authenticateUser'
import { encryptPassword } from '../middlewares/user/passwordEncode'
import { AdminController } from '@/controllers/AdminController'

const adminRouter = express.Router()

adminRouter.use(express.static('public'))
adminRouter.use(express.json())

const adminController = new AdminController()

adminRouter.post('/create-account', [authenticateUser, encryptPassword], async (req, res) => {
  await adminController.createAccount(req, res)
})

adminRouter.post('/fetch-accounts', [authenticateUser], async (req, res) => {
  await adminController.fetchAccounts(req, res)
})

adminRouter.post('/reset-password', [authenticateUser], async (req, res) => {
  await adminController.resetPassword(req, res)
})

adminRouter.get('/fetch-api-config', [authenticateUser], async (req, res) => {
  await adminController.fetchApiConfig(req, res)
})

adminRouter.post('/save-api-config', [authenticateUser], async (req, res) => {
  await adminController.saveApiConfig(req, res)
})

export default adminRouter
