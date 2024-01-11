/* -------------------------------------------------------------------------- */
/*                             LIBRARIES & MODULES                            */
/* -------------------------------------------------------------------------- */
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
/* -------------------------------------------------------------------------- */

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  birthdate: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  is_subscribe: boolean;

  @IsString()
  @IsOptional()
  role?: string = 'user';
}
