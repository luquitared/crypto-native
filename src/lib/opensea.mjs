import fetch from 'node-fetch';
import db from '../lib/setDB.mjs'
import { Asset, Transfer } from '../models/asset.mjs'
import dotenv from 'dotenv'
dotenv.config()

let options
if (process.env.NODE_ENV === 'production') {
    options = { method: 'GET', headers: { Accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_KEY } };
}
else {
    options = { method: 'GET', headers: { Accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_KEY_TEST } };
}

export async function getAssetSales(tokenID) {
    let uurl = null
    if (process.env.NODE_ENV === 'production') {
        uurl = new URL('https://api.opensea.io/api/v1/asset/' + db.data.contractAddress + '/' + tokenID)
    }
    else {
        uurl = new URL('https://api.opensea.io/api/v1/asset/' + db.data.contractAddressTest + '/' + tokenID)
    }

    let token = { token_id: null, num_sales: null }

    try {
        const response = await fetch(uurl, options);
        const data = await response.json();
        token.token_id = data.token_id
        token.num_sales = data.num_sales
        return token
    } catch (error) {
        console.log(error)
        console.log('get asset failed. could be getting blocked by opensea api. here is response object (instead of jsonifyed obj): ')
        console.log(response)
    }
}

export async function fetchTransactions() {
    let successful_asset_events = []
    let uurl = null
    var params = new URLSearchParams()
    if (process.env.NODE_ENV === 'production') {
        params.append('asset_contract_address', db.data.contractAddress)
        uurl = new URL(db.data.openSeaAPI)
    }
    else {
        params.append('asset_contract_address', db.data.contractAddressTest)
        uurl = new URL(db.data.openSeaAPITest)
    }
    params.append('only_opensea', 'false')
    params.append('limit', '100')
    params.append('event_type', 'successful')

    uurl.search = params.toString()

    try {
        const response = await fetch(uurl, options);
        const data = await response.json();
        console.log(uurl.href)

        if (data.asset_events.length != 0) {

            for (var i = 0; i < data.asset_events.length; i++) {
                let asset_event = data.asset_events[i]

                if (asset_event.asset != null) {
                    let asset = new Asset(
                        'successful',
                        asset_event.asset.token_id,
                        asset_event.total_price,
                        asset_event.transaction.timestamp
                    )
                    successful_asset_events.push(asset)
                }
            }
        }

    } catch (err) {
        console.error('error:', err);
        console.log(response)
    }

    db.data.pollTransact = Date.now() //update the time for last polled
    await db.write()
    return successful_asset_events;
}

// Poll to find all *mint* events
export async function fetchTransfers() {
    let transfer_events = []
    let uurl = null
    let params = new URLSearchParams()
    if (process.env.NODE_ENV === 'production') {
        params.append('asset_contract_address', db.data.contractAddress)
        uurl = new URL(db.data.openSeaAPI)
    }
    else {
        params.append('asset_contract_address', db.data.contractAddressTest)
        uurl = new URL(db.data.openSeaAPITest)
    }
    params.append('only_opensea', 'false')
    params.append('limit', '50')
    params.append('event_type', 'transfer')

    uurl.search = params.toString()

    try {
        const response = await fetch(uurl, options);
        const data = await response.json();
        console.log(uurl.href)

        if (data.asset_events.length != 0) {
            // ensure that objects in asset events have the key 'total_price' to make sure event happened on opensea
            transfer_events = data.asset_events.filter(ev => "asset" in ev)
                // huge number is starting price in wei to evolve to phase 2 for our nft 200000000000000000
                .map(asset => new Transfer(
                    'transfer',
                    asset.asset.token_id,
                    asset.asset.num_sales,
                    asset.asset.asset_contract.created_date,
                    db.data.mintPrice));
        }
    } catch (err) {
        console.error('error:', err);
        console.log(response)
    }
    db.data.pollTransfer = Date.now() //update the time for last polled
    await db.write()
    return transfer_events;
}