import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    dirPath: string;

    constructor() {
        this.dirPath = path.join(process.env.ROOT_DIR);
        this.mkdir();
    }

    mkdir() {
        try {
            fs.readdirSync(this.dirPath);
        } catch (err) {
            fs.mkdirSync(this.dirPath);
        }
    }

    createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
        const dirPath = this.dirPath;
        const option = {
            storage: diskStorage({
                destination: dirPath,
                filename(req, file, done) {
                    done(null, file.originalname);
                    // const ext = path.extname(file.originalname);             // 확장자 추출
                    // const name = path.basename(file.originalname, ext);      // 확장자 제외 후 파일명 추출
                    // done(null, `${name}_${Date.now()}${ext}`);               // 파일명 변환
                },
            }),
            // fileFilter(req, file, done) {
            //     if (!file.originalname.match(/\.(csv)$/)) {
            //         return done(new Error('Only .csv format allowed!'), false);
            //     }
            //     done(null, true);
            // },                                                               // 파일 확장자 필터링
            // limits: { fileSize: 10 * 1024 * 1024 },                          // 용량 제한
        };
        return option;
    }
}