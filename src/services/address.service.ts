// ...existing code...
import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";
import {
  CreateAddressInput,
  UpdateAddressInput,
  AddressResponse,
  GetAllAddressesResponse,
} from "../schemas/address.schema.js";

/**
 * Create a new address for a user
 */
export const createAddress = async (data: CreateAddressInput): Promise<AddressResponse> => {
  const user = await User.findByPk(data.user_id);
  if (!user) throw new Error("User not found. Invalid foreign key (user_id)");

  const created = await Address.create(data);
  return created.get({ plain: true }) as AddressResponse;
};

/**
 * Get all addresses with optional pincode filter (no pagination)
 */
export const getAllAddresses = async (pincode?: string): Promise<GetAllAddressesResponse> => {
  const where: any = {};
  if (pincode) where.pincode = pincode;

  const addresses = await Address.findAll({
    where,
    attributes: ["id", "user_id", "street", "city", "state", "pincode", "created_at", "updated_at"],
    
  });

  const plain = addresses.map((a: any) => a.get({ plain: true }) as AddressResponse);

  return {
    addresses: plain,
    total: plain.length,
  } as GetAllAddressesResponse;
};

/**
 * Get address by ID
 */
export const getAddressById = async (id: number): Promise<AddressResponse | null> => {
  const address = await Address.findByPk(id, {
    attributes: ["id", "user_id", "street", "city", "state", "pincode", "created_at", "updated_at"],
  });
  return address ? (address.get({ plain: true }) as AddressResponse) : null;
};

/**
 * Update address by ID
 */
export const updateAddress = async (id: number, data: Partial<UpdateAddressInput>): Promise<AddressResponse> => {
  const address = await Address.findByPk(id);
  if (!address) throw new Error("Address not found");

  if (data.user_id) {
    const user = await User.findByPk(data.user_id);
    if (!user) throw new Error("User not found. Invalid foreign key (user_id)");
  }

  await address.update(data);

  const updated = await Address.findByPk(id, {
    attributes: ["id", "user_id", "street", "city", "state", "pincode", "created_at", "updated_at"],
  });

  return updated!.get({ plain: true }) as AddressResponse;
};

/**
 * Delete address by ID
 */
export const deleteAddress = async (id: number): Promise<void> => {
  const deletedCount = await Address.destroy({ where: { id } });
  if (deletedCount === 0) throw new Error("Address not found");
  return;
};

/**
 * Alias for controllers that use this name
 */
export const getAllAddressesWithPincode = async (pincode?: string): Promise<GetAllAddressesResponse> => {
  return getAllAddresses(pincode);
};
// ...existing code...