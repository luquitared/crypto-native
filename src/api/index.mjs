import express from 'express'

import nfts from './nft.mjs'

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/nfts', nfts);

export default router
