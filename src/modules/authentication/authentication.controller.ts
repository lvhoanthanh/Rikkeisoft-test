import { Body, Controller, Post, Req } from '@nestjs/common';

import {
  AuthLoginValidation,
  AuthRefreshValidation,
} from './authentication.validation';
const _ = require('lodash');
import { TokensService } from './tokens.service';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { Constants } from '../../helpers/constants';

import * as jwt from 'jsonwebtoken';
import { CommonHelper } from '../../helpers/common';
import { GeneralStatus } from '../../helpers/enums';

@Controller('/api/auth')
export class AuthenticationController {
  public constructor(
    readonly userService: UserService,
    readonly tokens: TokensService,
    readonly fileService: FileService,
  ) { }

  @Post('/login')
  public async login(@Body() body: AuthLoginValidation) {
    const { account, password, remember } = body;

    let user = await this.userService.findByEmailForAuthentication(account);
    if (!user) {
      user = await this.userService.findByUsernameForAuthentication(account);
      if (!user)
        return CommonHelper.failResponsePayload('This account is not exist');
    }

    const valid = user
      ? await this.userService.validateCredentials(user, password)
      : false;
    if (!valid) return CommonHelper.failResponsePayload('Incorrect password');

    if (user.status !== GeneralStatus.ACTIVE)
      return CommonHelper.failResponsePayload('This account not activated');

    let expiresIn = 60 * 60 * 24;
    if (remember == true) expiresIn = 60 * 60 * 24 * 30;
    const token = await this.tokens.generateAccessToken(user, expiresIn);
    const refresh = await this.tokens.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const resultUser = _.omit(user, ['password']);
    return CommonHelper.successResponsePayload('Login successfully', {
      user: resultUser,
      accessToken: {
        type: 'bearer',
        token: token,
        ...(refresh ? { refreshToken: refresh } : {}),
      },
    });
  }

  @Post('logout')
  async logout(@Req() req) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      return CommonHelper.failResponsePayload(
        'No token provided'
      );
    }

    const currentUser = await this.getCurrentUserWithToken(req);
    if (!currentUser)
      return CommonHelper.failResponsePayload(
        'User not found'
      );

    const token = authHeaders.split(' ')[1];

    const decoded: any = await this.tokens.decodeRefreshToken(token);
    await this.tokens.revokeRefreshToken(decoded.jti);
    
    return CommonHelper.successResponsePayload(
      'Logout successful',
    );
  }

  @Post('/refresh')
  public async refresh(@Body() body: AuthRefreshValidation) {
    const { user, token } = await this.tokens.createAccessTokenFromRefreshToken(
      body.refreshToken,
    );

    return CommonHelper.successResponsePayload('Refresh successfully', {
      user,
      accessToken: {
        type: 'bearer',
        token: token,
      },
    });
  }

  public async getCurrentUserWithToken(@Req() req) {
    try {
      let result = null;
      const authHeaders = req.headers.authorization;
      if (authHeaders && (authHeaders as string).split(' ')[1]) {
        const token = (authHeaders as string).split(' ')[1];
        const decoded: any = jwt.verify(token, Constants.SECRET);
        result = await this.userService.findById(decoded.sub);
      }
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
