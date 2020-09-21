const express = require('express')
const router = express.Router()
// const sequelize = new Sequelize('mysql://root:@localhost/crm')
const Sequelize = require('sequelize')
require('dotenv').config()
const {
    DB_URL,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_PORT
} = process.env

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS,
    {
        host: DB_URL,
        port: DB_PORT,
        logging: console.log,
        maxConcurrentQueries: 100,
        dialect: 'mysql',
        dialectOptions: {
            ssl: 'Amazon RDS'
        },
        pool: { maxConnections: 5, maxIdleTime: 30 },
        language: 'en',
    }
)


router.get('/clients', async function (req, res) {
    if (req.query.field!=='' && req.query.input!=='') {
        const costumers = await sequelize.query(
            `SELECT *
             FROM costumers
             Where ${req.query.field} LIKE "%${req.query.input}%"`
        )
        if (costumers) res.send(costumers[0])
        else res.send('err')

    } else {
        const costumers = await sequelize.query(
            `SELECT * FROM costumers`
        )
        if (costumers) res.send(costumers[0])
        else res.send('err')
    }
})

router.get('/hottestCountry', async function (req, res) {
    const hottest = await sequelize.query(
        `SELECT country, COUNT(country) AS counted
        FROM   costumers
        GROUP  BY country
        ORDER  BY counted DESC, country 
        LIMIT  1`
    )
    if (hottest) res.send(hottest[0][0].country)
    else res.send('err')
})

router.get('/topEmployee/:year', async function (req, res) {
    const { year } = req.params
    const topEmp = await sequelize.query(
        `SELECT MAX(owner) AS employee, COUNT(owner) AS costumers
        FROM   costumers
        WHERE costumers.firstContact LIKE '%${year}%'
        GROUP  BY owner
        ORDER BY costumers DESC
        LIMIT  5`
    )
    if (topEmp) res.send(topEmp[0])
    else res.send('err')
})

router.get('/topSalesCountry/:year', async function (req, res) {
    const { year } = req.params
    const topCountry = await sequelize.query(
        `SELECT MAX(country) AS country, COUNT(country) AS sales
        FROM costumers
        WHERE costumers.firstContact LIKE '%${year}%'
        GROUP BY country
        ORDER BY country DESC
        LIMIT  5`
    )
    if (topCountry) res.send(topCountry[0])
    else res.send('err')
})

router.get('/salesByLastMonth', async function (req, res) {
    const salesByMonth = await sequelize.query(
        `SELECT COUNT(name) AS sales, firstContact AS month
        FROM costumers
        WHERE costumers.firstContact LIKE '%2020%'
        AND costumers.firstContact LIKE '%.09.%'
        GROUP BY month
        ORDER BY month DESC`
    )
    if (salesByMonth) res.send(salesByMonth[0])
    else res.send('err')
})


router.get('/aquisition', async function (req, res) {
    const hottest = await sequelize.query(
        `SELECT country, COUNT(country) AS counted
        FROM   costumers
        GROUP  BY country
        ORDER  BY counted DESC, country 
        LIMIT  1`
    )
    if (hottest) res.send(hottest[0][0].country)
    else res.send('err')
})

router.post('/client', async function (req, res) {
    const {
        name,
        email,
        firstContact,
        emailType,
        sold,
        owner,
        country
    } = req.body
    const costumer = await sequelize.query(`INSERT INTO costumers VALUES(
                                                      null,
                                                      '${name}',
                                                      '${email}',
                                                      '${firstContact}',
                                                      '${emailType}',
                                                      '${sold}',
                                                      '${owner}',
                                                      '${country}'
                                                      )`)
    if (costumer) res.send(true)
    else res.send(false)
})

router.put('/client', async function (req, res) {
    const { id, field, value } = req.body
    const costumer = await sequelize.query(
        `UPDATE costumers
        SET ${field} = '${value}'
        WHERE costumers._id = ${id}`
    )
    if (costumer) res.send(true)
    else res.send(false)
})

router.delete('/client/:id', async function (req, res) {
    const id = (req.params.id)
    const costumer = await sequelize.query(
        `DELETE FROM costumers WHERE costumers._id = ${id}`
    )
    if (costumer) res.send(true)
    else res.send(false)
})
  
module.exports = router


