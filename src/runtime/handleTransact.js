import * as opensea from '../lib/opensea.mjs'
import { evolve, getById } from '../lib/mongo.mjs'
import Units from 'ethereumjs-units'
import * as cron from 'cron'

async function handleTransaction() {
    try {
        let transactions = await opensea.fetchTransactions()
        //console.log(transactions)

        if (transactions.length != 0) {
            for (var i = 0; i < transactions.length; i++) {

                // get index of token to get full object with price data
                let token = await getById(transactions[i].token_id)

                // if a token is found...
                if (token != null) {
                    console.log(token._id)
                    let lastSoldPrice = Units.convert(transactions[i].total_price, 'wei', 'eth')
                    let max_price = Units.convert(token.maxPrice, 'wei', 'eth')
                    if (lastSoldPrice > max_price) {

                        let floor = (max_price * 1.2)

                        // console.log('new evolution request for token:')
                        // console.log(token)
                        // console.log('last sold: ' + lastSoldPrice)
                        console.log('max price: ' + max_price)
                        console.log('last sold: ' + lastSoldPrice)
                        console.log('must be higher price than: ' + floor)
                        
                        if (parseFloat(lastSoldPrice) >= parseFloat(floor)) {

                            // update the DB with the new token and update the max price in WEI (we use transactions object on purpose)
                            // let evolution = await evolve(token, transactions[i].total_price)
                            let evolution = null
                            if (token._id > 49 && token._id < 60) {
                                if (transactions[i].num_sales > 1) {
                                    evolution = await evolve(token, transactions[i].total_price)
                                }
                            }
                            else {
                                evolution = await evolve(token, transactions[i].total_price)
                            }
                            if (evolution != null) {
                                console.log('evolved a new piece for token: ' + token._id)
                            }

                        }
                    }
                }
            }
        }
    }
    catch (error) {
        console.log("error: " + error)
    }

}

var cronTime = "*/8 * * * * *"

export const transact = new cron.CronJob({
    cronTime,
    onTick: async () => {
        // console.log('running transact')
        if (transact.taskRunning) {
            return
        }

        transact.taskRunning = true
        try {
            await handleTransaction()
        } catch (err) {
            console.log(err)
        }
        transact.taskRunning = false
    },
    timeZone: 'UTC'
})

