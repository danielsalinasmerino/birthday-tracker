export interface User {
  id: string; // UUID
  name: string;
  surname?: string;
  email?: string;
  birthDate: Date;
  groupIds?: string[];
  showAge?: boolean;
}

export interface Group {
  id: string; // UUID
  name: string;
  userIds: string[];
}
