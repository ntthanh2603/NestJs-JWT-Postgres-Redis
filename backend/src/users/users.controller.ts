import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseInterceptors,
  Delete,
  BadRequestException,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { isUUID } from 'class-validator';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/account')
  @ResponseMessage('Get user information')
  handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }
    return this.usersService.processNewToken(refreshToken, response);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('User by user_id')
  findUserById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.usersService.findUserById(id);
  }

  @Patch()
  @ResponseMessage('Update User')
  @UseInterceptors(FileInterceptor('avatar-user'))
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(updateUserDto, user, file);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  @UseInterceptors(FileInterceptor('avatar-user'))
  @ApiBody({ type: RegisterUserDto })
  handleRegister(
    @Body() dto: RegisterUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.register(dto, file);
  }

  @Public()
  @ResponseMessage('User login')
  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  handleLogin(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.usersService.login(dto, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout user')
  hendleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.usersService.logout(response, user);
  }

  @Delete()
  @ResponseMessage('Delete User')
  deleteUser(@User() user: IUser) {
    return this.usersService.deleteUser(user.id);
  }
}
