import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
  IsString,
  IsObject, IsEnum, IsOptional, IsUUID
} from "class-validator";
import { Match } from './match.decorator';
import { Type } from 'class-transformer';
import { Constants } from "../../helpers/constants";

export class AuthLoginValidation {
  @IsNotEmpty({ message: 'A account is required' })
  readonly account: string;

  @IsNotEmpty({ message: 'A password is required to login' })
  @MinLength(6, { message: 'Your password must be at least 6 characters' })
  readonly password: string;

  @IsOptional()
  readonly remember: boolean;
}

export class AuthRefreshValidation {
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refreshToken: string;
}

export class AuthForgotPasswordValidation {
  @IsNotEmpty({ message: 'An email is required' })
  @IsEmail()
  readonly email: string;
}

export class AuthResetPasswordValidation {
  @IsNotEmpty({ message: 'An email is required' })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'A code is required' })
  readonly code: string;

  @IsNotEmpty({ message: 'A new password is required' })
  @MinLength(6, { message: 'Your password must be at least 6 characters' })
  newPassword: string;

  @IsNotEmpty({ message: 'A confirmation new password is required' })
  @Match(AuthResetPasswordValidation, (s) => s.newPassword)
  readonly confirmationNewPassword: string;
}

export class AuthVerifyAccountValidation {
  @IsNotEmpty({ message: 'An email is required' })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'A code is required' })
  readonly code: string;
}
