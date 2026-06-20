"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const db_1 = __importDefault(require("../db"));
async function getUsers() {
    const result = await (0, db_1.default)('SELECT * FROM users');
    return result.rows;
}
async function getUserById(id) {
    const result = await (0, db_1.default)('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}
// Create new user
async function createUser(name, email) {
    const res = await (0, db_1.default)('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    return res.rows[0]; // Return the newly created user object
}
exports.userService = {
    getUsers,
    getUserById,
    createUser
};
//# sourceMappingURL=userService.js.map