import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        // Email in use?
        const users = await this.usersService.find(email)
        if (users.length) throw new BadRequestException('Email already in use.')
        // Hash password:
        // 1.Salt
        const salt = randomBytes(8).toString('hex')
        // 2.Hash salt and password
        const hash = (await scrypt(password, salt, 32)) as Buffer
        // 3.Join the hashed result and salt together
        const result = `${salt}.${hash.toString('hex')}`
        // Create a new user and save it

        // Return user
    }

    signin() { }
}