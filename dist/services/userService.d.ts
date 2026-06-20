interface User {
    id: number;
    name: string;
    email: string;
}
declare function getUsers(): Promise<User[]>;
declare function getUserById(id: number): Promise<User>;
declare function createUser(name: string, email: string): Promise<User>;
export declare const userService: {
    getUsers: typeof getUsers;
    getUserById: typeof getUserById;
    createUser: typeof createUser;
};
export {};
//# sourceMappingURL=userService.d.ts.map