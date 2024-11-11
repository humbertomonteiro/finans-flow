import { AuthRepository } from "../repositories";

export default class LogOut {
  constructor(private authRepo: AuthRepository) {}
  async execute() {
    return await this.authRepo.logOut();
  }
}
