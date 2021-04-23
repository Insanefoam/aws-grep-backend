import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AwsCredentialsDto } from 'aws-s3/aws-s3.dto';
import { AwsS3Service } from 'aws-s3/aws-s3.service';
import { ElasticDocumentDto } from './elastic-search.dto';

@Injectable()
export class ElasticSearchService {
  constructor(
    private readonly client: ElasticsearchService,
    private readonly s3Service: AwsS3Service,
  ) {}

  async indexAllObjects(credentials: AwsCredentialsDto, bucketName: string) {
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

        this.addToIndex(elasticIndex, {
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

  async addToIndex(
    index: string,
    document: ElasticDocumentDto,
    forceIndex = false,
  ) {
    try {
      const isThisDocumentIndexed = await this.client
        .search({
          index,
          body: { query: { match: { title: document.title } } },
        })
        .then((res) => res.body.hits.total.value !== 0);

      if (!isThisDocumentIndexed || forceIndex) {
        await this.client.index({
          index,
          body: document,
        });
      }
    } catch (e) {
      console.log(e.body.error);
    }
  }

  async searchFromIndex(index: string, query: string) {
    try {
      const { body } = await this.client.search({
        index,
        body: {
          query: {
            multi_match: {
              query,
              fields: ['title', 'text'],
            },
          },
          highlight: {
            type: 'unified',
            number_of_fragments: 3,
            fields: {
              text: {},
            },
          },
        },
      });
      return body;
    } catch (e) {
      console.log(e.body.error);
    }

    return '';
  }
}
