import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AwsCredentialsDto } from 'aws-s3/aws-s3.dto';
import { AwsS3Service } from 'aws-s3/aws-s3.service';
import { ElasticDocument, SearchItemDto } from './elastic-search.dto';

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

      await this.findOrCreateIndex(elasticIndex);

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

  async findOrCreateIndex(indexName: string) {
    try {
      const { body: index } = await this.client.indices.get({
        index: indexName,
      });

      return index;
    } catch (e) {
      console.log('error create find index:', e);
      try {
        const newIndex = await this.client.indices.create({
          index: indexName,
          body: {
            mappings: {
              properties: {
                bucketName: {
                  type: 'keyword',
                },
                title: {
                  type: 'keyword',
                },
                text: {
                  type: 'text',
                },
              },
            },
          },
        });
        return newIndex;
      } catch (e) {
        console.log('Error on create new index:', e, e.meta.body);
      }
    }
  }

  async addToIndex(
    index: string,
    document: ElasticDocument,
    forceIndex = false,
  ) {
    try {
      const isDocumentIndexed = await this.countByTitle(index, document.title);
      console.log(
        'index document :>> ',
        document,
        'is indexed:',
        isDocumentIndexed,
      );

      if (!isDocumentIndexed || forceIndex) {
        await this.client.index({
          index,
          body: document,
        });
      }
    } catch (e) {
      console.log(e.body.error);
    }
  }

  async countByTitle(index: string, title: string) {
    const response = await this.client.count({
      index,
      body: {
        query: {
          term: {
            title: {
              value: title,
            },
          },
        },
      },
    });

    return response.body.count;
  }

  async search(index: string, query: string): Promise<SearchItemDto[]> {
    const { body } = await this.client.search({
      index,
      body: {
        query: {
          fuzzy: {
            text: {
              value: query,
              fuzziness: 2,
              max_expansions: 50,
              prefix_length: 0,
              transpositions: true,
            },
          },
        },
        highlight: {
          type: 'unified',
          fragment_size: 50,
          number_of_fragments: 100,
          fields: {
            text: {},
          },
        },
      },
    });

    const hits = body.hits.hits;

    return hits.map((hit: any) => {
      const bucket = hit._source.bucketName;
      const object = hit._source.title;
      const highlight = hit.highlight.text[0];

      return { bucket, object, highlight };
    });
  }
}
