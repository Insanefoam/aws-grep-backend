import { ELASTIC_SERVER_URL } from '@constants';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AwsS3Module } from 'aws-s3/aws-s3.module';
import { ElasticSearchController } from './elastic-search.controller';
import { ElasticSearchService } from './elastic-search.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: ELASTIC_SERVER_URL,
    }),
    AwsS3Module,
  ],
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService],
})
export class ElasticSearchModule {}
