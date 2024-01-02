import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const convertMp3toMp4 = async (video: File) => {
  const ffmpeg = await getFFmpeg();

  await ffmpeg.writeFile('input.mp4', await fetchFile(video));

  ffmpeg.on('progress', (progress) => {
    console.log('Convert progress: ' + Math.round(progress.progress * 100));
  });

  await ffmpeg.exec([
    '-i',
    'input.mp4',
    '-map',
    '0:a',
    '-b:a',
    '20k',
    '-acodec',
    'libmp3lame',
    'output.mp3',
  ]);

  const data = await ffmpeg.readFile('output.mp3');

  const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
  const audioFile = new File([audioFileBlob], video.name.replace('.mp4', '.mp3'), {
    type: 'audio/mpeg',
  });

  return audioFile;
};
