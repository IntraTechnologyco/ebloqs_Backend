import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthAppleLoginDto } from './dtos/apple.dto';
import AppleAuth, { AppleAuthConfig }  from "apple-auth";

import appleSigninAuth from 'apple-signin-auth';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        ) {}
        
        
    async validateUser(email: string, deviceID: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            console.log(deviceID);
            console.log(user);
            const isMatch = user.deviceID.indexOf(deviceID);
            if (isMatch != -1) {
                return user;
            } else {
                throw new UnauthorizedException('Device unauthorized');
            }
        } else {
            throw new UnauthorizedException('User not found');
        }
    }

    async login(user: any) {
        const validUser = await this.validateUser(user.email, user.deviceID);
        const payload = { userid: validUser.id, deviceID: validUser.deviceID };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registerUser(userData: CreateUserDto) {
        try {
            const userRegister = await this.usersService.create(userData);
            const payload = {
                userid: userRegister.id,
                deviceID: userRegister.deviceID,
            };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async getProfileByToken(
        loginDto: string,
      ): Promise<any> {
        try {
            const data = await appleSigninAuth.verifyIdToken(loginDto, {
              audience: process.env.BUNDLE_ID,
            });
        
            return {
              id: data.sub,
              email: data.email,
            };
            
        } catch (error) {
            throw new HttpException(error, 500)
        }
      }

    async signinwithApple (request: Request,) {
        try {
            const redirect = `intent://callback?${new URLSearchParams(
              request.body
            ).toString()}#Intent;package=${process.env.ANDROID_PACKAGE_IDENTIFIER
              };scheme=signinwithapple;end`;
        
            console.log(`Redirecting to ${redirect}`);
        
            return {
                status: 307,
                redirect
            }
          } catch (error) {
            console.log(`Callback error: ${error}`);
            throw new Error(error);
          }
    }

    async signinApple (request: Request) {
        try {
            console.log(request);
            const configAuth = <AppleAuthConfig>{
                client_id:
                request.query.useBundleId === "true"
                  ? process.env.BUNDLE_ID
                  : process.env.SERVICE_ID,
              team_id: process.env.TEAM_ID,
              redirect_uri:
                "https://agile-beach-41948.herokuapp.com/auth/callback/signinWithApple", // does not matter here, as this is already the callback that verifies the token after the redirection
              key_id: process.env.KEY_ID,
            };

            const auth = new AppleAuth(
                configAuth,
                process.env.KEY_CONTENTS,
                "text"
            );
        
            const accessToken = await auth.accessToken(request.query.code.toString());
        
            return this.getProfileByToken(accessToken.id_token)
          } catch (error) {
            console.log(`signInWithApple error: ${error}`);
            throw new HttpException(error, 500);
          }
    }
}
