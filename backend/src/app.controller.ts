import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/chats')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Handles GET requests to /api/chats
  @Get()
  async getMessages() {
    return this.appService.getChats();
  }

  // Handles POST requests to /api/chats
  @Post()
  async sendMessage(@Body() body: { email: string; name: string; message: string }) {
    return this.appService.addChat(body.email, body.name, body.message);
  }
}