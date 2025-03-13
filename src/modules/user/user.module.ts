import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { RoleEntity } from '../../models/role.entity';
import { UserEntity } from '../../models/user.entity';
import { UserDataEntity } from '../../models/user-data.entity';

import { RoleModule } from '../role/role.module';
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([RoleEntity]),
    TypeOrmModule.forFeature([UserDataEntity]),
    RoleModule,
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
