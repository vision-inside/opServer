import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/roles.guard';
import { Roles } from './decorator/role.decorator';
import { RoleType } from './role-type';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entity/user.entity';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: '회원 가입 API', description: '회원 가입 기능' })
    @ApiBody({ type: UserDTO })
    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
        return await this.authService.registerUser(userDTO);
    }

    @ApiOperation({ summary: '로그인 API', description: '로그인 기능' })
    @ApiBody({ type: UserDTO })
    @ApiCreatedResponse({ description: 'JWT accessToken 반환' })
    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
        return res.json(jwt);
    }

    @ApiOperation({ summary: '사용자 인증 API', description: 'JWT access-token으로 사용자 인증 후, User 객체 반환' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: User })
    @Get('/authenticate')
    @UseGuards(AuthGuard)
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }
    
    @ApiOperation({ summary: '관리자 권한 확인 API', description: 'JWT access-token으로 인증 후, 관리자 권한을 가진 사용자만 접근 가능' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ type: User })
    @Get('/admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    adminRoleCheck(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }
}
