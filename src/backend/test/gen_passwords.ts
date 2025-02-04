import bcrypt from 'bcrypt';

const password = 'password';
// hash the password
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);