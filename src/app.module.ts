import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entity/user.entity';
import { UserRole } from './auth/entity/user-role.entity';
import { UploadModule } from './upload/upload.module';
import { UploadFile } from './upload/entity/upload-file.entity';
import { CsvColumn } from './upload/entity/csv-column.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // type: 'mysql',
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT),
      // username: process.env.DB_USER,
      // password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [User, UserRole, UploadFile, CsvColumn],
      synchronize: true,      // entity와 DB간 동기화 / 개발에서만 true 옵션 사용
      // logging: true,
      // timezone: '+00:00'
    }),
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
