import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';

import { UserEntity } from '../../models/user.entity';
import { RefreshToken } from '../../models/refresh-token.entity';

import { UserService } from '../user/user.service';
import { RefreshTokensRepository } from './refresh-tokens.repository';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience: 'https://my-app.com',
};

export interface RefreshTokenPayload {
  jti: number;
  sub: string;
}

@Injectable()
export class TokensService {
  private readonly tokens: RefreshTokensRepository;
  private readonly users: UserService;
  private readonly jwt: JwtService;

  public constructor(
    tokens: RefreshTokensRepository,
    users: UserService,
    jwt: JwtService,
  ) {
    this.tokens = tokens;
    this.users = users;
    this.jwt = jwt;
  }

  public async generateAccessToken(
    user: UserEntity,
    expiresIn = 60 * 60 * 24
  ): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
    };
    return this.jwt.signAsync({}, opts);
  }

  public async generateRefreshToken(
    user: UserEntity,
    expiresIn: number,
  ): Promise<string> {
    const token = await this.tokens.createRefreshToken(user, expiresIn);

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.id),
    };
    return this.jwt.signAsync({}, opts);
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: UserEntity; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: UserEntity }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwt.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<UserEntity> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.users.findById(subId);
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.tokens.findTokenById(tokenId);
  }
}
