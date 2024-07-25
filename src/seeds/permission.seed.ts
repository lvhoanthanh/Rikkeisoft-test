import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { PermissionEntity } from '../models/permission.entity';
import { RoleEntity } from '../models/role.entity';
import { GeneralStatus } from '../helpers/enums';

export default class CreateRolesAndPermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Create permissions
    const readCategoryPermission = new PermissionEntity();
    readCategoryPermission.name = 'get - /api/categories/';
    readCategoryPermission.description = 'Read categories';

    const createCategoryPermission = new PermissionEntity();
    createCategoryPermission.name = 'post - /api/categories/';
    createCategoryPermission.description = 'Create category';

    const updateCategoryPermission = new PermissionEntity();
    updateCategoryPermission.name = 'put - /api/categories/:id';
    updateCategoryPermission.description = 'Update category';

    const getCategoryByIdPermission = new PermissionEntity();
    getCategoryByIdPermission.name = 'get - /api/categories/:id';
    getCategoryByIdPermission.description = 'Get category by id';

    const deleteCategoryPermission = new PermissionEntity();
    deleteCategoryPermission.name = 'delete - /api/categories/:id';
    deleteCategoryPermission.description = 'Delete categories';

    const readProductPermission = new PermissionEntity();
    readProductPermission.name = 'get - /api/products/';
    readProductPermission.description = 'Read products';

    const createProductPermission = new PermissionEntity();
    createProductPermission.name = 'post - /api/products/';
    createProductPermission.description = 'Create product';

    const updateProductPermission = new PermissionEntity();
    updateProductPermission.name = 'put - /api/products/:id';
    updateProductPermission.description = 'Update product';

    const getProductByIdPermission = new PermissionEntity();
    getProductByIdPermission.name = 'get - /api/products/:id';
    getProductByIdPermission.description = 'Get product by id';

    const deleteProductPermission = new PermissionEntity();
    deleteProductPermission.name = 'delete - /api/products/:id';
    deleteProductPermission.description = 'Delete product';

    await connection.manager.save([
      readCategoryPermission,
      createCategoryPermission,
      updateCategoryPermission,
      deleteCategoryPermission,
      readProductPermission,
      createProductPermission,
      updateProductPermission,
      deleteProductPermission,
      getProductByIdPermission,
      getCategoryByIdPermission
    ]);

    // Create roles if they don't exist
    let adminRole = await connection.getRepository(RoleEntity).findOne({ where: { roleCode: 'admin' } });
    if (!adminRole) {
      adminRole = new RoleEntity();
      adminRole.name = 'Admin';
      adminRole.roleCode = 'admin';
      adminRole.status = GeneralStatus.ACTIVE;
      await connection.manager.save(adminRole);
    }

    let userRole = await connection.getRepository(RoleEntity).findOne({ where: { roleCode: 'user' } });
    if (!userRole) {
      userRole = new RoleEntity();
      userRole.name = 'User';
      userRole.roleCode = 'user';
      userRole.status = GeneralStatus.ACTIVE;
      await connection.manager.save(userRole);
    }

    // Assign permissions to roles
    adminRole.permissions = [
      readCategoryPermission,
      createCategoryPermission,
      updateCategoryPermission,
      deleteCategoryPermission,
      readProductPermission,
      createProductPermission,
      updateProductPermission,
      deleteProductPermission,
      getProductByIdPermission,
      getCategoryByIdPermission
    ];

    userRole.permissions = [
      readCategoryPermission,
      readProductPermission,
      getProductByIdPermission,
      getCategoryByIdPermission
    ];

    await connection.manager.save([adminRole, userRole]);
  }
}