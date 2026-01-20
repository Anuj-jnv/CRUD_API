import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./user.model.js";


export class Address extends Model {
  public id!: Number;
  public user_id!: Number;
  public street!: string;
  public city!: string;
  public state!: string;
  public pincode!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public validateData(){
    if(!this.street || this.street.trim()===""){
        throw new Error("Street name  is required");
    }

    if(!this.city || this.city.trim()===""){
        throw new Error("City name is required");
    }
    if(!this.state || this.state.trim()===""){
        throw new Error("State name is required");
    }
    if(!this.pincode || !/^\d{6}$/.test(this.pincode)){
       throw new Error("Pincode must be 6 digit number");
    }

    
  }
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: User,
        key: "id"
      }
    },

    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isNumeric:true,
        len:[6,6],
      }
    },

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
    tableName: "addresses",
    timestamps: false,

    hooks:{
      beforeValidate:(address:Address) => {
        address.validateData();
      }
    }
  }
  
);

User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });