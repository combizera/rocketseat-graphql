import { User } from "../../generated/prisma/client";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { prismaClient } from "../libs/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";

export class AuthService {
  async login (data: LoginInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })
    if(!existingUser) throw new Error('User not found')

    const compare = await comparePassword(data.password, existingUser.password)
    if(!compare) throw new Error('Invalid credentials')

    return this.generateTokens(existingUser)
  }

  async register (data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })

    if(existingUser) throw new Error('User already exists')

    const hash = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash
      }
    })

    return this.generateTokens(user)
  }

  generateTokens(user: User){
    const token = signJwt({
      id: user.id,
      email: user.email
    },'15m')

    const refreshToken = signJwt({
      id: user.id,
      email: user.email
    },'7d')

    return { token, refreshToken, user }
  }
}