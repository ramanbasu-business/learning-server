"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const coreApiClient_1 = require("../clients/coreApiClient");
async function getUsers() {
    const users = await coreApiClient_1.coreApiClient.get('/api/users');
    return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles: []
    }));
}
async function getUserByLogin(username, password) {
    try {
        const user = await coreApiClient_1.coreApiClient.post('/api/users/auth', {
            username,
            password
        });
        if (!user) {
            return null;
        }
        const userWithRoles = await getUserWithRoles(user.id);
        return userWithRoles;
    }
    catch (err) {
        console.error(`Error during login: ${err}`);
        return null;
    }
}
async function getUserById(id) {
    try {
        const userWithRoles = await getUserWithRoles(id);
        return userWithRoles;
    }
    catch (err) {
        console.error(`Error fetching user: ${err}`);
        return null;
    }
}
async function getUserWithRoles(userId) {
    const [user, roles] = await Promise.all([
        coreApiClient_1.coreApiClient.get(`/api/users/${userId}`),
        coreApiClient_1.coreApiClient.get(`/api/users/${userId}/roles`)
    ]);
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        roles
    };
}
async function createUser(username, email, password) {
    const user = await coreApiClient_1.coreApiClient.post('/api/users', {
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
exports.userService = {
    getUsers,
    getUserById,
    createUser,
    getUserByLogin,
    getUserWithRoles
};
//# sourceMappingURL=userService.js.map