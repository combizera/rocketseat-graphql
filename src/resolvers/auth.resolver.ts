import { Arg, Mutation, Resolver } from 'type-graphql';
import { RegisterInput } from '../dtos/input/auth.input';

@Resolver()
export class AuthResolver {

  @Mutation()
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterInput> {
    
  }
}