import { AdminService } from '../services/AdminService'

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
}
