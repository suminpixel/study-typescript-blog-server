import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Hashtag extends Model {
  public readonly id!: number;
  public name!: string;
  public readonly created!: Date;
  public readonly updated!: Date;
}

Hashtag.init({
    name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Hashtag',
  tableName: 'hashtag',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  //db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
};
export default Hashtag;