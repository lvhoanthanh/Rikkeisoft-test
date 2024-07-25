import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from "typeorm";
import { compare } from 'bcrypt';

const _ = require('lodash');
import { CommonHelper } from '../../helpers/common';

import { UserEntity } from '../../models/user.entity';
import { UserDataEntity } from '../../models/user-data.entity';
import { RoleEntity } from '../../models/role.entity';
import { RoleService } from '../role/role.service';

import { ModuleRef } from '@nestjs/core';
import { TransactionFor } from 'nest-transact';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { GeneralStatus } from "../../helpers/enums";
import { CreateUserDto } from "./user.validation";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends TransactionFor<UserService> {
  private readonly roleService: RoleService;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserDataEntity)
    private readonly userDataRepository: Repository<UserDataEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    moduleRef: ModuleRef,
    roleService: RoleService,
  ) {
    super(moduleRef);
    this.roleService = roleService;
  }


  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, email, password, role, userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleEntity = await this.roleService.findById(role);
    const user = new UserEntity();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.role = roleEntity;

    if (userData) {
      const userDataEntity = new UserDataEntity();
      userDataEntity.firstName = userData.firstName;
      userDataEntity.lastName = userData.lastName;
      userDataEntity.address = userData.address;
      user.userData = userDataEntity;
    }

    return this.userRepository.save(user);
  }

  public async fetchUser(
    paginationOptions: IPaginationOptions,
    payload: any,
  ): Promise<Pagination<UserEntity>> {
    const { keyword, roleCode, status,
      sortBy, orderBy } = payload;
    const userQuery = this.userRepository.createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('users.userData', 'userData')

    if (keyword) {
      userQuery.andWhere(
        new Brackets((subQuery) => {
          subQuery.orWhere(
            `TRIM(CONCAT(userData.firstName, ' ', userData.lastName)) ILIKE :q`,
            {
              q: `%${keyword}%`,
            },
          );
          subQuery.orWhere(
            `TRIM(CONCAT(userData.lastName, ' ', userData.firstName)) ILIKE :q`,
            {
              q: `%${keyword}%`,
            },
          );
          subQuery.orWhere(
            "users.email ILIKE :keyword", {
            keyword: `%${keyword}%`,
          }
          );
        }),
      );
    }

    if (roleCode) {
      const getRoleEntity = await this.roleService.getRoleFromRoleCode(roleCode);
      if (!getRoleEntity) return null;
      userQuery.andWhere(`users.role = :role`, { role: getRoleEntity.id });
    }
    if (status) userQuery.andWhere(`users.status = :status`, { status })
    else userQuery.andWhere(`users.status != :status`, { status: GeneralStatus.TERMINATED })
    userQuery.orderBy(`users.createdAt`, 'DESC');
    if (sortBy) userQuery.orderBy(`users.${sortBy}`, orderBy || 'ASC');

    return await CommonHelper.pagination(paginationOptions, userQuery);
  }

  // public async findById(id: string): Promise<UserEntity | null> {
  //   const userQuery = this.userRepository.createQueryBuilder("users")
  //     .leftJoinAndSelect('users.role', 'role')
  //     .leftJoinAndSelect('role.permissions', 'permissions')
  //     .leftJoinAndSelect('users.userData', 'userData')
  //     .andWhere("users.id = :id", { id })
  //     .getOne()
  //   return userQuery;
  // }
  public async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
  }

  public async findByIdWithStatusActive(id: string): Promise<UserEntity | null> {
    const userQuery = this.userRepository.createQueryBuilder("users")
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('users.userData', 'userData')
      .andWhere("users.id = :id", { id })
      .andWhere("users.status = :status", { status: GeneralStatus.ACTIVE })
      .getOne()
    return userQuery;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const userQuery = this.userRepository.createQueryBuilder("users")
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('users.userData', 'userData')
      .andWhere("users.email = :email", { email })
      .andWhere(`users.status != :status`, { status: GeneralStatus.TERMINATED })
      .getOne()
    return userQuery;
  }

  public async findByUsername(username: string): Promise<UserEntity | null> {
    const userQuery = this.userRepository.createQueryBuilder("users")
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('users.userData', 'userData')
      .andWhere("users.username = :username", { username })
      .andWhere(`users.status != :status`, { status: GeneralStatus.TERMINATED })
      .getOne()
    return userQuery;
  }

  public async findByEmailForAuthentication(email: string): Promise<UserEntity | null> {
    const userQuery = this.userRepository.createQueryBuilder("users")
      .andWhere("users.email = :email", { email })
      .select(['users.id', 'users.email', 'users.password', 'users.username', 'users.status', 'users.createdAt', 'users.updatedAt'])
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('users.userData', 'userData')
      .getOne();
    return userQuery;
  }

  public async findByUsernameForAuthentication(username: string): Promise<UserEntity | null> {
    const userQuery = this.userRepository.createQueryBuilder("users")
      .andWhere("users.username = :username", { username })
      .select(['users.id', 'users.email', 'users.password', 'users.username', 'users.status', 'users.createdAt', 'users.updatedAt'])
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('users.userData', 'userData')
      .getOne()
    return userQuery;
  }

  public async validateCredentials(
    user: UserEntity,
    password: string,
  ): Promise<boolean> {
    return compare(password, user.password);
  }

  public async updateStatus(userEntity: UserEntity, status: string) {

    const dataUpdate = {
      ...userEntity,
      status
    }
    const result = await this.userRepository.save(dataUpdate)

    return await this.findById(result.id)
  }
}
