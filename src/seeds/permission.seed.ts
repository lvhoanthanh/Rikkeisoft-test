import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { PermissionEntity } from '../models/permission.entity';

export default class CreatePermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(PermissionEntity)
      .values([
        { name: 'read_category', description: 'Read category' },
        { name: 'add_category', description: 'Add category' },
        { name: 'edit_category', description: 'Edit category' },
        { name: 'delete_category', description: 'Delete category' },
        { name: 'read_product', description: 'Read product' },
        { name: 'add_product', description: 'Add product' },
        { name: 'edit_product', description: 'Edit product' },
        { name: 'delete_product', description: 'Delete product' },
      ])
      .execute();
  }
}