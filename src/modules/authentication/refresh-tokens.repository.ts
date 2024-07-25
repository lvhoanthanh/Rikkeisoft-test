import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../models/user.entity';
import { RefreshToken } from '../../models/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  public async createRefreshToken(
    user: UserEntity,
    ttl: number,
  ): Promise<RefreshToken> {
    const token = new RefreshToken();

    token.userId = user.id;
    token.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    token.expires = expiration;

    const savedToken = await this.refreshTokenRepository.save(token);
    return savedToken;
  }

  public async findTokenById(id: number): Promise<RefreshToken | null> {
    const refreshToken = await this.refreshTokenRepository.findOne(id);
    return refreshToken;
  }
}
