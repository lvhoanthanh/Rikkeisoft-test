import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AuthMiddleware } from './middleware/auth.middleware';

import { RoleModule } from './modules/role/role.module';
import { UserController } from './modules/user/user.controller';
import { RoleController } from './modules/role/role.controller';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { CheckRoleMiddleware } from './middleware/check-role.middleware';
import { CronModule } from './cron-jobs/cron.module';
import { FileController } from './modules/file/file.controller';
import { FileModule } from "./modules/file/file.module";
import { ProductController } from "./modules/product/product.controller";
import { ProductModule } from "./modules/product/product.module";
import { CategoryController } from "./modules/category/category.controller";
import { CategoryModule } from "./modules/category/category.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    RoleModule,
    AuthenticationModule,
    UserModule,
    CronModule,
    FileModule,
    ProductModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, CheckRoleMiddleware)
      .exclude
      ()
      .forRoutes(
        UserController,
        RoleController,
        FileController,
        ProductController,
        CategoryController
      );
  }
}
