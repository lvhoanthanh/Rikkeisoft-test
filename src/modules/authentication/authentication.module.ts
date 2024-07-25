import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { RefreshToken } from '../../models/refresh-token.entity';

import { TokensService } from './tokens.service';
import { RefreshTokensRepository } from './refresh-tokens.repository';

import { AuthenticationController } from './authentication.controller';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from './strategies/jwt.strategy';

import { Constants } from '../../helpers/constants';
import { FileModule } from "../file/file.module";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({
      secret: Constants.SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    UserModule,
    RoleModule,
    FileModule
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationController,
    TokensService,
    RefreshTokensRepository,
    JwtStrategy,
  ],
  exports: [AuthenticationController],
})
export class AuthenticationModule {}
