export interface User {
  id: string;
  name: string;
  surname?: string;
  email?: string;
  birthDate: Date;
  groupIds?: string[];
  showAge?: boolean;
}
