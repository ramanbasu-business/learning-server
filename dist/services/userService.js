"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function getUsers() {
    const result = await (0, db_1.default)('SELECT * FROM public.users');
    return result.rows;
}
// Login authentication
async function getUserByLogin(username, password) {
    let user = null;
    try {
        const result = await (0, db_1.default)('SELECT * FROM public.users WHERE email = $1', [username]);
        console.log('user found for:', username); // add this
        if (!result || !result.rows.length) {
            console.log('No user found for:', username); // add this
            return null;
        }
        user = result.rows[0];
        const password_hash = String(user["password_hash"]);
        const isValid = bcryptjs_1.default.compareSync(password, password_hash);
        console.log(`isValid Login  -> ${isValid}`);
        if (!isValid)
            return null;
    }
    catch (err) {
        console.log(`Error Login: ${err}`);
    }
    console.log('user', user); // add this
    return user;
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
    createUser,
    getUserByLogin
};
//# sourceMappingURL=userService.js.map