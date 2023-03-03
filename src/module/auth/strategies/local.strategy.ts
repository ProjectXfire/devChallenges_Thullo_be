import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
// Services
import { AuthService } from '@module/auth/services/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.validateUser(email, password);
      if (user) {
        return user;
      }
      throw new UnauthorizedException('Invalid user or password');
    } catch (error) {
      if (error.statusCode === 500) {
        throw new InternalServerErrorException(error.message);
      }
      throw new UnauthorizedException('Invalid user or password');
    }
  }
}
