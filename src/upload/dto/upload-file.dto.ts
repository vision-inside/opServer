import { User } from "src/auth/entity/user.entity";

export class UploadFileDTO {
    name: string;
    fileName: string;
    filePath: string;
    user: User;
    approval: number;
}