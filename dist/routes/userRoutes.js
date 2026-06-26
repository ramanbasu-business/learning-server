"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// learning-server/routes/userRoutes
const userService_1 = require("../services/userService");
const express_1 = __importDefault(require("express"));
const userRouters = express_1.default.Router();
// GET /api/users
userRouters.get('/', async (request, response) => {
    try {
        const users = await userService_1.userService.getUsers();
        return response.json(users);
    }
    catch (err) {
        console.error(err);
        return response.status(500).json({ error: "Failed to fetch users", err });
    }
});
userRouters.post("/auth", async (request, response) => {
    try {
        const { username, password } = request.body;
        if (!username || !password) {
            return response.status(400).json({ error: "Username and password are required" });
        }
        const user = await userService_1.userService.getUserByLogin(username, password);
        if (!user) {
            return response.status(401).json({ error: "Invalid username or password" });
        }
        return response.json({ status: true, message: "Login successful", user });
    }
    catch (err) {
        console.error(err);
        return response.status(500).json({ error: "Authentication failed", err });
    }
});
exports.default = userRouters;
//# sourceMappingURL=userRoutes.js.map