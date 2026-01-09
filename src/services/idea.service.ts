import { CreateIdeaInput, UpdateIdeaInput } from "../dtos/input/idea.input";
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

  async listIdeas() {
    return prismaClient.idea.findMany();
  }

  async deleteIdea(id: string) {
    const findIdea = await prismaClient.idea.findUnique({
      where: {
        id,
      }
    })

    if(!findIdea) throw new Error("Idea not found");

    return prismaClient.idea.delete({
      where: {
        id,
      }
    })
  }

  async updateIdea(id: string, data: UpdateIdeaInput) {
    const idea = await prismaClient.idea.findUnique({
      where: {
        id: id
      }
    })

    if (!idea) throw new Error("Idea not found");

    return prismaClient.idea.update({
      where: {
        id: id
      },
      data: {
        title: data.title,
        description: data.description,
      }
    })
  }
}