import { CommonService } from '../services/CommonService'
import { extractIPv4Address, generateToken, getMorningTime } from '../utils/helper'
import { ChatService } from '../services/ChatService'
import { ConfigService } from '../services/ConfigService'
import { isNumber } from '@/utils/is'
import type { GptState, PasswordField } from '@/types'
import { chatGptConfig } from '@/config/chatgpt'
import { initializeChatGPT } from '@/chatgpt'
import { userInfo } from 'os'

interface User {
  name: string
  email: string
  avatar: string
  description: string
  roleType: number
  leftCount: number
}

interface TotalResult {
  data: {
    user: User | null
    config: GptState | null
  }
  success: boolean
  message: string
}

export class CommonController {
  private commonService: CommonService
  private chatService: ChatService
  private configService: ConfigService

  constructor() {
    this.commonService = new CommonService()
    this.chatService = new ChatService()
    this.configService = new ConfigService()
  }

  // 在响应头上添加 JWT
  private addTokenToResponseHeader(res, token) {
    res.setHeader('authorization-web', `Bearer ${token}`)
  }

  public async login(req, res) {
    const { username, password } = req.body.user
    try {
      // 正常结果应包含用户基本信息+今日剩余聊天次数
      let result: TotalResult = {
        data: {
          user: null,
          config: null,
        },
        success: false,
        message: '',
      }
      const userResult = await this.commonService.login(username, password)
      if (userResult.success) {
        const { id: userId, name, email, avatar, description, roleType } = userResult.user
        const leftCount = userResult.leftCount
        const token = generateToken({ userId, username })
        this.addTokenToResponseHeader(res, token)
        result = {
          data: {
            user: { name, email, avatar, description, roleType, leftCount },
            config: null,
          },
          success: true,
          message: '',
        }
        // 再查询配置的gpt
        const totalResult = await this.findOrCreateGptConfig(userId, result)
        // 再初始化单例的ChatGPT配置项
        await chatGptConfig.initializeGptState(userId)
        // 再刷新chatgpt/index.ts配置的部分gpt配置
        await initializeChatGPT()

        res.send(totalResult)
      }
      else {
        result.message = userResult.message
        res.send(result)
      }
      res.end()
    }
    catch (e) {
      res.send({ message: '服务器错误', success: false })
      throw(e)
    }
  }

  public async findOrCreateGptConfig(userId: number, totalResult: TotalResult): Promise<TotalResult> {
    const result = await this.configService.findOrCreateGptConfig(userId)
    if (result.success) {
      const { model, openaiAddress, openaiApiKey, reverseProxyAddress, accessToken } = result.data
      totalResult.data.config = {
        model,
        openaiAddress,
        openaiApiKey,
        reverseProxyAddress,
        accessToken,
      }
    }
    return totalResult
  }

  public async logout(req, res) {
    const userId = req.userId
    const ipAddress = req.ip
    if (isNumber(userId)) {
      const ipv4Address = extractIPv4Address(ipAddress)
      // 去查当前ip下剩余的聊天次数
      const leftCount = await this.chatService.getLeftCountByIpAddress(ipv4Address)
      // 销毁单例的ChatGPT配置项
      chatGptConfig.destroyGptState()
      // 再刷新chatgpt/index.ts配置的部分gpt配置
      await initializeChatGPT()
      res.send({ status: 'Success', success: true, data: { leftCount } })
    }
    else {
      res.send({ status: 'Fail', success: false, data: null })
    }
    res.end()
  }

  public async refreshLeft(req, res) {
    const currentTime = new Date()
    const nextDay = currentTime.getHours() >= 5 // 判断当前时间是否在5点之后
    const targetTime = getMorningTime(nextDay)
    const timeDifference = targetTime.getTime() - currentTime.getTime()
    res.json({ timeDifference })
  }

  public async changePassword(req, res) {
    const userId = req.userId
    const passwordInfo: PasswordField = {
      oldPassword: req.body.passwordInfo.oldPassword, 
      newPassword: req.body.passwordInfo.newPassword, 
      confirmNewPassword: req.body.passwordInfo.confirmNewPassword
    }
    try{
      if (isNumber(userId)) {
        const result = await this.commonService.changePassword(userId, passwordInfo)
        res.send(result)
      }
    }
    catch(error){
      res.send({ status: 'Fail', success: false, message: '操作失败' })
    }
    finally{
      res.end()
    }
  }
}
