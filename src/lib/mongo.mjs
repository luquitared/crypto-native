import mongoose from 'mongoose'
mongoose.set('useFindAndModify', false);
import { findIndex } from 'lodash-es'
import db from '../lib/setDB.mjs'
import { nftImage } from '../models/nft.mjs'
import { styleCount } from '../models/count.mjs'
import { sample } from 'lodash-es'

export async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
        console.log(error)
    }
}

async function assignStyle() {
    if (await styleCount.estimatedDocumentCount() == 0) {
        let setupStyles = {
            digital: 0,
            landscape: 0,
            abstract: 0
        }
        new styleCount(setupStyles).save()
    }
    else {
        let counts = await styleCount.findOne().exec();
        while (true) {
            let randomStyle = sample(db.data.styles)
            if (randomStyle == 'digital' && counts.digital <= 400) {
                return 'digital'
            }
            else if (randomStyle == 'landscape' && counts.landscape < 200) {
                return 'landscape'
            }
            else if (randomStyle == 'abstract' && counts.abstract < 300) {
                return 'abstract'
            }
            else {
                if (counts.digital >= 400 && counts.landscape >= 200 && counts.abstract >= 300) {
                    console.log('styles are full. no images left to mint.')
                    break
                }
            }
        }
    }
}

function getTier(token_amount) {
    let tier = ''

    if (token_amount < 50) {
        tier = 'Airdrop'
    }
    else if ((token_amount >= 50) && (token_amount <= 59)) {
        tier = 'Auction'
    }
    else if ((token_amount >= 60) && (token_amount <= 979)) {
        tier = 'Mint'
    }
    else {
        tier = 'Vote'
    }
    var result = { trait_type: "tier", value: tier }
    return result
}

function isRare() {
    let value = ''
    var rand = Math.floor(Math.random() * 1001);

    if (rand == 1) {
        value = 'Artificial Imagination'
    }
    else if (rand >= 2 && rand <= 76) {
        value = 'Deep Hallucination'
    }
    else if (rand >= 77 && rand <= 79) {
        value = 'Mirage'
    }
    else if (rand >= 80 && rand <= 90) {
        value = 'Synthetic Intelligence'
    }
    else if (rand >= 81 && rand <= 86) {
        value = 'Sentient Creation'
    }
    else if (rand >= 87 && rand <= 136) {
        value = 'Digital Consciousness'
    }
    else if (rand >= 137 && rand <= 148) {
        value = 'Vivid Memory'
    }
    else {
        value = 'none'
    }
    return value
}

export async function mint(tokenID, phaseID) {

    let keyString = db.data.URL + '/nfts/image/' + tokenID + '/' + phaseID
    let attributes = [{ trait_type: "style", value: '' }, { trait_type: "status", value: 'evolving' }, { trait_type: "phase", value: 1 }, { trait_type: "title", value: "default" }]
    attributes[0].value = await assignStyle() // set the style trait

    // get the current tier and add that as an attribute
    let tier = getTier(tokenID)
    attributes.push(tier)

    var rareAttribute = isRare()
    attributes.push({ trait_type: "bonus", value: rareAttribute })

    const newNFT = new nftImage({
        _id: tokenID,
        name: tokenID,
        attributes: attributes,
        image: keyString,
        phaseID: 1,
        maxPrice: db.data.mintPrice
    })

    newNFT.save(function (err) {
        if (err) console.log(err)
        else console.log("saved!")
    });
}

export async function evolve(token, maxPrice) {
    let newPhase = parseInt(token.phaseID) + 1
    let imageURL = db.data.URL + '/nfts/image/' + token._id + '/' + newPhase
    let payload = {}
    if (token.phaseID < db.data.lockEvolve) {
        if (token.phaseID == db.data.lockEvolve - 1) {
            let indexOfStatusAttribute = findIndex(token.attributes, ['trait_type', 'status'])
            token.attributes[indexOfStatusAttribute].value = 'complete'
            token.maxPrice = maxPrice
            token.phaseID = newPhase
            token.image = imageURL
            payload = token
        }
        else {
            // if there is a rare attribute for this token, add it to the attributes
            let indexOfRareToken = findIndex(db.data.rares, ['token', token._id])
            if (indexOfRareToken != -1) {
                let rareAttribute = db.data.rares[indexOfRareToken].value
                token.attributes.push(rareAttribute)
            }
            payload = { "image": imageURL, "phaseID": newPhase, "maxPrice": maxPrice }
        }

        let evolution = nftImage.findByIdAndUpdate(
            token._id,
            payload,
            function (err, result) {
                if (err) {
                    console.log(err)
                    return null
                }
                else {
                    return result
                }
            })
        return evolution
    }
    else {
        // console.log('token: ' + token._id + ' tried to evolve. this was stopped because minting is locked at: ' + db.data.lockEvolve)
    }
    return null
}


export async function stop() {
    await mongoose.connection.close()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getById(id) {
    try {
        var result = await nftImage.findById(id)
        return result
    }
    catch (error) {
        console.log(error)
        return null
    }
}
