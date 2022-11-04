import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RawHeaders, GetUser } from './decorators';
import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.create( CreateUserDto );
  }


  @Post('login')
  loginUser(@Body() LoginUserDto: LoginUserDto) {
    return this.authService.login( LoginUserDto );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute( 
    @GetUser() user: User,
    @GetUser('email') userEmail: string ,
    
    @RawHeaders() rawHeaders: string[]
  ) {

    return {
      user,
      userEmail,
      rawHeaders
    };
  }

}
