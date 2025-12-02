export interface User {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role?: string;
  createdAt: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
