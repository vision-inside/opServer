import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadFile } from "./upload-file.entity";

@Entity('csv_column')
export class CsvColumn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    column: string;

    @ManyToOne(() => UploadFile, uploadFile => uploadFile.columns)
    @JoinColumn({ name: 'upload_file_id' })
    uploadFile: UploadFile;
}