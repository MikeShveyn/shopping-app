import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';



@Table
export class Order extends Model<Order> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  orderId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ allowNull: false })
  quantity: number;

  @Column({ allowNull: false })
  totalPrice: number;
}
