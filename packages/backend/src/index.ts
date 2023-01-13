import express from 'express';

const DEFAULT_PORT = 5000;
const PORT = parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;

const app = express();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
