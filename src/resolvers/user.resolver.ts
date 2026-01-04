import { Arg, Query, Resolver } from "type-graphql";
import { UserModel } from "../models/user.model";
import { userService } from "../services/user.service";

@Resolver(() => UserModel) 
export class UserResolver {
  private userService = new userService();


  @Query(() => UserModel)
  async getUser(
    @Arg('id', () => String) id: string
  ): Promise<UserModel> {
    return this.userService.findUser(id);
  }
}