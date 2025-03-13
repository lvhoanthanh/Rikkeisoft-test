import { Injectable } from "@nestjs/common";
const _ = require("lodash");
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "../../models/role.entity";
import { CommonHelper } from "../../helpers/common";
import { Constants } from "../../helpers/constants";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { UserEntity } from "../../models/user.entity";
import { Role } from "../../helpers/enums";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  public async fetchRole(
    user: UserEntity,
    paginationOptions: IPaginationOptions,
    params: any,
  ): Promise<Pagination<RoleEntity>> {
    const { keyword, roleCode, status, sortBy, orderBy } = params;

    const query = this.roleRepository.createQueryBuilder("role");

    // if (user.role.roleCode === Role.admin) {
    //   query.andWhere("role.roleCode <> :roleCode", {
    //     roleCode: Role.admin,
    //   });
    // }

    if (keyword)
      query.where("role.name ILIKE :keyword", { keyword: `%${keyword}%` });
    if (roleCode) query.andWhere("role.roleCode = :roleCode", { roleCode });
    if (status) query.andWhere("role.status = :status", { status });
    query.orderBy(`role.createdAt`, "DESC");
    if (sortBy) query.orderBy(`role.${sortBy}`, orderBy || "ASC");

    return await CommonHelper.pagination(paginationOptions, query);
  }

  public async findById(id: string): Promise<RoleEntity | null> {
    return await this.roleRepository.findOne(id);
  }

  public async getRoleFromRoleCode(roleCode: string) {
    return await this.roleRepository.findOne({
      where: { roleCode },
    });
  }

  public async checkName(nameRequest: string): Promise<boolean> {
    const roleEntity = await this.roleRepository.findOne({
      where: { name: nameRequest },
    });

    return !!roleEntity;
  }

  public async createRole(payload: any): Promise<RoleEntity | null> {
    const roleEntity = new RoleEntity();
    CommonHelper.mappingRequestDataToModel(roleEntity, payload);

    const result = await this.roleRepository.save(roleEntity);
    return await this.findById(result.id);
  }

  public async updateRole(
    roleEntity: RoleEntity,
    payload: any,
  ): Promise<RoleEntity | null> {
    const updateRole = {
      ...roleEntity,
      ...payload,
    };
    const result = await this.roleRepository.save(updateRole);
    return await this.findById(result.id);
  }

  public async updateStatus(roleEntity: RoleEntity, status: string) {
    const updateStatus = {
      ...roleEntity,
      status,
    };
    return await this.roleRepository.save(updateStatus);
  }
}
