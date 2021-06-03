import { Inject, Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { AwsCredentialsDto, AwsObjectDto } from './aws-s3.dto';

@Injectable()
export class AwsS3Service {
  constructor(@Inject('S3_STORAGE') private readonly storage: S3) {}

  configureCredentials({ region, credentials }: AwsCredentialsDto) {
    this.storage.config.region = region;
    this.storage.config.credentials = credentials;
  }

  async validateBucket(
    credentials: AwsCredentialsDto,
    bucketName: string,
  ): Promise<boolean> {
    this.configureCredentials(credentials);

    const allBuckets = await this.getAllBuckets(credentials);

    return allBuckets.includes(bucketName);
  }

  async getAllBuckets(credentials: AwsCredentialsDto): Promise<string[]> {
    this.configureCredentials(credentials);

    return await new Promise<string[]>((resolve) => {
      this.storage.listBuckets((err, data) => {
        const buckets = data.Buckets;
        const bucketsNames = buckets.map((el) => el.Name);
        resolve(bucketsNames);
      });
    });
  }

  async validateCredentials(credentials: AwsCredentialsDto) {
    this.configureCredentials(credentials);

    const isValid = await new Promise<boolean>((resolve, reject) => {
      this.storage.listBuckets((err, data) => {
        if (data) {
          resolve(true);
        }

        resolve(false);
      });
    });

    return isValid;
  }

  async getAllBucketObjects(
    credentials: AwsCredentialsDto,
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
    credentials: AwsCredentialsDto,
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
          const parsedJson = JSON.stringify(bytes.toString('utf8'), null, 0);

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
