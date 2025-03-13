import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'refreshTokens' })
export class RefreshToken extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  userId: string;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  /**
    Technically, we don’t necessarily need to include an expires field because we’ll embed the expiration date in the 
    refresh token, but storing it in the database allows us to optionally purge expired tokens in the future.
   */
  @Column({
    type: 'timestamptz',
    default: () => "CURRENT_DATE + INTERVAL'30 day'",
  })
  expires: Date;
}
