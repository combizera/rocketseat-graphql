import { CreateIdeaInput } from "../dtos/input/idea.input";
import { prismaClient } from "../libs/prisma";

export class IdeaService {
   async createIdea(data: CreateIdeaInput, authorId: string) {
    return prismaClient.idea.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: authorId,
      },
    })
  }
}