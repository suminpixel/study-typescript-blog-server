import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Hashtag extends Model {
  public readonly id!: number;
  public name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Hashtag.init({
    name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Hashtag',
  tableName: 'Hashtag',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' , foreignKey: 'hashtag_id' });
};
export default Hashtag;