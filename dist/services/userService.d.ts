import { UserDto } from '../types/dtos';
declare function getUsers(): Promise<UserDto[]>;
declare function getUserByLogin(username: string, password: string): Promise<UserDto | null>;
declare function getUserById(id: string): Promise<UserDto | null>;
declare function getUserWithRoles(userId: string): Promise<UserDto>;
declare function createUser(username: string, email: string, password: string): Promise<UserDto>;
export declare const userService: {
    getUsers: typeof getUsers;
    getUserById: typeof getUserById;
    createUser: typeof createUser;
    getUserByLogin: typeof getUserByLogin;
    getUserWithRoles: typeof getUserWithRoles;
};
export {};
//# sourceMappingURL=userService.d.ts.map