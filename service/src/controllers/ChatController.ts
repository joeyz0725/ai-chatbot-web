import { RequestProps } from '@/types';
import type { ChatMessage } from '@/chatgpt'
import { chatReplyProcess } from '@/chatgpt';
import { ChatService } from '../services/ChatService';
import { isNotEmptyString } from '../utils/is'
import { extractIPv4Address } from '../utils/helper'

export class ChatController {
  private chatService: ChatService;
  private userId: number;
  private ipAddress: string;

  constructor() {
    this.chatService = new ChatService();
  }

  private async chatReplyProcess(parameters: {
    message: string;
    lastContext: any;
    process: (chat: ChatMessage) => void;
    systemMessage: string;
    temperature: number;
    top_p: number;
  }): Promise<void> {
    // 在这里实现 chatReplyProcess 方法的逻辑
    await chatReplyProcess(parameters);
  }

  private async sendMessageToChatGPT(req, res, {leftCount, isLogin}){
    res.setHeader('Content-type', 'application/octet-stream');
    let responseObj: any = {}; // 创建一个空对象用于保存响应内容    
    try {
      const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps;
      let firstChunk = true;
      await this.chatReplyProcess({
        message: prompt,
        lastContext: options,
        process: (chat: ChatMessage) => {
          responseObj = { ...chat, 
            additional: {leftCount: leftCount-1, isLogin: isLogin},  }  
          res.write(firstChunk ? JSON.stringify(responseObj) :
                   `\n${JSON.stringify(responseObj)}`);
          firstChunk = false;
          
          // 如果请求ChatGPT成功，聊天次数-1
          this.decreaseLeftCount()
        },
        systemMessage,
        temperature,
        top_p,
      });
    } catch (error) {
      res.write(JSON.stringify({...error, 
        additional: {leftCount: leftCount, isLogin: isLogin}}));
    } finally {
      res.end();
    }
  }

  public async handleChatProcess(req, res) {
    this.userId = req.userId || null
    this.ipAddress = req.ip || null
    const leftCount: number = await this.getLeftCount(this.userId, this.ipAddress)
    const isLogin:boolean = this.userId?true:false
    if (leftCount === 0) {
      // 返回剩余次数为零的响应给前端
      res.send({ status: 'Success', additional: { leftCount: 0, isLogin: isLogin } });
      res.end();
      return;
    }
    this.sendMessageToChatGPT(req, res, { leftCount, isLogin })
    
  }

  public async getLeftCount(userId: number | null, ipAddress: string | null): Promise<number> {
    if (userId !== null) {
      return this.getLeftCountByUserId(userId);
    } else if (isNotEmptyString(ipAddress)) {
      return this.getLeftCountByIpAddress(ipAddress);
    } else {
      return 0
    }
  }

  public async getLeftCountByUserId(userId: number | null): Promise<number> {
    // 调用 ChatService 来查询 user_message_counts 表中的 left_count 值
    return this.chatService.getLeftCountByUserId(userId);
  }

  public async getLeftCountByIpAddress(ipAddress: string): Promise<number> {
    // 调用 ChatService 来查询 ip_address_message_counts 表中的 left_count 值
    const ipv4Address = extractIPv4Address(ipAddress)
    return this.chatService.getLeftCountByIpAddress(ipv4Address);
  }

  public async decreaseLeftCount(): Promise<void> {
    if (this.userId !== null) {
      await this.decreaseLeftCountByUserId(this.userId);
    } else if (isNotEmptyString(this.ipAddress)) {
      const ipv4Address = extractIPv4Address(this.ipAddress);
      await this.decreaseLeftCountByIpAddress(ipv4Address);
    } else {
      // 当既没有 userId 也没有 ipAddress 时，不进行任何操作
      return;
    }
  }
  
  private async decreaseLeftCountByUserId(userId: number): Promise<void> {
    // 调用 ChatService 中的方法来减少 user_message_counts 表中的聊天次数
    await this.chatService.decreaseLeftCountByUserId(userId);
  }
  
  private async decreaseLeftCountByIpAddress(ipAddress: string): Promise<void> {
    // 调用 ChatService 中的方法来减少 ip_address_message_counts 表中的聊天次数
    await this.chatService.decreaseLeftCountByIpAddress(ipAddress);
  }
}