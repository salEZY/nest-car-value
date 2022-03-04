import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        // Email in use?
        const users = await this.usersService.find(email)
        if (users.length) throw new BadRequestException('Email already in use.')
        // Hash password

        // Create a new user and save it

        // Return user
    }

    signin() { }
}