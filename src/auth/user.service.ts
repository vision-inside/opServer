import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "./dto/user.dto";
import { User } from "./entity/user.entity";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
        try {
            return await this.userRepository.save(userDTO);
        } catch (error) {
            if (error.errno === 1062) {
                throw new ConflictException('The username is already in use');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async findByFields(options: FindOneOptions<User>): Promise<User | undefined> {
        return await this.userRepository.findOne(options);
    }
}