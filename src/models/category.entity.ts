import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';
import { GeneralStatus } from "../helpers/enums";

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
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

  @OneToMany(() => ProductEntity, (product) => product.category, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  products: ProductEntity[];
}