import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, 'mysqlDB') private userRepo: Repository<User>,
    ) {}
    create(createUserDto: CreateUserDto) {
        try {
            let user = new User();
            user = {
                id: '',
                email: createUserDto.email,
                deviceID: [createUserDto.deviceID],
                name: '',
                type_acount: createUserDto.type_acount,
                email_verificated: false,
                create: new Date(),
                update: new Date(),
            };
            const newUser = this.userRepo.create(user);
            newUser.id = uuidv4();
            newUser.name = 'Your name';
            const linkCode = this.generatelinkvalidate(newUser.id)
            console.log(linkCode);
            return this.userRepo.save(newUser);
        } catch(e){
            throw new HttpException(e, 500)
        }
    }

    findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    findOne(id: string) {
        return this.userRepo.findOne({ where: { id } });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user ${updateUserDto}`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    generatelinkvalidate(id: string) {
        return `https://ebloqs-validate.netlify.app/?code=${id}`;
    }

    async validateEmailUser(code: string) {
        let vuser = await this.findOne(code);
        if(vuser.email_verificated){
            throw new UnauthorizedException('Este código ya caducó')
        } else {
            vuser.email_verificated = true;
            await this.userRepo.save(vuser);
            return `Correo ${vuser.email} verificado`
        }
    }
}
