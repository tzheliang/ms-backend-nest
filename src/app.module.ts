import { Module } from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ProductsModule,
    TokenModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'api_user',
      password: 'lLfeWOUNasTLRC',
      database: 'MOTOR_INSURANCE_WEBSITE',
      entities: [Product],
      synchronize: true,
    }),
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
