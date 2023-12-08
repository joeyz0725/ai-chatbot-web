import express from 'express'
import { authenticateUser } from '../middlewares/user/authenticateUser'
import { ConfigController } from '../controllers/ConfigController'

const configRouter = express.Router()

configRouter.use(express.static('public'))
configRouter.use(express.json())

const configController = new ConfigController()

configRouter.post('/gpt', [authenticateUser], async (req, res) => {
  await configController.fetchChatgptConfig(req, res)
})

configRouter.post('/save-gpt', [authenticateUser], async (req, res) => {
  await configController.updateChatgptConfig(req, res)
})

export default configRouter
