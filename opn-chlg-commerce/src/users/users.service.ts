import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private userModel: UserModel = new UserModel();
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    // Check if email already exists
    // Normally database unique key should do this for us but this isn't connected to a database
    if (this.isDuplicateEmail(createUserDto.email)) {
      throw new Error('This email already exists');
    }
    // Normally I'll also check if password is encrypted from Frontend
    return this.userModel.create(createUserDto);
  }

  findAll(): User[] {
    // Again, normally I'll add a query parameter to filter the users and select fields to return
    return this.userModel.findAll();
  }

  findOne(_id: number): User {
    // Again, normally I'll add a query parameter to select fields to return
    const user = this.userModel.findOne(_id);
    if (!user) {
      console.error('User not found', _id);
      throw new BadRequestException('User not found');
    }
    return user;
  }

  findOneByEmail(email: string): User {
    // Again, normally I'll add a query parameter to select fields to return

    // Normally I'll use a database query to find the user by email
    // But this isn't connected to a database so I'll just loop through the users array
    const users = this.userModel.findAll();
    const user = users.find((user) => user.email === email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  getUserProfile(_id: number) {
    try {
      const user = this.userModel.findOne(_id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const userAge = this.calculateAge(user.birthdate);
      const userProfile = {
        email: user.email,
        name: user.name,
        age: userAge,
        gender: user.gender,
        is_subscribed: user.is_subscribe,
      };
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  update(_id: number, updateUserDto: UpdateUserDto): User {
    const updatedUser = this.userModel.update(_id, updateUserDto);
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }
    return updatedUser;
  }

  remove(_id: number): string {
    const deletedUser = this.userModel.findOne(_id);
    if (!deletedUser) {
      throw new BadRequestException('User not found');
    }
    return `User ${deletedUser._id} : ${deletedUser.name} has been deleted`;
  }

  /* ---------------------------- PRIVATE FUNCTIONS --------------------------- */

  private isDuplicateEmail(email: string): boolean {
    return this.users.some((user) => user.email === email);
  }

  private calculateAge(birthdate) {
    const ageDifMs = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

/* -------------------------------------------------------------------------- */
/*                             MOCK USER DATABASE                             */
/* -------------------------------------------------------------------------- */

class UserModel {
  users: User[] = [];
  constructor() {
    this.users = [
      {
        _id: 0,
        name: 'MrAdmin',
        email: 'admin@example.com',
        password: 'admin',
        birthdate: new Date('1990-01-01'),
        gender: 'male',
        address: 'Highway to hell',
        is_subscribe: false,
        role: 'admin',
      },
    ];
  }

  findOne(_id: number): User | null {
    return this.users.find((user) => user._id === _id) || null;
  }

  findAll(): User[] {
    return this.users;
  }

  create(user: User): User {
    // Generate user id by incrementing the last id
    const _id =
      this.users.length > 0 ? this.users[this.users.length - 1]._id + 1 : 1;

    // Create new user object with id and rest of the data
    // I don't push the user directly to the array because I want to keep the
    // _id property to always be first in the object
    const newUser = {
      _id,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(_id: number, user: Partial<User>): User | null {
    const index = this.users.findIndex((user) => user._id === _id);
    if (index < 0) {
      return null;
    }
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index] || null;
  }

  remove(_id: number): User {
    const index = this.users.findIndex((user) => user._id === _id);
    if (index < 0) {
      return null;
    }
    const user = this.users[index];
    this.users.splice(index, 1);
    return user;
  }
}
