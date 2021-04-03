import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticDocumentDto } from './elastic-search.dto';

@Injectable()
export class ElasticSearchService {
  constructor(private readonly client: ElasticsearchService) {}

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
