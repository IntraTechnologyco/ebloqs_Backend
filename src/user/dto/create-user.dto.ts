import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({ type: String, format: 'email', required: true })
    readonly email: string;

    @IsString()
    @ApiProperty()
    readonly deviceID: string;
}
