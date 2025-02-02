import { Controller, Post, Get, Body, Query, UsePipes, ValidationPipe, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { ListUsersDto } from './dto/list-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {
  
    }

    /**
     * Return users with sort and filter otpions 
     * @param orderby can be ordered by firstName, lastName, createTime
     * @param searchPhrase we check in firstName, lastName or nickname
     * @returns 
     */
    @Get()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async listUsers(@Query() listUsersDto: ListUsersDto ) : Promise<{ users: User[]; total: number }> {
      return this.usersService.listUsers(listUsersDto.orderby, listUsersDto.searchPhrase);
    }
    
    /**
     * Create New user 
     * @param createUserDto 
     * @returns userId or error
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
      const user = await this.usersService.createUser(createUserDto);
      return { userId: user.userId };
    }


}
