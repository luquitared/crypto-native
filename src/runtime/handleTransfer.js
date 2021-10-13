import * as opensea from '../lib/opensea.mjs'
import { sample } from 'lodash-es'
import db from '../lib/setDB.mjs'
import * as cron from 'cron'
import { mint, getById } from '../lib/mongo.mjs'

async function handleTransfer() {
    try {
        let transfers = await opensea.fetchTransfers()
        console.log(transfers.length)

        if (transfers.length != 0) {

            if (transfers.length != 0) {
                for (var i = 0; i < transfers.length; i++) {

                    //check minted to see if token has not already been minted
                    let tokenCheck = await getById(transfers[i].token_id)
                    if (tokenCheck == null) {
                        console.log(transfers[i].token_id)
                        transfers[i].phaseID = 1 // start the phase process

                        let randomStyle = sample(db.data.styles)
                        transfers[i].style = randomStyle.name // assign random style to the token
                        if (transfers[i].num_sales != 0) {
                            // officially save to mongodb db
                            await mint(transfers[i].token_id, transfers[i].phaseID)
                        }

                    }

                }
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

var cronTime = "*/15 * * * * *"

export const transfer = new cron.CronJob({
    cronTime,
    onTick: async () => {
        // console.log('running transfer')
        if (transfer.taskRunning) {
            return
        }

        transfer.taskRunning = true
        try {
            await handleTransfer()
        } catch (err) {
            console.log(err)
        }
        transfer.taskRunning = false
    },
    timeZone: 'UTC'
})
