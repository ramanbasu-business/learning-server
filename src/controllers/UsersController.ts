import { Body, Controller, Get, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import type { UserDto } from '../types/dtos';
import { userService } from '../services/userService';
import { ApiError } from '../errors/ApiError';

interface LoginRequestBody {
    username: string;
    password: string;
}

interface LoginSuccessResponse {
    status: true;
    message: string;
    user: UserDto;
}

interface ErrorResponse {
    error: string;
}

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    @Get()
    @SuccessResponse(200, 'OK')
    @Response<ErrorResponse>(500, 'Failed to fetch users')
    public async getUsers(): Promise<UserDto[]> {
        return userService.getUsers();
    }

    @Post('auth')
    @SuccessResponse(200, 'Login successful')
    @Response<ErrorResponse>(400, 'Username and password are required')
    @Response<ErrorResponse>(401, 'Invalid username or password')
    @Response<ErrorResponse>(500, 'Authentication failed')
    public async login(@Body() body: LoginRequestBody): Promise<LoginSuccessResponse> {
        const { username, password } = body;

        const user = await userService.getUserByLogin(username, password);

        if (!user) {
            throw new ApiError(401, 'Invalid username or password');
        }

        return { status: true, message: 'Login successful', user };
    }
}
