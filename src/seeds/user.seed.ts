import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import USERS from '../initials/user.initial';
import { UserEntity } from '../models/user.entity';
import { hash } from 'bcrypt';
import { UserDataEntity } from '../models/user-data.entity';
import { random } from 'faker';
import { RoleEntity } from '../models/role.entity';

export default class CreateDefaultUser implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    const userQuery = connection.getRepository(UserEntity);
    const userDataQuery = connection.getRepository(UserDataEntity);
    const roleDataQuery = connection.getRepository(RoleEntity);
    for (const initial of USERS) {
      const existingUser = await userQuery
      .createQueryBuilder('users')
      .orWhere('users.email = :email', { email: initial.email })
      .orWhere('users.username = :username', { username: initial.username })
      .getOne();
      if (existingUser) {
        continue;
      }
      if (existingUser) {
        continue;
      }

      const role = await roleDataQuery.findOne({
        where: { roleCode: initial.role.roleCode },
      });
      const password = await hash(initial.password, 10);

      const savedUserData = await userDataQuery.save({
        ...initial.userData,
      });

      const resolveData = {
        id: random.uuid(),
        ...initial,
        password,
        role,
        userData: savedUserData,
      };
      await userQuery.save(resolveData);
    }
  }
}
