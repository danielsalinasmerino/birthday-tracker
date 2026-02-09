import type { UserRepository } from "../repositories/Repository";
import type { User } from "../models/User";

export const getUsers = (repository: UserRepository): Promise<User[]> => {
  return repository.getUsers();
};

export const getUserById = (
  repository: UserRepository,
  id: string,
): Promise<User | null> => {
  return repository.getUserById(id);
};

export const addUser = (
  repository: UserRepository,
  user: Omit<User, "id">,
): Promise<string> => {
  return repository.addUser(user);
};

export const updateUser = (
  repository: UserRepository,
  id: string,
  user: Partial<User>,
): Promise<void> => {
  return repository.updateUser(id, user);
};

export const deleteUser = (
  repository: UserRepository,
  id: string,
): Promise<void> => {
  return repository.deleteUser(id);
};
