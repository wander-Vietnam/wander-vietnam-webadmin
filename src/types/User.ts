export interface User {
    id: string;
    role: string | null;
    fullname: string;
    email: string;
    rankPoints: number;
    avatar: string | null;
    joinedDate: string; 
    phone: string | null;
    token_google: string | null;
    token_facebook: string | null;
    isActive: boolean | null;
    provider: string;
    status: string;
    totalRankPoints: number;
}

export interface UserGetAll {
    id: string;
    role: string | null;
    fullname: string;
    email: string;
    rankPoints: number;
    avatar: string | null;
    joinedDate: string;
    phone: string | null;
    pwdHash: string;
    token_google: string | null;
    token_facebook: string | null;
    isActive: boolean | null;
    provider: string;
    status: string;
    totalRankPoints: number;
}

export interface UserResponse {
    users: UserGetAll[];
}
