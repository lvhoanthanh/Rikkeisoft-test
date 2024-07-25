import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req
} from "@nestjs/common";
import { Connection } from "typeorm";

const _ = require('lodash');

import { UserService } from "./user.service";
import { FileService } from "../file/file.service";
import { RoleService } from "../role/role.service";
import { AuthenticationController } from "../authentication/authentication.controller";
import { CommonHelper } from "../../helpers/common";
import { GeneralStatus } from "../../helpers/enums";
import { CreateUserDto } from "./user.validation";

@Controller('/api/users')
export class UserController {
  public constructor(
    readonly userService: UserService,
    readonly fileService: FileService,
    readonly roleService: RoleService,
    readonly authenticationController: AuthenticationController,
    private connection: Connection,
  ) {}

  @Post('/create')
  public async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const userEntity = await this.userService.createUser(createUserDto);
      return CommonHelper.successResponsePayload(
        'User created successfully',
        userEntity
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('')
  async fetchUsers(@Query() query) {
    try {
      const convertDataForPagination = await CommonHelper.convertDataForPagination(query);
      const userEntities = await this.userService.fetchUser(
        convertDataForPagination.pagination,
        convertDataForPagination.searchQuery
      );

      return CommonHelper.successResponsePayload(
        'Fetch users successfully',
        userEntities
      )
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/get-by-id/:id')
  public async getUserById(@Param() params) {
    try {
      const userEntity = await this.userService.findById(params.id);
      return CommonHelper.successResponsePayload(
        'Get user successfully',
        userEntity
      )
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/get-for-self')
  public async getUserForSelf(@Req() req) {
    try {
      const userEntity = await this.authenticationController.getCurrentUserWithToken(req);
      return CommonHelper.successResponsePayload(
        'Get user successfully',
        userEntity
      )
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put('/deactivate/:id')
  public async deactivate(@Param() params, @Req() req) {
    try {
      const userEntity = await this.userService.findById(params.id)
      if (!userEntity) return CommonHelper.failResponsePayload('Account does not exist');
      if (userEntity.status == GeneralStatus.INACTIVE) return CommonHelper.failResponsePayload('User has status as inactive');
      if (userEntity.status == GeneralStatus.TERMINATED) return CommonHelper.failResponsePayload('User has status as terminate');

     await this.userService.updateStatus(userEntity, GeneralStatus.INACTIVE)

      return CommonHelper.successResponsePayload(
        'Deactivate user successfully'
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put('/activate/:id')
  public async activate(@Param() params, @Req() req) {
    try {
      const userEntity = await this.userService.findById(params.id)
      if (!userEntity) return CommonHelper.failResponsePayload('Account does not exist');
      if (userEntity.status == GeneralStatus.ACTIVE) return CommonHelper.failResponsePayload('User has status as active');
      if (userEntity.status == GeneralStatus.TERMINATED) return CommonHelper.failResponsePayload('User has status as terminate');

      await this.userService.updateStatus(userEntity, GeneralStatus.ACTIVE)

      return CommonHelper.successResponsePayload(
        'Activate user successfully'
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put('/delete/:id')
  public async delete(@Param() params, @Req() req) {
    return await this.connection.transaction(
      async (transactionalUserService) => {
        try {
          const userEntity = await this.userService.findById(params.id)
          if (!userEntity) return CommonHelper.failResponsePayload('Account does not exist');
          if (userEntity.status == GeneralStatus.TERMINATED) return CommonHelper.failResponsePayload('User has status as terminated');

          await this.userService
            .withTransaction(transactionalUserService)
            .updateStatus(userEntity, GeneralStatus.TERMINATED)

          return CommonHelper.successResponsePayload(
            'Terminated user successfully'
          );
        } catch (error) {
          throw new Error(error);
        }
      }
    )
  }
}
