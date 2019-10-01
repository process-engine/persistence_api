import {
  AllowNull, Column, CreatedAt, DataType, Model, Table, UpdatedAt,
} from 'sequelize-typescript';

@Table({modelName: 'CronjobHistory', tableName: 'CronjobHistory'})
export class CronjobHistoryEntryModel extends Model<CronjobHistoryEntryModel> {

  @AllowNull(false)
  @Column
  public processModelId: string;

  @AllowNull(false)
  @Column
  public startEventId: string;

  @AllowNull(false)
  @Column
  public crontab: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  public executedAt: Date;

  @CreatedAt
  public createdAt?: Date;

  @UpdatedAt
  public updatedAt?: Date;

}
