import { Arg, Mutation, Resolver } from "type-graphql";
import { IdeaModel } from "../models/idea.model";
import { CreateIdeaInput } from "../dtos/input/idea.input";

@Resolver(() => IdeaModel)
export class IdeaResolver {
  @Mutation(() => IdeaModel)
  async createIdea(
    @Arg('data', () => CreateIdeaInput) data: CreateIdeaInput
  ): Promise<IdeaModel> {
    return this.ideaService.createIdea(data);
  }
}