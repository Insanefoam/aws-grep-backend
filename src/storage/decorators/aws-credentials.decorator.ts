import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CredentialsDto } from 'aws-s3/aws-s3.dto';

export const AwsCredentials = createParamDecorator(
  (data, ctx: ExecutionContext): CredentialsDto => {
    const req = ctx.switchToHttp().getRequest();
    const { awssecret, awsaccess, awsregion } = req.headers;

    return {
      region: awsregion,
      credentials: { accessKeyId: awsaccess, secretAccessKey: awssecret },
    };
  },
);
