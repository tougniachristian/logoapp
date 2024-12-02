import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexDocument(index: string, id: string, body: any) {
    return this.elasticsearchService.index({
      index,
      id,
      body,
    });
  }

  async search(index: string, query: any, from = 0, size = 10) {
    const { hits } = await this.elasticsearchService.search({
      index,
      body: { ...query, from, size },
    });
    return hits.hits.map((hit) => hit._source);
  }

  async deleteDocument(index: string, id: string) {
    return this.elasticsearchService.delete({ index, id });
  }
}
