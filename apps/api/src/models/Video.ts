import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Video {
  private video;

  constructor() {
    this.video = prisma.video;
  }

  createVideo = async (fileName: string, r2Url: string) => {
    const video = this.video.create({ data: { name: fileName, path: r2Url } });
    return video;
  };

  createTranscription = async (videoId: string, transcription: string) => {
    const video = this.video.update({
      where: { id: videoId },
      data: { transcription },
    });
    return video;
  };

  findVideo = async (videoId: string) => {
    const video = this.video.findUniqueOrThrow({ where: { id: videoId } });
    return video;
  };
}
