import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AwsCredentialsDto } from 'aws-s3/aws-s3.dto';
import { AwsS3Service } from 'aws-s3/aws-s3.service';
import { AwsCredentials } from './decorators';
import { AwsCredentialsGuard } from './guards';
import { AwsObjectDto } from './storage.dto';

@ApiTags('storage')
@Controller('storage')
@UseGuards(AwsCredentialsGuard)
export class StorageController {
  constructor(private readonly awsService: AwsS3Service) {}

  @Post('/validate')
  @ApiOperation({ summary: 'Validate AWS Credentials' })
  @ApiOkResponse({ type: Boolean })
  validateCredentials(@AwsCredentials() credentials: AwsCredentialsDto) {
    return this.awsService.validateCredentials(credentials);
  }

  @Get('/buckets')
  @ApiOperation({ summary: 'Retrieves all user AWS buckets names' })
  @ApiOkResponse({ type: String, isArray: true })
  getAllBuckets(@AwsCredentials() credentials: AwsCredentialsDto) {
    return this.awsService.getAllBuckets(credentials);
  }

  @Get('/buckets/:name/objects')
  @ApiOperation({ summary: 'Retrieves all object from bucket' })
  @ApiOkResponse({ type: AwsObjectDto, isArray: true })
  getAllBucketObject(
    @AwsCredentials() credentials: AwsCredentialsDto,
    @Param('name') bucketName,
  ) {
    return this.awsService.getAllBucketObjects(credentials, bucketName);
  }

  @Get('/buckets/:name/objects/:objectKey')
  @ApiOperation({ summary: 'Retrieves one object from bucket' })
  @ApiOkResponse({ type: AwsObjectDto })
  getOneObject(
    @AwsCredentials() credentials: AwsCredentialsDto,
    @Param('name') bucketName,
    @Param('objectKey') objectKey,
  ) {
    return this.awsService.getObject(credentials, bucketName, objectKey);
  }
}
