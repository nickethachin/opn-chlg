/* -------------------------------------------------------------------------- */
/*                             LIBRARIES & MODULES                            */
/* -------------------------------------------------------------------------- */
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
/* -------------------------------------------------------------------------- */

export class UpdateProfileDto {
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
}
