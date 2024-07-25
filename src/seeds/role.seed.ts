import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { random } from 'faker';
import ROLE from '../initials/role.initial';
import { RoleEntity } from '../models/role.entity';

export default class CreateDefaultRole implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    const query = connection.getRepository(RoleEntity);

    for (const initial of ROLE) {
      const findRole = await query
        .createQueryBuilder('role')
        .where('role.roleCode = :roleCode', { roleCode: initial.roleCode })
        .getOne();

      const resolvePayload = {
        id: random.uuid(),
        ...initial,
      };

      if (findRole) resolvePayload.id = findRole.id;
      await query.save(resolvePayload);
    }
  }
}
