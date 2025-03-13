import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { FileEntity } from '../models/file.entity';
import { ProductEntity } from '../models/product.entity';
import { Constants } from '../helpers/constants';

export default class CreateFiles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Fetch all products from the database
    const products = await connection.getRepository(ProductEntity).find();
    
    if (products.length === 0) {
      throw new Error('No products found in the database. Please create products first.');
    }

    // Create file entries with references to existing products
    await connection
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values([
        {
          nameOriginal: 'phone.jpg',
          nameConvert: 'phone.jpg',
          path: 'uploads/phone.jpg',
          extension: 'jpg',
          size: true,
          product: products[0],
        },
        {
          nameOriginal: 'laptop.jpg',
          nameConvert: 'laptop.jpg',
          path: 'uploads/laptop.jpg',
          extension: 'jpg',
          size: true,
          product: products[1],
        },
        {
          nameOriginal: 'NYC-Tshirt.jpg',
          nameConvert: 'NYC-Tshirt.jpg',
          path: 'uploads/NYC-Tshirt.jpg',
          extension: 'jpg',
          size: true,
          product: products[2],
        },
        {
          nameOriginal: 'coffee-Tshirt.jpg',
          nameConvert: 'coffee-Tshirt.jpg',
          path: 'uploads/coffee-Tshirt.jpg',
          extension: 'jpg',
          size: true,
          product: products[3],
        },
        {
          nameOriginal: 'Advanture.jpg',
          nameConvert: 'advanture.jpg',
          path: 'uploads/advanture.jpg',
          extension: 'jpg',
          size: true,
          product: products[4],
        },
        {
          nameOriginal: 'sherlock-home.jpg',
          nameConvert: 'sherlock-home.jpg',
          path: 'uploads/sherlock-home.jpg',
          extension: 'jpg',
          size: true,
          product: products[5],
        },
      ])
      .execute();
  }
}