# Build an evolving and dynamic NFT Drop
<p align="center">
    <img width="100%" src="https://github.com/luquitared/crypto-native/blob/master/images/grid_4k.jpg"/>
</p>

[![Website](https://img.shields.io/badge/website-black)](https://www.miragegallery.ai/)
[![OpenSea](https://img.shields.io/badge/OpenSea-View-blue)](https://opensea.io/collection/crypto-native)
[![Discord](https://img.shields.io/badge/discord-join-blued)](https://discord.gg/taQbpr7HtN)
![Twitter](https://img.shields.io/twitter/follow/miragegalleryai?style=social)

How exactly? With Crypto-Native, Minted NFT images evolve everytime a secondary sale happens on OpenSea when the price is 20% higher than the max price sold for that particular pieces history.

## 😎 Get Started

Make sure you are on the latest version of Node.js. Your Node version must be >= v16.6.2

1. Install node packages
``` bash
yarn install
```

2. Create an env file
- Copy the env.example file and name it .env
- Crypto-Native uses a MongoDB database to keep track of token metadata. Either install and run MongoDB locally or set up an account on MongoDB atlas. After, get your connection string and add it to the env.
- Head over to OpenSea API docs and request an API key. Add these keys to your env.

3. Set up an AWS bucket to hold your images
- Go make an AWS account, create an S3 bucket, and change your bucket name accordingly in the /src/lib/storage.mjs file.
- Add your images to this bucket. Make sure you name all your images beforehand in this specific format: **phaseID_style_imageID**

4. Deploy a test contract
Go to Remix IDE. Add the smart contract from contracts/contract.sol to the IDE. Here, you can deploy the contract to the testnet and call functions (like minting tokens) from etherscan. Ensure you do this on the rinkeby testnet.

4. Checkout db.json file in src/lib/db.json. Here, you can set some parameters for your project. 
- Poll times are kept there as a log. You can leave those null.
- Make sure you add your contract address after you have deployed your contract.
- You can also choose the max amount of phases allowed by changing lockEvolve.
- You can also change your styles. This will affect the data in the properties tab in OpenSea. If you do this, make sure to change the assignStyle() function in mongo.mjs file accordingly. 

5. Run index.mjs by typing
``` bash
node index.mjs
```
in the /src directory.
- This will run the express server that both serves your metadata over an API and polls the OpenSea API to monitor events.
- There are two types of event polling functions found in the /runtime folder, **transfer** which is when a token is minted and **transfer** for when a successful sales occurs.
- The app will log the most recent tokenIDs. If a token gets minted, the word "saved" will be logged. If a token is attempting to evolve, the console will show the data and result for an evolution.

<br/>

## 🚀 Deployment

You have a couple of options..

1. Deploy API on heroku

2. Self Host API with a Node process manager like PM2

3. Self Host MongoDB

4. Use MongoDB atlas

5. & more (be creative!) 

Either way, make sure that you

1. Update smart contract with the URL that you are hosting the API at. Do this in the contracts/contract.sol and update your src/lib/db.json file with this URL.

2. Deploy the contract to mainnet and add this address to your db.json

3. Ensure you have a website where your users can mint their tokens. You can do this with an integration using a lib like web3.js

## Issues?

Find us in our discord or submit a PR! :)
