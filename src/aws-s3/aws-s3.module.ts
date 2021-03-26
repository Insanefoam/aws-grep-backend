import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import s3Factory from './aws-s3.factory';

@Module({
  providers: [AwsS3Service, s3Factory],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
