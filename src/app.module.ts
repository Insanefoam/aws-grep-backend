import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticSearchModule } from './elastic-search/elastic-search.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ElasticSearchModule, AwsS3Module, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
