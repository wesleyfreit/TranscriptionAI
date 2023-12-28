import 'dotenv/config';
import { fastify } from 'fastify';

const app = fastify();
const port = (process.env.PORT as unknown as number) || 3333;

app.get('/', () => {
  return 'Hello World!';
});

app.listen({ port: port }, () => {
  console.log(`listening on http://localhost:${port} `);
});
