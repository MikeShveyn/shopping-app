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
     * Get users with sort and filter otpions 
     * @param orderby can be ordered by firstName, lastName, createTime
     * @param searchPhrase we check in firstName, lastName or nickname
     * Whitelist: Strips out unknown fields automaticall
     * Forbid Non-Whitelisted: Rejects requests with extra fields.
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
     * tRansform Converts query parameters to correct types.
     * @returns userId or error
     */
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
      const user = await this.usersService.createUser(createUserDto);
      res.status(HttpStatus.CREATED).json({ userId: user.userId });
    }

    // what to do with 500 if user exists 


}
