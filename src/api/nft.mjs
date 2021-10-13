import express from 'express';
import { findIndex } from 'lodash-es'
import { getImage } from '../lib/storage.mjs'
import { getById } from '../lib/mongo.mjs'

const router = express.Router();

router.get('/:id', async (req, res) => {
  let result = await getById(req.params.id)
  let indexOfPhaseAttribute = findIndex(result.attributes, ['trait_type', 'phase'])
  result.attributes[indexOfPhaseAttribute].value = result.phaseID
  result.image = 'http://metadata.miragegallery.com/api/v1/nfts/image/' + result._id + '/' + result.attributes[0].value + '/' + result.imageID + '/' + result.phaseID
  res.json(result)
});

router.get('/image/:tokenID/:style/:imageID/:phaseID', async (req, res) => {
  res.set('Cache-Control', 'no-store')
  let nft = await getById(req.params.tokenID)
  let img = await getImage(nft, req.params.tokenID, req.params.style, req.params.imageID, req.params.phaseID)
  if (img != null) {
    img = img.Body.toString('base64');
    img = Buffer.from(img, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });

    res.end(img);
  }
  else {
    res.json({ error: "phase has not occured" })
  }
});

export default router