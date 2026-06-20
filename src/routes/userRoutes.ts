// learning-server/routes/userRoutes
import { userService } from '../services/userService'
import express from "express";


const userRouters = express.Router();

// GET /api/users
userRouters.get('/', async (request, response) => {
    try {
        const users = await userService.getUsers();  // ✅ await
        return response.json(users);                 // ✅ pass users
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Failed to fetch users", err });
    }

    return null;
});

export default userRouters;
