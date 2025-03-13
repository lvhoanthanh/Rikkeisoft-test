import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { ProductEntity } from '../models/product.entity';
import { CategoryEntity } from '../models/category.entity';

export default class CreateProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const categories = await connection.getRepository(CategoryEntity).find();

    await connection
      .createQueryBuilder()
      .insert()
      .into(ProductEntity)
      .values([
        { name: 'Smartphone', description: 'A smart phone', price: 699, category: categories[0] },
        { name: 'Laptop', description: 'A portable computer', price: 999, category: categories[0] },
        { name: 'NCY', description: 'NCY T-shirt', price: 19, category: categories[1] },
        { name: 'Coffee', description: 'Coffee T-shirt', price: 19, category: categories[1] },
        { name: 'Advanture', description: 'Peter Pan', price: 19, category: categories[2] },
        { name: 'Sherlock Home', description: 'A novel about Sherlock Home', price: 19, category: categories[2] },
      ])
      .execute();
  }
}