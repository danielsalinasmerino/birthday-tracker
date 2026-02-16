import type { GroupRepository } from "../repositories/GroupRepository";
import type { Group } from "../models/Group";

export const getGroups = (repository: GroupRepository): Promise<Group[]> => {
  return repository.getGroups();
};

export const getGroupById = (
  repository: GroupRepository,
  id: string,
): Promise<Group | null> => {
  return repository.getGroupById(id);
};

export const getUserGroups = (
  repository: GroupRepository,
  userId: string,
): Promise<Group[]> => {
  return repository.getUserGroups(userId);
};

export const addGroup = (
  repository: GroupRepository,
  group: Omit<Group, "id">,
): Promise<string> => {
  return repository.addGroup(group);
};

export const updateGroup = (
  repository: GroupRepository,
  id: string,
  group: Partial<Group>,
): Promise<void> => {
  return repository.updateGroup(id, group);
};

export const deleteGroup = (
  repository: GroupRepository,
  id: string,
): Promise<void> => {
  return repository.deleteGroup(id);
};
