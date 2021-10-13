import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= {
    pollTransfer: null, 
    pollTransact: null, 
    styles: ["digital", "landscape", "abstract"],
    mintPrice: "166666666660000000",
    URL: "your metadata URL, set this in contracts/contract.sol",
    contractAddress: "contract address",
    contractAddressTest: "rinkeby contract address",
    openSeaAPI: "https://api.opensea.io/api/v1/events",
    openSeaAPITest: "https://rinkeby-api.opensea.io/api/v1/events",
    lockEvolve: 10
}

// Write db.data content to db.json
await db.write()

export default db