import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { BaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import { hash } from 'bcrypt';
import { UserDataEntity } from './user-data.entity';
import { GeneralStatus } from '../helpers/enums';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: GeneralStatus,
    default: GeneralStatus.ACTIVE,
  })
  status: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @OneToOne(() => UserDataEntity, (userData) => userData.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public userData: UserDataEntity;

  @BeforeInsert()
  async generatePasswordHash(): Promise<void> {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }
}
