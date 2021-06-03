import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AwsCredentialsDto } from 'aws-s3/aws-s3.dto';
import { AwsCredentials } from 'storage/decorators';
import { AwsCredentialsGuard } from 'storage/guards';
import { SearchItemDto } from './elastic-search.dto';
import { ElasticSearchService } from './elastic-search.service';

@ApiTags('search')
@Controller('elastic-search')
@UseGuards(AwsCredentialsGuard)
export class ElasticSearchController {
  constructor(private readonly service: ElasticSearchService) {}

  @ApiOperation({ summary: 'Index all bucket objects' })
  @ApiOkResponse({ type: Boolean })
  @Post('index-objects/:bucket')
  async indexAllObjects(
    @AwsCredentials() credentials: AwsCredentialsDto,
    @Param('bucket') bucketName: string,
  ) {
    return this.service.indexAllObjects(credentials, bucketName);
  }

  @Get('search/:query')
  @ApiOkResponse({ type: SearchItemDto, isArray: true })
  async getSuggestions(
    @AwsCredentials() credentials: AwsCredentialsDto,
    @Param('query') query: string,
  ): Promise<SearchItemDto[]> {
    const elasticIndex = credentials.credentials.accessKeyId.toLowerCase();

    return this.service.search(elasticIndex, query);
  }
}
