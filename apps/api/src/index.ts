import 'dotenv/config';
import { fastify } from 'fastify';

import { promptRoutes } from './routers/promptRoutes';

const app = fastify();
const port = (process.env.PORT as unknown as number) || 3333;

app.register(promptRoutes);

app.get('/', () => {
  return 'hello world!';
});

app.listen({ port }, () => {
  try {
    console.log('🚀 HTTP server running in http://localhost:3333');
  } catch (error) {
    console.error(error);
  }
});
