/* -------------------------------------------------------------------------- */
/*                             LIBRARIES & MODULES                            */
/* -------------------------------------------------------------------------- */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { AuthAdminGuard } from 'src/auth/auth.admin.guard';
/* -------------------------------------------------------------------------- */

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard, AuthAdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Req() request: Request) {
    return this.usersService.getUserProfile(request['user'].sub);
  }

  @Get()
  @UseGuards(AuthGuard, AuthAdminGuard)
  findAll() {
    // Normally I'll optionally add a query parameter to filter the users and select fields to return
    // But this isn't connected to a database so I'll just return all users with all fields
    return this.usersService.findAll();
  }

  @Get(':_id')
  @UseGuards(AuthGuard, AuthAdminGuard)
  findOne(@Param('_id') _id: number) {
    // Normally I'll optionally add a query parameter to select fields to return
    // But this isn't connected to a database so I'll just return user with all fields
    return this.usersService.findOne(+_id);
  }

  @Patch(':_id')
  @UseGuards(AuthGuard, AuthAdminGuard)
  update(@Param('_id') _id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+_id, updateUserDto);
  }

  @Delete(':_id')
  @UseGuards(AuthGuard, AuthAdminGuard)
  remove(@Param('_id') _id: number) {
    // Normally I'll split this into two methods: actually remove the user and just inactive user
    // remove user if user requested by PDPA
    // inactive user if admin want to just inactive the user but keep the data
    return this.usersService.remove(+_id);
  }
}
