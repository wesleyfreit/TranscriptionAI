import { api } from '@/services/api';

export const uploadVideo = async (uploadData: FormData) => {
  const uploadResponse = await api.post('/videos', uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return uploadResponse;
};

export const generateTranscription = async (videoId: string, prompt: string) => {
  const transcriptionResponse = await api.post(`/videos/${videoId}/transcription`, {
    prompt,
  });

  return transcriptionResponse;
};
