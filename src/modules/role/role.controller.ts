import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { AuthenticationController } from "../authentication/authentication.controller";
import { RoleCreateValidation } from "./role.validation";
import { CommonHelper } from "../../helpers/common";
import { GeneralStatus, Role } from "../../helpers/enums";
import { Request } from "express";
const _ = require("lodash");

@Controller("/api/roles")
export class RoleController {
  public constructor(
    readonly roleService: RoleService,
    readonly authenticationController: AuthenticationController,
  ) {}

  @Get("")
  async fetchRoles(@Query() query, @Req() req: Request) {
    try {
      const currentUser =
        await this.authenticationController.getCurrentUserWithToken(req);
      const convertDataForPagination =
        await CommonHelper.convertDataForPagination(query);
      const roleEntities = await this.roleService.fetchRole(
        currentUser,
        convertDataForPagination.pagination,
        convertDataForPagination.searchQuery,
      );

      return CommonHelper.successResponsePayload(
        "Fetch roles successfully",
        roleEntities,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get("/get-by-id/:id")
  public async getRoleById(@Param() params) {
    const roleEntity = await this.roleService.findById(params.id);
    if (!roleEntity)
      return CommonHelper.failResponsePayload("Role does not exist");
    return CommonHelper.successResponsePayload(
      "Get role successfully",
      roleEntity,
    );
  }

  @Post("")
  public async createRole(@Body() body: RoleCreateValidation, @Req() req) {
    try {
      const checkName = await this.roleService.checkName(body.name);
      if (checkName)
        return CommonHelper.failResponsePayload(
          "Something wrong, cannot create role: name exist",
        );

      const newRoleEntity = await this.roleService.createRole(body);

      return CommonHelper.successResponsePayload(
        "Create role successfully",
        newRoleEntity,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put(":id")
  public async update(@Param() params, @Body() body, @Req() req) {
    try {
      const { id } = params;
      const roleEntity = await this.roleService.findById(id);
      if (!roleEntity)
        return CommonHelper.failResponsePayload("Role does not exist");

      const dataUpdate = _.omit(body, ["roleCode"]);
      const updateRole = await this.roleService.updateRole(
        roleEntity,
        dataUpdate,
      );

      return CommonHelper.successResponsePayload(
        "Update role successfully",
        updateRole,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put("/deactivate/:id")
  public async deactivate(@Param() params, @Req() req) {
    try {
      const roleEntity = await this.roleService.findById(params.id);
      if (!roleEntity)
        return CommonHelper.failResponsePayload("Role does not exist");
      await this.roleService.updateStatus(roleEntity, GeneralStatus.INACTIVE);

      return CommonHelper.successResponsePayload(
        "Deactivate role successfully",
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put("/activate/:id")
  public async activate(@Param() params, @Req() req) {
    try {
      const roleEntity = await this.roleService.findById(params.id);
      if (!roleEntity)
        return CommonHelper.failResponsePayload("Role does not exist");
      await this.roleService.updateStatus(roleEntity, GeneralStatus.ACTIVE);

      return CommonHelper.successResponsePayload("Activate role successfully");
    } catch (error) {
      throw new Error(error);
    }
  }
}
