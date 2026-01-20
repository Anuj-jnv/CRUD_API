import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";


export class User extends Model {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  // public password!:string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public validateData(){
    if(!this.first_name || this.first_name.trim()===""){
        throw new Error("First name is required");
    }

     if(!this.last_name || this.last_name.trim()===""){
        throw new Error("Last name is required");
    }
    //  if(!this.password || this.password.trim()===""){
    //     throw new Error("Password is required");
    // }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{msg: "First name can not be Empty"},
      },
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{msg: "Last name can not be Empty"},
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail:{
            msg:"Email is not valid"
        },
        notEmpty:{
            msg:"Email can not be Empty"
        },
      },
    },
    
    // password:{
    //   type: DataTypes.STRING,
    //   allowNull:false,
    // },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    sequelize,
    tableName: "users",
    timestamps: false,

    hooks:{
        beforeValidate:(user:User) => {
            user.validateData();
        },
    },
  }
);