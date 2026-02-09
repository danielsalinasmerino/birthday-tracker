import type { User } from "../models/User";
import type { Group } from "../models/Group";

export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  addUser(user: Omit<User, "id">): Promise<string>;
  updateUser(id: string, user: Partial<User>): Promise<void>;
  deleteUser(id: string): Promise<void>;
}

export interface GroupRepository {
  getGroups(): Promise<Group[]>;
  getGroupById(id: string): Promise<Group | null>;
  getUserGroups(userId: string): Promise<Group[]>;
  addGroup(group: Omit<Group, "id">): Promise<string>;
  updateGroup(id: string, group: Partial<Group>): Promise<void>;
  deleteGroup(id: string): Promise<void>;
}
