import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async createUser(createUserDto: CreateUserDto) : Promise<User> {
        return await this.userModel.create(createUserDto as any);
    }
    
    async listUsers(orderby?: string, searchPhrase?: string) {
        let whereObj = {};
        if (searchPhrase) {
            whereObj = {
            $or: [
              { firstName: { $like: `%${searchPhrase}%` } },
              { lastName: { $like: `%${searchPhrase}%` } },
              { username: { $like: `%${searchPhrase}%` } }
            ]
          };
        }
        return await this.userModel.findAll({ where: whereObj, order: [[orderby || 'createTime', 'ASC']] });
    }
}
