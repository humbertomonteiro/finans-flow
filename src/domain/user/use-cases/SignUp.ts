import { AuthRepository } from "../repositories";
import { User } from "../entities";

export default class SignUp {
  constructor(private authRepo: AuthRepository) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    return await this.authRepo.signUp(name, email, password);
  }
}
