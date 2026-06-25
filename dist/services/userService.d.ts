interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_on: Date;
}
declare function getUsers(): Promise<User[]>;
declare function getUserByLogin(username: string, password: string): Promise<User | null>;
declare function getUserById(id: number): Promise<User>;
declare function createUser(name: string, email: string): Promise<User>;
export declare const userService: {
    getUsers: typeof getUsers;
    getUserById: typeof getUserById;
    createUser: typeof createUser;
    getUserByLogin: typeof getUserByLogin;
};
export {};
//# sourceMappingURL=userService.d.ts.map