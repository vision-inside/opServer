import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @ApiOperation({ summary: 'csv 파일 업로드 API', description: '파일 업로드 시 column 추출 후 DB에 저장' })
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiCreatedResponse({ type: 'string', description: '파일 경로 반환' })
    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @Req() req: Request,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: 'csv' })
                .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
        ) file: Express.Multer.File): Promise<string | undefined> {
        const user: any = req.user;
        return await this.uploadService.upload(user, file);
    }

    @ApiOperation({ summary: '.ib 파일 생성 API', description: '업로드 한 csv 파일 경로로 .ib 파일 생성' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string'
                },
            },
        },})
    @ApiOkResponse({ description: '.ib 파일 생성 성공' })
    @Get('write')
    async fileWrite(@Body() filePath: string): Promise<void> {
        const path = JSON.parse(JSON.stringify(filePath)).path;
        return await this.uploadService.fileWrite(path);
    }
}
