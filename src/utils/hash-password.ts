import config from "config";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRound = config.get<number>("saltWorkFactor");

  const salt = await bcrypt.genSalt(Number(saltRound));

  return await bcrypt.hash(password, salt);
};
