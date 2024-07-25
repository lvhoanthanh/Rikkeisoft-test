import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

class UserDataDto {
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  readonly userData?: UserDataDto;
}