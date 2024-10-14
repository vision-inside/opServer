import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFile } from './entity/upload-file.entity';
import { Repository } from 'typeorm';
import { UploadFileDTO } from './dto/upload-file.dto';
import { User } from 'src/auth/entity/user.entity';
import { CsvColumn } from './entity/csv-column.entity';
import { CsvColumnDTO } from './dto/csv-column.dto';
import * as fs from "fs";
import * as path from "path"

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(UploadFile) private uploadRepository: Repository<UploadFile>,
        @InjectRepository(CsvColumn) private csvColumnRepository: Repository<CsvColumn>
    ) {}

    async upload(user: User, file: Express.Multer.File): Promise<string | undefined> {
        let uploadFileDTO: UploadFileDTO = new UploadFileDTO();
        uploadFileDTO.name = 'test';                     // 테스트용 데이터
        uploadFileDTO.fileName = file.originalname;
        uploadFileDTO.filePath = file.path;
        uploadFileDTO.user = user;
        uploadFileDTO.approval = 1;                      // 테스트용 데이터

        const uploadFile = await this.uploadRepository.save(uploadFileDTO);
        await this.saveColumns(uploadFile);
        return uploadFileDTO.filePath;
    }
    
    async saveColumns(uploadFile: UploadFile): Promise<void> {
        const csv = fs.readFileSync(uploadFile.filePath, "utf-8");
        const columns = csv.split("\r\n")[0].split(",");
        columns.forEach(async column => {
            let csvColumnDTO: CsvColumnDTO = new CsvColumnDTO();
            csvColumnDTO.column = column;
            csvColumnDTO.uploadFile = uploadFile;
            await this.csvColumnRepository.save(csvColumnDTO);
        });
    }

    async fileWrite(filePath: string): Promise<void> {
        const fileName = await this.uploadRepository.createQueryBuilder('upload')
                                                    .select('upload.fileName as fileName')
                                                    .where('upload.filePath = :filePath', { filePath })
                                                    .getRawOne();
        if (!fileName) {
            throw new NotFoundException();
        }

        const rows = await this.csvColumnRepository.createQueryBuilder('csv')
                                                    .select('csv.column as column')
                                                    .leftJoin('csv.uploadFile', 'upload')
                                                    .where('upload.filePath = :filePath', { filePath })
                                                    .getRawMany();
        if (!rows) {
            throw new NotFoundException();
        }

        const ext = path.extname(fileName.fileName);
        const name = path.basename(fileName.fileName, ext);
        const fwPath = `${process.env.IB_FILE_DIR}${name}.ib`;
        rows.forEach(row => fs.appendFileSync(fwPath, `Column ${row.column} {\n\n}\n`, 'utf-8'));
    }
}
