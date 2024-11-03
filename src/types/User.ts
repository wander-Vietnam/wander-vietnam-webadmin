
export interface User {
    id: string;
    role: string;
    fullname: string;
    email: string;
    rankPoints: number;
    avatar: string;
    joinedDate: string; 
    phone: string | null;
    token_google: string | null;
    token_facebook: string | null;
    isActive: boolean;
    provider: string;
    status: string;
    totalRankPoints: number;
  }
  