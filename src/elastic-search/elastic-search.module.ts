import { Module } from '@nestjs/common';
import { ElasticSearchController } from './elastic-search.controller';
import { ElasticSearchService } from './elastic-search.service';

@Module({
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService],
})
export class ElasticSearchModule {}
