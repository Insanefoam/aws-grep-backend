import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AwsCredentialsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const requiredHeaders = ['awsaccess', 'awssecret', 'awsregion'];

    const headers = Object.keys(req.headers).map((e) => e.toLowerCase());

    const missedHeaders = requiredHeaders.filter((e) => !headers.includes(e));
    if (missedHeaders.length === 0) {
      return true;
    }

    throw new UnauthorizedException(
      'You miss some headers...',
      `Missed headers: [${missedHeaders.join(', ')}]`,
    );
  }
}
