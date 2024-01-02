'use client';
import { CheckCircle, FileVideo, Upload, XCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';

import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { generateTranscription, uploadVideo } from '@/services/videos';
import { convertMp3toMp4 } from '@/utils/convertMp3ToMp4';
import { formVideoStatusMessages } from '@/utils/formVideoStatusMessages';

export const FormVideo = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [status, setStatus] = useState<Status>('waiting');

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const previewUrl = useMemo(() => {
    if (!video) {
      return undefined;
    }

    return URL.createObjectURL(video);
  }, [video]);

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setVideo(selectedFile);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transcriptionPrompt = promptInputRef.current?.value;

    if (!video || !transcriptionPrompt) return;

    try {
      setStatus('converting');

      const audioFile = await convertMp3toMp4(video);

      setStatus('uploading');

      const uploadData = new FormData();
      uploadData.set('file', audioFile);

      const uploadResponse = await uploadVideo(uploadData);

      const videoId = uploadResponse.data;

      setStatus('generating');

      const generateResponse = await generateTranscription(videoId, transcriptionPrompt);

      if (generateResponse.status === 200) {
        setStatus('success');
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('waiting'), 4000);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSave}>
      <label
        htmlFor="video"
        className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground duration-300 hover:bg-primary/5"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none rounded-md aspect-video object-cover"
          />
        ) : (
          <>
            <FileVideo className="w-5 h-5" />
            Selecione um vídeo
          </>
        )}
      </label>

      <input
        type="file"
        name="video"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
        disabled={status != 'waiting'}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>

        <Textarea
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula (,)"
          disabled={status !== 'waiting'}
        />
      </div>

      <Button
        data-success={status === 'success'}
        data-error={status === 'error'}
        data-disabled={status !== 'waiting'}
        type="submit"
        className={
          'w-full data-[success=true]:bg-green-600 data-[error=true]:bg-red-600 data-[disabled=true]:pointer-events-none'
        }
      >
        {status === 'waiting' ? (
          <>
            {formVideoStatusMessages.waiting}
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : status === 'success' ? (
          <>
            {formVideoStatusMessages.success}
            <CheckCircle className="w-4 h-4 ml-2" />
          </>
        ) : status === 'error' ? (
          <>
            {formVideoStatusMessages.error}
            <XCircle className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            {formVideoStatusMessages[status]}
            <Spinner />
          </>
        )}
      </Button>
    </form>
  );
};
