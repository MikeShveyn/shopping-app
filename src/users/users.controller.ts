import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {

    }

    @Get()
    async listUsers(@Query('orderby') orderby: string, @Query('searchPhrase') searchPhrase: string) {
      return this.usersService.listUsers(orderby, searchPhrase);
    }
    
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }


}
