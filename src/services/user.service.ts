import { CreateUserInput } from "../dtos/input/user.input";
import { prismaClient } from "../libs/prisma";

export class userService {
  async createUser(data: CreateUserInput) {
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (findUser) throw new Error("User already exists");

    return prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email
      }
    })
  }

  async findUser(id: string){
    const user = await prismaClient.user.findUnique({
      where: { id }
    })

    if (!user) throw new Error("User not found");
    
    return user;
  }
}