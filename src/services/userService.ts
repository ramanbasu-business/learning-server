import executeQuery from '../db';

// Define a type for your table
interface User {
    id: number;
    name: string;
    email: string;
}

async function getUsers(): Promise<User[]> {
    const result = await executeQuery<User>('SELECT * FROM users');
    return result.rows;
}

async function getUserById(id: number) {
    const result = await executeQuery<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

// Create new user
async function createUser(name:string, email:string) {
    const res = await executeQuery<User>(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
    );

    return res.rows[0]; // Return the newly created user object
}

export const userService = {
    getUsers,
    getUserById,
    createUser
};
