import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PermissionEntity } from './permission.entity';
import { GeneralStatus } from "../helpers/enums";

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true })
  roleCode: string;

  @Column({
    type: 'enum',
    enum: GeneralStatus,
    default: GeneralStatus.ACTIVE,
  })
  status: string;

  @OneToMany(() => UserEntity, (user) => user.role, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public user: UserEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  permissions: PermissionEntity[];
}