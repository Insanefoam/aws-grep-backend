import * as S3 from 'aws-sdk/clients/s3';
import { Provider } from '@nestjs/common';

const s3Factory: Provider = {
  provide: 'S3_STORAGE',
  useFactory: () => {
    return new S3({
      signatureVersion: 'v4',
    });
  },
};

export default s3Factory;
