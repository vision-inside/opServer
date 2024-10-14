import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from './entity/upload-file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/util/multer.config';
import { CsvColumn } from './entity/csv-column.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile, CsvColumn]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
