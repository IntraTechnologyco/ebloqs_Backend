import { Body, Controller, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    // 2- login usuarios
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    login(@Body() payload) {
        return this.authService.login(payload);
    }

    @UseGuards(AuthGuard('admin'))
    @Post('/admin')
    async loginadmin(@Req() payload: Request) {
        return this.authService.login(payload['user']);
    }

    // 1- registro usuario
    @Post('/register')
    async register(@Body() payload: CreateUserDto) {
        return this.authService.registerUser(payload);
    }

    // 1- registro admin
    @Post('/admin/register')
    async adminRegister(@Body() payload: CreateAdminDto) {
        return this.authService.registerAdmin(payload)
    }


    @Post('/admin/login')
    adminLogin(@Body() payload) {
        return this.authService.loginAdmin(payload)
    }

    // >>>> En pruebas <<<<
    @Post('/sign_in_with_apple')
    async siginWithApple(@Req() request: Request) {
        return this.authService.signinApple(request);
    }

    // >>>> En pruebas <<<<
    @Post('/callback/sign_in_with_apple')
    @Redirect()
    async appleCallBack(@Req() request: Request) {
        return this.authService.appleCallBack(request);
    }
}
