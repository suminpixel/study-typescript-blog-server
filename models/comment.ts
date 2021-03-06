import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Comment extends Model {
  public id!: number;
  public content!: string;
}

Comment.init({
  content: {
    type: DataTypes.TEXT, // 긴 글
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'Comment',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
  db.Comment.belongsTo(db.User, {foreignKey: 'user_id'} );
  db.Comment.belongsTo(db.Post, {foreignKey: 'post_id'} );
};

export default Comment;