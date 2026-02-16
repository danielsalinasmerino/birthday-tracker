import type { User } from "../models/User";

export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  addUser(user: Omit<User, "id">): Promise<string>;
  updateUser(id: string, user: Partial<User>): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
