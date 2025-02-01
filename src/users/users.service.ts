import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { Op } from "sequelize";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {}

    /**
     * Create user and add it to db, with relevant data
     * @param createUserDto Dto with user data
     * @returns 
     */
    async createUser(createUserDto: CreateUserDto) : Promise<User> {
        return await this.userModel.create(createUserDto as any);
    }



    /**
     * Get users from db with sort options and filter
     * @param orderby 
     * @param searchPhrase 
     * @returns 
     */
    async listUsers(orderby?: string, searchPhrase?: string) : Promise<{users: User[], total : number}> {
        let orderColumn = 'createdAt';
        if(orderby === 'firstName' || orderby === 'lastName' || orderby === 'createTime') {
          orderColumn = orderby;
        }

        const whereClause = searchPhrase
        ? {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${searchPhrase}%` } },
              { lastName: { [Op.iLike]: `%${searchPhrase}%` } },
              { username: { [Op.iLike]: `%${searchPhrase}%` } },
            ],
          }
        : {};

        const users = await this.userModel.findAll({
          where: whereClause,
          order: [[orderColumn, 'ASC']]
        });

        return {users, total: users.length}
    }
}
