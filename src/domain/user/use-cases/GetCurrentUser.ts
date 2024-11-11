import { AuthRepository } from "../repositories";

export default class GetCurrentUser {
  constructor(private authRepo: AuthRepository) {}
  async execute() {
    return await this.authRepo.getCurrentUser();
  }
}
