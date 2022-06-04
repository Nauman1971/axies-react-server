const express = require('express')
const cors = require('cors');

const app = express();
app.use(cors());
const Sequelize = require('sequelize')
const port = 4000;

const sequelize = new Sequelize('postgres://tsdbadmin:Scalenft2022@ysrthz9wti.tgzf38hxeq.tsdb.cloud.timescale.com:31286/tsdb',
    {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })

app.use(express.json());

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

app.get('/', async function (req, res) {
    const [results, metadata] = await sequelize.query(`
        SELECT collections.name,collections.details ->> 'image_url' as image_url, collections.url , sum(nft_sales.quantity)
        FROM collections
        INNER JOIN nft_sales ON collections.id = nft_sales.collection_id
        WHERE payment_symbol = 'ETH'
        group by collections.id
        order by sum(nft_sales.quantity) desc
        limit 10
    `);
    return res.json(results);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

