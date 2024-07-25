import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import { GeneralStatus } from "../helpers/enums";

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: GeneralStatus,
    default: GeneralStatus.ACTIVE,
  })
  status: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'permission',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];
}