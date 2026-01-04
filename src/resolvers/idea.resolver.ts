import { Arg, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { IdeaModel } from "../models/idea.model";
import { CreateIdeaInput, UpdateIdeaInput } from "../dtos/input/idea.input";
import { IdeaService } from "../services/idea.service";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { IsAuth } from "../middlewares/auth.middleware";
import { userService } from "../services/user.service";
import { UserModel } from "../models/user.model";

@Resolver(() => IdeaModel)
@UseMiddleware(IsAuth)
export class IdeaResolver {
  private ideaService = new IdeaService();
  private userService = new userService();

  @Mutation(() => IdeaModel)
  async createIdea(
    @Arg('data', () => CreateIdeaInput) data: CreateIdeaInput,
    @GqlUser() user: UserModel
  ): Promise<IdeaModel> {
    return this.ideaService.createIdea(data, user.id);
  }

  @Mutation(() => IdeaModel)
  async updateIdea(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateIdeaInput) data: UpdateIdeaInput,
  ): Promise<IdeaModel> {
    return this.ideaService.updateIdea(id, data);
  }

  @FieldResolver(() => UserModel)
  async author(@Root() idea: IdeaModel): Promise<UserModel> {
    return this.userService.findUser(idea.authorId);
  }
}