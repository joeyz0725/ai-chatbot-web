import { UserService } from '../services/UserService'
import { extractIPv4Address } from '../utils/helper'
import { RoleTypeMaxCountRel } from '@/types'

export class UserController {
  private userService: UserService
  private userId: number
  private ipAddress: string

  constructor() {
    this.userService = new UserService()
  }

  public async getUserState(req, res) {
    this.userId = req.userId || null
    if (this.userId) {
      const userState = await this.userService.getUserStateById(this.userId)
      res.send({ success: true, data: userState })
    }
  }

  public async getVisitorState(req, res) {
    this.ipAddress = req.ip || null
    const ipv4Address = extractIPv4Address(this.ipAddress)
    const leftCount = await this.userService.getUserStateByIpAddress(ipv4Address)
    const roleType = RoleTypeMaxCountRel.GUEST.roleType
    res.send({ success: true, data: { leftCount, roleType } })
  }

  public async saveUserInfo(req, res) {
    this.userId = req.userId || null
    const { name, avatar, description } = req.body.userInfo
    if (this.userId) {
      const result = await this.userService.saveUserInfoById(this.userId, { name, avatar, description })
      if (result.success) {
        res.send({ success: true, message: '修改个人资料成功' })
        return
      }
    }
    res.send({ success: false, message: '修改个人资料失败' })
    res.end()
  }
}
