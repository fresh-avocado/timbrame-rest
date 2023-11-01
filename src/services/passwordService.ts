import { SALT_ROUNDS } from "src/utils/constants";
import { compare, hash } from "bcrypt";

class PasswordService {
  async hashPassword(password: string) {
    return await hash(password, SALT_ROUNDS);
  }
  async isSamePassword(plaintextPassword: string, hashedPassword: string) {
    return await compare(plaintextPassword, hashedPassword);
  }
}

export default new PasswordService()
