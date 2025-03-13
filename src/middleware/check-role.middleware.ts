import { HttpException, Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Constants } from '../helpers/constants';
import { UserService } from '../modules/user/user.service';
// import { RoleEntity } from '../models/role.entity';
import * as _ from 'lodash';

@Injectable()
export class CheckRoleMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      throw new HttpException('Authorization header missing', HttpStatus.UNAUTHORIZED);
    }

    const token = (authHeaders as string).split(' ')[1];
    if (!token) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, Constants.SECRET);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findById(decoded.sub);
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const routeRequest = `${_.get(_.keys(req.route.methods), 0)} - ${req.route.path}`;

    const permissions = user.role.permissions.map(permission => permission.name);

    if (!permissions.includes(routeRequest)) {
      throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);
    }

    return next();
  }
}