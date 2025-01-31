import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table
export class Product extends Model<Product> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  productId: string;

  @Column({ allowNull: false })
  productName: string;

  @Column({ allowNull: false })
  price: number;

  @Column({ allowNull: false })
  quantity: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
