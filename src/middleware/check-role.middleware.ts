import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Constants } from '../helpers/constants';
import { UserService } from '../modules/user/user.service';
import {Role} from "../helpers/enums";
const _ = require('lodash');

@Injectable()
export class CheckRoleMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async denyRoutesForAdmin(req: Request) {
    const denyApi = [
    ]
    const routeRequest = `${_.get(_.keys(req.route.methods), 0)} - ${
      req.route.path
    }`;
    return denyApi.includes(routeRequest);
  }

  async skipPermittedRoutesForUser(req: Request) {
    const acceptApi = [
    ];
    const routeRequest = `${_.get(_.keys(req.route.methods), 0)} - ${
      req.route.path
    }`;
    return acceptApi.includes(routeRequest);
  }

  async skipPermittedRoutes(req: Request) {
    const permitted = [
      // TODO: add api permitted
    ];
    const routeRequest = `${_.get(_.keys(req.route.methods), 0)} - ${
      req.route.path
    }`;
    return permitted.includes(routeRequest);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const skipRoutes = await this.skipPermittedRoutes(req);
    if (skipRoutes) return next();
    const authHeaders = req.headers.authorization;
    const token = (authHeaders as string).split(' ')[1];
    const decoded: any = jwt.verify(token, Constants.SECRET);
    const user = await this.userService.findById(decoded.sub);
    const userRole = _.get(user, 'role.roleCode');
    if (userRole == Role.ADMIN) {
      const checkRole = await this.denyRoutesForAdmin(req);
      if (checkRole)
        throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);
      return next();
    }
    if (userRole == Role.USER) {
      const checkRole = await this.skipPermittedRoutesForUser(req);
      if (checkRole) return next();
    }
    throw new HttpException('Permission denied', HttpStatus.UNAUTHORIZED);
  }
}
