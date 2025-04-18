import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from '../../models/role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleController],
  exports: [RoleService, RoleController],
})
export class RoleModule {}
