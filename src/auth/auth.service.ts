import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt'
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async registerUser(newUser: UserDTO): Promise<UserDTO> {
        await this.transformPassword(newUser);
        return await this.userService.save(newUser);
    }

    async transformPassword(user: UserDTO): Promise<void> {
        user.password = await bcrypt.hash(user.password, 10);
        return Promise.resolve();
    }

    async validateUser(userDTO: UserDTO): Promise<{accessToken: string} | undefined> {
        let userFind: User = await this.userService.findByFields({
            where: { username: userDTO.username }
        });
        if (!userFind || !await bcrypt.compare(userDTO.password, userFind.password)) {
            throw new UnauthorizedException();
        }

        this.convertInRoles(userFind);
        const payload: Payload = {
            id: userFind.id,
            username: userFind.username,
            roles: userFind.roles
        };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    private convertInRoles(user: any): User {
        if (user && user.roles) {
            const roles: any[] = [];
            user.roles.forEach(role => {
                roles.push({ name: role.roleName });
            });
            user.roles = roles;
        }
        return user;
    }

    async tokenValidateUser(payload: Payload): Promise<User | undefined> {
        const userFind =  await this.userService.findByFields({
            where: { id: payload.id }
        });
        this.flatRoles(userFind);
        return userFind;
    }

    private flatRoles(user: any): User {
        if (user && user.roles) {
            const roles: string[] = [];
            user.roles.forEach(role => roles.push(role.roleName));
            user.roles = roles;
        }
        return user;
    }
}
