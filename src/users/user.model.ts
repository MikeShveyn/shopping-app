import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from '../products/product.model';
import { Order } from '../orders/order.model';

@Table
export class User extends Model<User> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  userId: string;

  @Column({ allowNull: false })
  firstName: string;

  @Column({ allowNull: false })
  lastName: string;

  @Column({ allowNull: false, unique: true })
  username: string;

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Order)
  orders: Order[];
}
