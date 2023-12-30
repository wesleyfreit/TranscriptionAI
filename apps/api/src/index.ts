import { fastifyMultipart } from '@fastify/multipart';
import 'dotenv/config';
import { fastify } from 'fastify';
import cors from '@fastify/cors';

import { promptRoutes } from './routers/promptRoutes';
import { videoRoutes } from './routers/videoRoutes';

const app = fastify();
const port = (process.env.PORT as unknown as number) || 3333;

app.register(fastifyMultipart, {
  limits: {
    fileSize: 1_048_576 * 25, // 25mb
  },
});

app.register(cors, {
  origin: true,
});

app.register(promptRoutes);
app.register(videoRoutes);

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
