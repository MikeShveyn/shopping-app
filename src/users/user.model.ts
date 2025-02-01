import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from '../products/product.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;

  @HasMany(() => Product)
  products: Product[];

}
