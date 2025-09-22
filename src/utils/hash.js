import { genSaltSync, hashSync, compareSync } from "bcrypt";

const createHash = (password) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
}

const isValidPassword = (reqPass, dbPass) => {
    return compareSync(reqPass, dbPass);
}

export { createHash, isValidPassword };