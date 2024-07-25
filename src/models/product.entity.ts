import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';
import { FileEntity } from './file.entity';
import { GeneralStatus } from "../helpers/enums";

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({
    type: 'enum',
    enum: GeneralStatus,
    default: GeneralStatus.ACTIVE,
  })
  status: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;

  @OneToOne(() => FileEntity, (image) => image.product)
  image: FileEntity;
}