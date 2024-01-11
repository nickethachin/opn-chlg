import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  register(registerDto: RegisterDto): User {
    const registeringUser = {
      ...registerDto,
      role: 'user',
    };
    const registeredUser: User = this.usersService.create(registeringUser);
    return registeredUser;
  }

  signIn(email: string, pass: string) {
    const user = this.usersService.findOneByEmail(email);
    this.checkIfCorrectPassword(user._id, pass);
    const token = `faketoken_user${user._id}`;
    return { access_token: token };
  }

  changePassword(_id: number, oldPass: string, newPass: string) {
    this.checkIfCorrectPassword(_id, oldPass);
    const user = this.usersService.findOne(_id);
    user.password = newPass;
    return this.usersService.update(_id, user);
  }

  updateProfile(_id: number, updateProfileDto: UpdateProfileDto) {
    const user = this.usersService.findOne(_id);
    const updatedUser = {
      ...user,
      ...updateProfileDto,
    };
    const result = this.usersService.update(_id, updatedUser);
    delete result._id;
    delete result.password;
    return result;
  }

  /* ---------------------------- PRIVATE FUNCTIONS --------------------------- */
  private checkIfCorrectPassword(_id: number, pass: string): void {
    // Normally I'll use crypto to compare the password
    const user = this.usersService.findOne(_id);
    if (user?.password !== pass) {
      console.error(`${user?.password} !== ${pass}`);
      throw new UnauthorizedException('Wrong password');
    }
  }
}
