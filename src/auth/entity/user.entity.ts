import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserRole } from "./user-role.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UploadFile } from "src/upload/entity/upload-file.entity";

@Entity('user')
@Unique(['username'])
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    username: string;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @OneToMany(() => UserRole, userRole => userRole.user, { eager: true })
    roles?: any[];

    @ApiProperty()
    @OneToMany(() => UploadFile, userFile => userFile.user, { eager: true })
    files?: any[];
}