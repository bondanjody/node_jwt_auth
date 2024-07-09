import { Sequelize } from "sequelize";

const db = new Sequelize('jwt_auth_db', 'root', '.ManCity1894.', { host: 'localhost', dialect: 'mysql' })

export default db