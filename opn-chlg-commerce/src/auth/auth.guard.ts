import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    // Normally I'll validate the JWT here
    if (!this.isValidToken(token)) {
      throw new UnauthorizedException();
    }
    const _id = +token.replace('faketoken_user', '');
    const user = this.usersService.findOne(_id);
    const payload = {
      sub: user._id,
      email: user.email,
    };
    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isValidToken(token: string): boolean {
    const isValidStart = token.startsWith('faketoken_user');
    const isEndWithNumber = !isNaN(+token.replace('faketoken_user', ''));
    const isValid = isValidStart && isEndWithNumber;
    return isValid;
  }
}
