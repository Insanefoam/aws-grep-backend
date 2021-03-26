import { Controller, Get, Header } from '@nestjs/common';
import { AwsS3Service } from 'aws-s3/aws-s3.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
