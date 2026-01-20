
import { Op } from "sequelize";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { CreateUserInput, UpdateUserInput, UserResponse, GetAllUsersWithAddressesResponse } from "../schemas/user.schema.js";

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserInput) => {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw new Error("Email already exists");
  const created = await User.create(data);
  
  return created.get({ plain: true }) as UserResponse;
};

export const getUserById = async (id: number): Promise<UserResponse | null> => {
  const user = await User.findByPk(id, {
    attributes: ["id", "first_name", "last_name", "email", "created_at", "updated_at"],
    include: [
      {
        model: Address,
        attributes: ["id", "user_id","street", "city", "state", "pincode"],
      },
    ],
  });

  if (!user) return null;
  return user.get({ plain: true }) as UserResponse;
};

/**
 * Get all users (basic fields)
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const users = await User.findAll({ attributes: ["id", "first_name", "last_name", "email","created_at","updated_at"] });
  return users.map(u => u.get({ plain: true }));
};

/**
 * Update user by id
 */
export const updateUser = async (id: number, data: Partial<UpdateUserInput>): Promise<UserResponse> => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  if (data.email) {
    const existing = await User.findOne({ where: { email: data.email, id: { [Op.ne]: id } } });
    if (existing) throw new Error("No two users can have the same email");
  }
  await user.update(data);
  const updated = await User.findByPk(id, { attributes: ["id", "first_name", "last_name", "email", "created_at", "updated_at"] });
  return (updated!.get({ plain: true }) as UserResponse);
};

/**
 * Delete user by id
 */
export const deleteUser = async (id: number): Promise<void> => {
  const deletedCount = await User.destroy({ where: { id } });
  if (deletedCount === 0) throw new Error("User not found");
  return;
};

/**
 * Get all users with nested addresses
 */
export const getAllUsersWithAddress = async () => {
  try {
    const users = await User.findAll({
      attributes: ["id", "first_name", "last_name", "email", "created_at", "updated_at"],
      include: [{ 
        model: Address,
        attributes: ["id", "street", "city", "state", "pincode", "created_at", "updated_at"],
      }],
      order: [["id", "ASC"]],
    });

    const transformedUsers = users.map(user => {
      const plainUser = user.get({ plain: true });
      return {
        id: plainUser.id,
        first_name: plainUser.first_name,
        last_name: plainUser.last_name,
        email: plainUser.email,
        created_at: plainUser.created_at?.toISOString(),
        updated_at: plainUser.updated_at?.toISOString(),
        addresses: (plainUser.Addresses || []).map((address:any) => ({
          id: address.id,
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          created_at: address.created_at?.toISOString(),
          updated_at: address.updated_at?.toISOString()
        }))
      };
    });

    return {
      success: true,
      message: "Users with addresses fetched successfully",
      data: transformedUsers
    };

  } catch (error: any) {
    throw new Error(`Failed to fetch users with addresses: ${error.message}`);
  }
};