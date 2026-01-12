import { Arg, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { VoteModel } from "../models/vote.model";
import { VoteService } from "../services/vote.service";
import { UserModel } from "../models/user.model";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { promises } from "node:dns";
import { IdeaService } from "../services/idea.service";
import { IdeaModel } from "../models/idea.model";
import { UserService } from "../services/user.service";

@Resolver(() => VoteModel)
export class VoteResolver {
  private voteService = new VoteService();
  private ideaService = new IdeaService();
  private userService = new UserService();

  @Mutation(() => Boolean)
  async toggleVote(
    @Arg('ideaId', () => String) ideaId: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    return this.voteService.toggleVote(user.id, ideaId);
  }

  @FieldResolver(() => IdeaModel)
  async idea(
    @Root() vote: VoteModel
  ): Promise<IdeaModel> {
    return this.ideaService.findIdeaById(vote.ideaId);
  }

  @FieldResolver(() => UserModel)
  async user(
    @Root() vote: VoteModel
  ): Promise<UserModel> {
    return this.userService.findUser(vote.userId);
  }
}