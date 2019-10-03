import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule, CommonModule,                      
            TypeOrmModule.forRootAsync({   
              imports: [ConfigModule],           
              useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get("HOST"),
                port: Number(config.get("PORT")),
                username: config.get("USERNAME"),
                password: config.get("PASSWORD"),
                database: config.get("DB_NAME"),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,              
              }),
              inject: [ConfigService]
            }), 
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
