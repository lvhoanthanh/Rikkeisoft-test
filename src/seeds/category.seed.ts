import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CategoryEntity } from '../models/category.entity';

export default class CreateCategories implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CategoryEntity)
      .values([
        { name: 'Electronics', description: 'Electronic' },
        { name: 'Books', description: 'Books' },
        { name: 'Clothing', description: 'Clothing' },
      ])
      .execute();
  }
}