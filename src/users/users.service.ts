import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { Op, UniqueConstraintError } from "sequelize";
import { Product } from "src/products/product.model";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {}

    /**
     * Create user and add it to db, with relevant data
     * @param createUserDto Dto with user data
     * @returns created user or error
     */
    async createUser(createUserDto: CreateUserDto) : Promise<User> {
      try{
        return await this.userModel.create(createUserDto as any);
      }catch(error) {
        if (error instanceof UniqueConstraintError) {
          throw new ConflictException('Username already exists');
        }
        throw error; // in case we catch another error
      }
    }



    /**
     * Return users from db with sort options and filter
     * @param orderby can be ordered by firstName, lastName, createTime
     * @param searchPhrase  we check in firstName, lastName or nickname
     * @returns total number and list of users
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
          order: [[orderColumn, 'ASC']],
          // include: [{ model: Product }] // we can include also
        });

        return {users, total: users.length}
    }
}
