import { AdminService } from '../services/AdminService'
import { getEnvApiConfig, saveEnvApiConfig } from '@/config/init'

export class AdminController {
  private adminService: AdminService

  constructor() {
    this.adminService = new AdminService()
  }

  public async createAccount(req, res) {
    const userId = req.userId
    const account: { username: string; password: string; roleType: number } = req.body.user
    if (userId != null) {
      const result = await this.adminService.createAccount(userId, account)
      res.send(result)
    }
    else {
      res.send({ success: false, message: '无权限创建账号' })
    }
    res.end()
  }

  public async fetchAccounts(req, res) {
    const userId = req.userId
    const searchParams = req.body.searchParams || ''
    if (userId != null) {
      const result = await this.adminService.searchAccounts(userId, searchParams)
      res.send(result)
    }
    else {
      res.send({ success: false, message: '无权限查询' })
    }
    res.end()
  }

  public async resetPassword(req, res) {
    const userId = req.userId
    const ids = req.body.ids || []
    if (userId == null) {
      res.send({ success: false, message: '无权限查询' })
      return
    }
    if (ids.length === 0) {
      res.send({ success: false, message: '未指定数据项' })
      return
    }
    const result = await this.adminService.resetUserPasswords(ids)
    res.send(result)
  }

  public async fetchApiConfig(req, res) {
    const userId = req.userId
    if (userId != null) {
      const result = await this.adminService.checkAuthority(userId)
      if (result.success) {
        const data = getEnvApiConfig()
        res.send({ success: true, data: data })
      }else{
        res.send(result)
      }
    }
    else {
      res.send({ success: false, message: '无权限查询' })
    }
    res.end()
  }

  public async saveApiConfig(req, res) {
    const userId = req.userId
    const apiConfig = req.body.config || {}
    if (userId != null) {
      const result = await this.adminService.checkAuthority(userId)
      if (result.success) {
        const saveSuccess = saveEnvApiConfig(apiConfig)
        if (saveSuccess) {
          res.send({ success: true, message: '保存成功', data: apiConfig})
        } else {
          res.send({ success: false, message: '保存失败' })
        }
      }else{
        res.send(result)
      }
    }
    else {
      res.send({ success: false, message: '无权限查询' })
    }
    res.end()
  }
}
