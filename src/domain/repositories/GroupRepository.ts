import type { Group } from "../models/Group";

export interface GroupRepository {
  getGroups(): Promise<Group[]>;
  getGroupById(id: string): Promise<Group | null>;
  getUserGroups(userId: string): Promise<Group[]>;
  addGroup(group: Omit<Group, "id">): Promise<string>;
  updateGroup(id: string, group: Partial<Group>): Promise<void>;
  deleteGroup(id: string): Promise<void>;
}
