import { User } from "src/auth/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CsvColumn } from "./csv-column.entity";

@Entity('upload_file')
export class UploadFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('varchar', { name: 'file_name' })
    fileName: string;

    @Column('varchar', { name: 'file_path' })
    filePath: string;

    // @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Timestamp;

    // @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Timestamp;

    @Column('int', { name: 'approval' })
    approval: number;

    @ManyToOne(() => User, user => user.files)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => CsvColumn, csvColumn => csvColumn.uploadFile, { eager: true })
    columns?: any[];
}