import { Constants } from '../helpers/constants';
import { GeneralStatus, Role } from '../helpers/enums';

export default [
  {
    email: 'admin@gmail.com',
    username: 'super admin',
    status: GeneralStatus.ACTIVE,
    password: Constants.ROOT_PASSWORD,
    role: {
      name: 'Admin',
      description: 'Role for Admin',
      roleCode: Role.ADMIN,
    },
    userData: {
      firstName: 'Super',
      lastName: 'Admin',
    },
  },
  {
    email: 'user@gmail.com',
    username: 'user',
    status: GeneralStatus.ACTIVE,
    password: Constants.ROOT_PASSWORD,
    role: {
      name: 'User',
      description: 'Role for user',
      roleCode: Role.USER,
    },
    userData: {
      firstName: 'user',
      lastName: 'Test',
    },
  },
];
