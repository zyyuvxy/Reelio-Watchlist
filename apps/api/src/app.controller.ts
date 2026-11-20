import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'Reelio API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get()
  getRoot() {
    return {
      name: 'Reelio REST API',
      description: 'Personal watchlist API for movies and series',
      version: '1.0.0',
      status: 'active',
      docs: '/health',
    };
  }
}
