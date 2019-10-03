import { Controller, Get, Request, Post, Body, UseGuards, ValidationPipe, UsePipes, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ApiImplicitBody, ApiUseTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { ResponseCode } from '../common/interfaces/responsecode.interface';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private usersService: UsersService) {}
  
  @UseGuards(AuthGuard('local'))
  @Post('login')  
  @ApiImplicitBody({
    type: User,
    name: 'credentials',
    description: 'User credentials',
    required: true,
    isArray: false,    
  })

  async login(@Request() req) {  

    const user = await this.usersService.findById(req.user.id);        
        user.updated_time = new Date();
        await this.usersService.save(user);        
        let data = await this.authService.login(req.user);
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, data);   
    
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() userData: CreateUserDto) {      
      const entity = Object.assign(new User(), userData);
      
      // check user exist 
      const isUserExists = await this.usersService.checkUserExists(entity.email);
      if (isUserExists) {
        return new ResponseError(ResponseCode.RESULT_USER_EXISTS, "This user is exists");
      }

      // create a new user
      try {
        const user = await this.usersService.create(entity);
        const token = await this.authService.createEmailToken(user.email);
        const sent = await this.authService.sendVerifyEmail(user.email,token);      
        
        if(sent){
          return new ResponseSuccess(ResponseCode.RESULT_SUCCESS);
        } else {
          return new ResponseError(ResponseCode.RESULT_FAIL, "Email not sent");
        }      

      } catch( error ) {
        return new ResponseError(ResponseCode.RESULT_FAIL, "Register failure");
      }
      
  }

  @Get('email/verify/:token')
  async verifyEmail(@Param('token') token:number): Promise<Object> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(token);
      return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, isEmailVerified);
    } catch(error) {
      return new ResponseSuccess(ResponseCode.RESULT_FAIL, error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email/resend-verification')
  async sendEmailVerification(@Request() req): Promise<Object> {
    try {
      const user = await this.usersService.findById(req.user.id);
      const token = await this.authService.recreateEmailToken(user);
      if (token < 0 ) {
        return new ResponseError(ResponseCode.RESULT_FAIL, "Email has not been sent");
      }

      var isEmailSent = await this.authService.sendVerifyEmail(user.email, token);      
      if(isEmailSent){
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, null);
      } else {
        return new ResponseError(ResponseCode.RESULT_FAIL, "Email has not been sent");
      }

    } catch(error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "Error when sending email");
    }
  }

  @Get('email/forgot-password/:email')
  async sendEmailForgotPassword(@Param('email') email:string): Promise<Object> {
    try {
      var isEmailSent = await this.authService.sendEmailForgotPassword(email);
      if(isEmailSent){
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, null);
      } else {
        return new ResponseError(ResponseCode.RESULT_FAIL, "Email has not been sent");
      }
    } catch(error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "Error when sending email");
    }
  }

  @Get('email/reset-password/:token')
  async resetPasswordFromToken(@Param('token') token) {    

    try {
      let user = await this.authService.checkVerificationCode(token);
      let randomPassword = await this.authService.generateRandomPassword();
      // change password
      user.password = bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(8), null);        
      await this.usersService.update(user);        
      // send email the new password      
      var isEmailSent = await this.authService.emailResetedPassword(user.email, randomPassword);      
      if(isEmailSent){
        return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, null);
      } else {
        return new ResponseError(ResponseCode.RESULT_FAIL, "Email has not been sent");
      }
      
    } catch(error) {
      return new ResponseError(ResponseCode.RESULT_FAIL, "Unexpected error happen");
    }          
  }

}
