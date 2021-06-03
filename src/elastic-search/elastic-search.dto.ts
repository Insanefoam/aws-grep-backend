import { ApiProperty } from '@nestjs/swagger';

export class ElasticDocument {
  @ApiProperty()
  bucketName: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;
}

export class SearchItemDto {
  @ApiProperty()
  bucket: string;

  @ApiProperty()
  object: string;

  @ApiProperty()
  highlight: string;
}
