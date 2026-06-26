import { coreApiClient } from '../clients/coreApiClient';
import { UserDto, UserResponse, RoleResponse } from '../types/dtos';

async function getUsers(): Promise<UserDto[]> {
    const users = await coreApiClient.get<UserResponse[]>('/api/users');
    return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: []
    }));
}

async function getUserByLogin(username: string, password: string): Promise<UserDto | null> {
    try {
        const user = await coreApiClient.post<UserResponse>('/api/users/auth', {
            username,
            password
        });

        if (!user) {
            return null;
        }

        const userWithRoles = await getUserWithRoles(user.id);
        return userWithRoles;
    } catch (err) {
        console.error(`Error during login: ${err}`);
        return null;
    }
}

async function getUserById(id: string): Promise<UserDto | null> {
    try {
        const userWithRoles = await getUserWithRoles(id);
        return userWithRoles;
    } catch (err) {
        console.error(`Error fetching user: ${err}`);
        return null;
    }
}

async function getUserWithRoles(userId: string): Promise<UserDto> {
    const [user, roles] = await Promise.all([
        coreApiClient.get<UserResponse>(`/api/users/${userId}`),
        coreApiClient.get<RoleResponse[]>(`/api/users/${userId}/roles`)
    ]);

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: roles.map(r => r.name)
    };
}

async function createUser(username: string, email: string, password: string): Promise<UserDto> {
    const user = await coreApiClient.post<UserResponse>('/api/users', {
        username,
        email,
        password
    });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: []
    };
}

export const userService = {
    getUsers,
    getUserById,
    createUser,
    getUserByLogin,
    getUserWithRoles
};
