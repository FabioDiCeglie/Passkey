const { Sequelize } = require('sequelize')

const initDb = () => {
    const dbName = process.env.PGDATABASE
    const dbUsername = process.env.PGUSER
    const dbPassword = process.env.PGPASSWORD
    const dbHost = process.env.PGHOST
    const dbPort = process.env.PGPORT
    
    return new Sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
    })
}

module.exports = initDb()