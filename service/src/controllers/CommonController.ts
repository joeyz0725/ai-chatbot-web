import { CommonService } from '../services/CommonService';
import { decryptedPassword, generateToken} from '../utils/helper';
import { isNumber} from '@/utils/is';
import { ChatService } from '../services/ChatService';
import { extractIPv4Address } from '../utils/helper'
import { getMorningTime } from '../utils/helper'

export class CommonController {
  private commonService: CommonService;
  private chatService: ChatService;

  constructor() {
    this.commonService = new CommonService();
    this.chatService = new ChatService();
  }

  // 在响应头上添加 JWT
  private addTokenToResponseHeader(res, token) {
    res.setHeader('authorization-web', `Bearer ${token}`);
  }

  public async login(req, res) {
    const { username, password } = req.body.user;
    // const thePassword = decryptedPassword(password)
    try{
      // 正常结果应包含用户基本信息+今日剩余聊天次数
      const result = await this.commonService.login(username, password)
      if (result.success) {
        const { id:userId, name, email, avatar, description, leftCount } = result.data
        const token = generateToken({userId, username})
        this.addTokenToResponseHeader(res, token)
        res.send({data: { name, email, avatar, description, leftCount }, success: true});
      }else{
        res.send(result);
      }
      res.end()
    } catch(e){
      res.send({message: '服务器错误', success: false});
    }
  }

  public async logout(req, res) {
    const userId = req.userId;
    const ipAddress = req.ip
    if (isNumber(userId)) {
      const ipv4Address = extractIPv4Address(ipAddress)
      // 去查当前ip下剩余的聊天次数
      const leftCount = await this.chatService.getLeftCountByIpAddress(ipv4Address)
      res.send({ status: 'Success', success: true, data: {leftCount: leftCount} });
    } else{
      res.send({ status: 'Fail', success: false, data: null });
    }
    res.end()
    return
  }

  public async refreshLeft(req, res) {
    const currentTime = new Date();
    const nextDay = currentTime.getHours() >= 5; // 判断当前时间是否在5点之后
    const targetTime = getMorningTime(nextDay);
    const timeDifference = targetTime.getTime() - currentTime.getTime();
    res.json({ timeDifference });
  }
}