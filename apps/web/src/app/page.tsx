'use client';
import { useState } from 'react';

import { FormTranscription } from '@/components/FormTranscription';
import { FormVideo } from '@/components/FormVideo';
import { Header } from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { aiCompleteLink } from '@/services/ai';
import { useCompletion } from 'ai/react';

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(0.5);

  const { input, completion, setInput, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: aiCompleteLink,
      body: {
        videoId,
        temperature,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex gap-6">
        <div className="flex flex-col flex-1 gap-4 p-5">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Inclua o prompt para a AI..."
              className="resize-none p-5 leading-relaxed"
              value={input}
              onChange={handleInputChange}
            />

            <Textarea
              placeholder="Resultado gerado pela IA..."
              readOnly
              className="resize-none p-5 leading-relaxed"
              value={completion}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-violet-500">{'{transcription}'}</code> no seu prompt
            para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
        </div>

        <aside className="transcription-menu w-96 my-5 me-5 mb-5 max-h-full overflow-y-auto relative">
          <div className="absolute px-2 space-y-4">
            <FormVideo onVideoUploaded={setVideoId} />

            <Separator />

            <FormTranscription
              temperature={temperature}
              isLoading={isLoading}
              onPromptSelect={setInput}
              onTemperatureSelect={setTemperature}
              onSubmit={handleSubmit}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
