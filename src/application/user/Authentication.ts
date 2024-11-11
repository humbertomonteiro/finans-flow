import { GetCurrentUser, SignIn, SignUp, LogOut, User } from "@/domain";
import { FirebaseAuthRepository } from "@/infrastructure";

export default class Authentication {
  private getCurrentUser: GetCurrentUser;
  private signIn: SignIn;
  private signUp: SignUp;
  private logOut: LogOut;

  constructor() {
    const authRepository = new FirebaseAuthRepository();

    this.getCurrentUser = new GetCurrentUser(authRepository);
    this.signIn = new SignIn(authRepository);
    this.signUp = new SignUp(authRepository);
    this.logOut = new LogOut(authRepository);
  }

  async getUser(): Promise<User | null> {
    const user = await this.getCurrentUser.execute();
    return user;
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.signIn.execute(email, password);

    return user;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const user = await this.signUp.execute(name, email, password);

    return user;
  }

  async logout(): Promise<void> {
    await this.logOut.execute();
  }
}
