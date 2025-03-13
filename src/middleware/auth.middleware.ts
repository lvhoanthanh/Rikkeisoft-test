import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Constants } from '../helpers/constants';
import { UserService } from '../modules/user/user.service';
const _ = require('lodash');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async skipPermittedRoutes(req: Request) {
    const permitted = [
      // Todo: add api permitted
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
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      try {
        const decoded: any = jwt.verify(token, Constants.SECRET);
        const user = await this.userService.findByIdWithStatusActive(
          decoded.sub,
        );
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }
        return next();
      } catch {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException(
        'Token not provided or expired.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
