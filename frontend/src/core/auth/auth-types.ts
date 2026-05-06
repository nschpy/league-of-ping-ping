export interface User {
  _id: string;
  displayName: string;
  username: string;
  email: string;
  country?: string;
  bio?: string;
  avatarColor: number;
  mmr: number;
  peakMmr: number;
  wins: number;
  losses: number;
  streak: number;
  recentResults: ('W' | 'L')[];
  role: 'player' | 'referee' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  displayName: string;
  username: string;
  email: string;
  password: string;
}
