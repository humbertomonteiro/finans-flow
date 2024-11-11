import { User } from "../entities";

export default interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  signIn(email: string, password: string): Promise<User | null>;
  signUp(name: string, email: string, password: string): Promise<User>;
  logOut(): Promise<void>;
}
