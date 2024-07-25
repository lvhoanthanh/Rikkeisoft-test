import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RoleEntity } from '../models/role.entity';
import { PermissionEntity } from '../models/permission.entity';

export default class AssignPermissionsToRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const roleRepository = connection.getRepository(RoleEntity);
    const permissionRepository = connection.getRepository(PermissionEntity);

    const adminRole = await roleRepository.findOne({ where: { roleCode: 'ADMIN' } });
    const userRole = await roleRepository.findOne({ where: { roleCode: 'USER' } });

    const readCategory = await permissionRepository.findOne({ where: { name: 'read_category' } });
    const addCategory = await permissionRepository.findOne({ where: { name: 'add_category' } });
    const editCategory = await permissionRepository.findOne({ where: { name: 'edit_category' } });
    const deleteCategory = await permissionRepository.findOne({ where: { name: 'delete_category' } });

    const readProduct = await permissionRepository.findOne({ where: { name: 'read_product' } });
    const addProduct = await permissionRepository.findOne({ where: { name: 'add_product' } });
    const editProduct = await permissionRepository.findOne({ where: { name: 'edit_product' } });
    const deleteProduct = await permissionRepository.findOne({ where: { name: 'delete_product' } });

    if (adminRole) {
      adminRole.permissions = [
        readCategory, addCategory, editCategory, deleteCategory,
        readProduct, addProduct, editProduct, deleteProduct
      ];
      await roleRepository.save(adminRole);
    }

    if (userRole) {
      userRole.permissions = [readCategory, readProduct];
      await roleRepository.save(userRole);
    }
  }
}