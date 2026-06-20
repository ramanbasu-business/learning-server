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
        const users = await userService_1.userService.getUsers(); // ✅ await
        return response.json(users); // ✅ pass users
    }
    catch (err) {
        console.error(err);
        response.status(500).json({ error: "Failed to fetch users", err });
    }
    return null;
});
exports.default = userRouters;
//# sourceMappingURL=userRoutes.js.map