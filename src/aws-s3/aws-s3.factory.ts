import * as S3 from 'aws-sdk/clients/s3';
import {
  AWS_ACCESS_KEY,
  AWS_REGION_NAME,
  AWS_SECRET_ACCESS_KEY,
} from '@constants';
import { Provider } from '@nestjs/common';

const s3Factory: Provider = {
  provide: 'S3_STORAGE',
  useFactory: () => {
    return new S3({
      signatureVersion: 'v4',
      // region: AWS_REGION_NAME,
      // credentials: {
      //   accessKeyId: AWS_ACCESS_KEY,
      //   secretAccessKey: AWS_SECRET_ACCESS_KEY,
      // },
    });
  },
};

export default s3Factory;
