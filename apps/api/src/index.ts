import { fastifyMultipart } from '@fastify/multipart';
import 'dotenv/config';
import { fastify } from 'fastify';
import cors from '@fastify/cors';

import { promptRoutes } from './routers/promptRoutes';
import { videoRoutes } from './routers/videoRoutes';

const app = fastify();
const port = parseInt(process.env.PORT ?? '3333');
const origin = process.env.ORIGIN;

app.register(fastifyMultipart, {
  limits: {
    fileSize: 1_048_576 * 25, // 25mb
  },
});

app.register(cors, {
  origin,
});

app.register(promptRoutes);
app.register(videoRoutes);

app.listen({ port }, () => {
  try {
    console.log(`🚀 HTTP server running in http://localhost:${port}`);
  } catch (error) {
    console.error(error);
  }
});
