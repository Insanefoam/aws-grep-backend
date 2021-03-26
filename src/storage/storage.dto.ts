import { ApiProperty } from '@nestjs/swagger';

export class AwsObjectDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  data?: string;

  @ApiProperty({ required: false })
  lastModified?: string;
}
