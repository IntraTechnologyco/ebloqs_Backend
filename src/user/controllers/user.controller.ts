import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { RecoveryUserDto } from '../dto/recovery.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ValidateUserDto } from '../dto/validate.dto';
import { UserService } from '../user.service';

import { Request } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/me')
    meInfo(@Req() req: Request) {
        return this.userService.findOne(req['user']['userId']);
    }

    @Post('validate')
    findAll(@Body() code: ValidateUserDto) {
        return this.userService.validateEmailUser(code.code);
    }

    @Post('recovery')
    recoveryUser(@Body() code: RecoveryUserDto) {
        return this.userService.recoveryUser(code);
    }

    @Get('all')
    findOne(@Param('id') id: string) {
        return this.userService.getAllUsers();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete('allclients')
    remove() {
        return this.userService.deleteAllClients();
    }
}
