import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CredentialsDto } from 'aws-s3/aws-s3.dto';
import { AwsS3Service } from 'aws-s3/aws-s3.service';
import { AwsCredentials } from 'storage/decorators';
import { AwsCredentialsGuard } from 'storage/guards';
import { ElasticSearchService } from './elastic-search.service';

@ApiTags('search')
@Controller('elastic-search')
@UseGuards(AwsCredentialsGuard)
export class ElasticSearchController {
  constructor(
    private readonly service: ElasticSearchService,
    private readonly s3Service: AwsS3Service,
  ) {}

  @Post(':bucket/index-all-objects')
  async indexAllObjects(
    @AwsCredentials() credentials: CredentialsDto,
    @Param('bucket') bucketName: string,
  ) {
    const bucketObjects = await this.s3Service.getAllBucketObjects(
      credentials,
      bucketName,
    );

    try {
      const elasticIndex = credentials.credentials.accessKeyId.toLowerCase();

      bucketObjects.forEach(async (obj) => {
        const fullObject = await this.s3Service.getObject(
          credentials,
          bucketName,
          obj.name,
        );

        this.service.addToIndex(elasticIndex, {
          bucketName,
          title: fullObject.name,
          text: fullObject.data,
        });
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong when indexing',
      );
    }

    return true;
  }

  @Get('search/:searchString')
  async search(
    @AwsCredentials() credentials: CredentialsDto,
    @Param('searchString') searchString,
  ) {
    const elasticIndex = credentials.credentials.accessKeyId.toLowerCase();
    return this.service.searchFromIndex(elasticIndex, searchString);
  }
}
