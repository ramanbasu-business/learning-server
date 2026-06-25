import { exec } from 'child_process';
import executeQuery from '../db';
import bcrypt from 'bcryptjs';

// Define a type for your table
interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_on: Date;
}

async function getUsers(): Promise<User[]> {
    const result = await executeQuery<User>('SELECT * FROM public.users');
    return result.rows;
}

// Login authentication
async function getUserByLogin(username: string, password: string): Promise<User | null> {
    
    let user: User | null = null;

    try {
        const result = await executeQuery<User>('SELECT * FROM public.users WHERE email = $1',
            [username]
        );

        console.log('user found for:', username);  // add this

        if (!result || !result.rows.length) {
            console.log('No user found for:', username);  // add this
            return null;
        }

        user = result.rows[0];
        const password_hash = String(user["password_hash"]);

        const isValid = bcrypt.compareSync(password, password_hash);
        console.log(`isValid Login  -> ${isValid}`);
        if (!isValid)
            return null;
        
    } catch (err) {
        console.log(`Error Login: ${err}`);
    }

    console.log('user', user);  // add this
    return user;
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
    createUser,
    getUserByLogin
};
