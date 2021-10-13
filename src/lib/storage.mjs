import AWS from "aws-sdk"
let s3 = new AWS.S3();
import db from '../lib/setDB.mjs'

await db.read()

AWS.config.update({
    region: 'us-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export async function getImage(nft, tokenID, style, imageID, phaseID) {
    console.log(nft)
    console.log(phaseID)
    console.log(nft.phaseID)
    if (nft != null) {
        // ensure that token has been minted and is on that particular phase
        if (nft.phaseID == phaseID) {

            let keyString = ''

            keyString = 'crypto_native_onefolder/' + phaseID + '_' + style + '_' + imageID + '.png'
            

            console.log(keyString)

            try {
                const data = s3.getObject(
                    {
                        Bucket: 'crypto-native-all',
                        Key: keyString
                    }

                ).promise();
                return data
            }
            catch (error) {
                console.log(error)
                // log keystring
            }
            return null
        }
        else {
            return null
        }
    }
    return null
}

function encode(data) {
    let buf = Buffer.from(data);
    let base64 = buf.toString('base64');
    return base64
}