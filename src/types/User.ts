export interface User {
  id: string; // UUID
  name: string;
  surname?: string;
  email?: string;
  birthDate: Date;
  groupIds?: string[];
  showAge?: boolean;
}
