import { AuthRepository } from "../repositories";
import { User } from "../entities";

export default class SignIn {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<User | null> {
    return await this.authRepo.signIn(email, password);
  }
}
