import { AWS_BUCKET_NAME } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { CredentialsDto, AwsObjectDto } from './aws-s3.dto';

@Injectable()
export class AwsS3Service {
  private readonly bucketName = AWS_BUCKET_NAME;
  private readonly linkExpires = 60 * 60 * 10;

  constructor(@Inject('S3_STORAGE') private readonly storage: S3) {}

  configureCredentials({ region, credentials }: CredentialsDto) {
    this.storage.config.region = region;
    this.storage.config.credentials = credentials;
  }

  async getAllBuckets(credentials: CredentialsDto): Promise<string[]> {
    this.configureCredentials(credentials);

    return await new Promise<string[]>((resolve) => {
      this.storage.listBuckets((err, data) => {
        const buckets = data.Buckets;
        const bucketsNames = buckets.map((el) => el.Name);
        resolve(bucketsNames);
      });
    });
  }

  async getAllBucketObjects(
    credentials: CredentialsDto,
    bucketName: string,
  ): Promise<AwsObjectDto[]> {
    this.configureCredentials(credentials);

    return await new Promise((resolve, reject) => {
      this.storage.listObjects({ Bucket: bucketName }, (err, data) => {
        const objects: AwsObjectDto[] = data.Contents.map((el) => ({
          name: el.Key,
          size: el.Size,
        }));

        resolve(objects);
      });
    });
  }

  async getObject(
    credentials: CredentialsDto,
    bucketName: string,
    objectKey: string,
  ): Promise<AwsObjectDto> {
    this.configureCredentials(credentials);

    return await new Promise((resolve, reject) => {
      this.storage.getObject(
        { Bucket: bucketName, Key: objectKey },
        (err, data) => {
          if (err) {
            reject(err.message);
          }

          const bytes = data.Body as Buffer;
          const parsedJson = bytes.toString('utf8');

          resolve({
            name: objectKey,
            size: data.ContentLength,
            type: data.ContentType,
            data: parsedJson,
            lastModified: data.LastModified.toUTCString(),
          });
        },
      );
    });
  }
}
