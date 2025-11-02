import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const auth: string | undefined =
      request.headers['authorization'] ||
      (request.headers['Authorization'] as string | undefined);

    const token: string = process.env.ADMIN_TOKEN ?? 'admin123';

    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const provided: string = auth.substring('Bearer '.length);

    if (provided !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
