import app from './app.mjs'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
