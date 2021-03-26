import { Module } from '@nestjs/common';
import { AwsS3Module } from 'aws-s3/aws-s3.module';
import { StorageController } from './storage.controller';

@Module({
  controllers: [StorageController],
  imports: [AwsS3Module],
})
export class StorageModule {}
