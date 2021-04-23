import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AwsCredentialsDto } from 'aws-s3/aws-s3.dto';
import { AwsCredentials } from 'storage/decorators';
import { AwsCredentialsGuard } from 'storage/guards';
import { ElasticSearchService } from './elastic-search.service';

@ApiTags('search')
@Controller('elastic-search')
@UseGuards(AwsCredentialsGuard)
export class ElasticSearchController {
  constructor(private readonly service: ElasticSearchService) {}

  @Post('index-objects/:bucket')
  async indexAllObjects(
    @AwsCredentials() credentials: AwsCredentialsDto,
    @Param('bucket') bucketName: string,
  ) {
    return this.service.indexAllObjects(credentials, bucketName);
  }

  @Get('search/:searchString')
  async search(
    @AwsCredentials() credentials: AwsCredentialsDto,
    @Param('searchString') searchString,
  ) {
    const elasticIndex = credentials.credentials.accessKeyId.toLowerCase();
    return this.service.searchFromIndex(elasticIndex, searchString);
  }
}
