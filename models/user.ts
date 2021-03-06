import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  DataTypes,
  Model,
} from 'sequelize';

import { sequelize } from './sequelize';
import { dbType } from './index';
import Post from './post';

class User extends Model {
  public readonly id!: number;

  public name!: string;

  public user_id!: string;

  public password!: string;

  public readonly created!: Date;

  public readonly updatedAt!: Date;

  public addFollowing!: BelongsToManyAddAssociationMixin<User, number>;

  public getFollowings!: BelongsToManyGetAssociationsMixin<User>;

  public getFollowers!: BelongsToManyGetAssociationsMixin<User>;

  public removeFollower!: BelongsToManyRemoveAssociationMixin<User, number>;

  public removeFollowing!: BelongsToManyRemoveAssociationMixin<User, number>;

  public readonly Posts?: Post[];

  public readonly Followings?: User[];

  public readonly Followers?: User[];
}

User.init({
  name: {
    type: DataTypes.STRING(20), // 20글자 이하
    allowNull: false, // 필수
  },
  user_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true, // 고유한 값
  },
  password: {
    type: DataTypes.STRING(100), // 100글자 이하
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'User',
  charset: 'utf8',
  collate: 'utf8_general_ci', // 한글이 저장돼요
});

export const associate = (db: dbType) => {
  db.User.hasMany(db.Post, { as: 'Posts',foreignKey: 'post_id' });
  db.User.hasMany(db.Comment, {foreignKey: 'user_id'});
  db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' ,foreignKey: 'user_id' });
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'following_id' });
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'follower_id' });
};

export default User;