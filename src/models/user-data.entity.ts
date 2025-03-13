import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  AfterLoad,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'userData' })
export class UserDataEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @OneToOne(() => UserEntity, (user) => user.userData, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  fullName: string;
  @AfterLoad()
  addRootPath() {
    this.fullName =
      (this.firstName ? this.firstName : '') +
      (this.lastName ? ' ' + this.lastName : '');
  }
}
