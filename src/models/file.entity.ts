import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  nameOriginal: string;

  @Column({ type: 'varchar', length: 150 })
  nameConvert: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar', nullable: true })
  extension: string;

  @Column({ type: 'varchar', nullable: true })
  size: boolean;

  @OneToOne(() => ProductEntity, (product) => product.image, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}