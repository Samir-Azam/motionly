import { ObjectId } from "mongodb";

export const toObjectId = (id) => {
  if (!id) throw new Error('Invalid ID');
  return new ObjectId(String(id)); // Safe for all cases
};

