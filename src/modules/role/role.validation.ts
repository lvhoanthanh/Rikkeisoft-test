import { IsNotEmpty } from 'class-validator';

export class RoleCreateValidation {
  @IsNotEmpty({ message: 'Role name is required' })
  readonly name: string;
}
