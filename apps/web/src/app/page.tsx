import { FormTranscription } from '@/components/FormTranscription';
import { FormVideo } from '@/components/FormVideo';
import { Header } from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex gap-6">
        <div className="flex flex-col flex-1 gap-4 p-5">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Inclua o prompt para a AI..."
              className="resize-none p-5 leading-relaxed"
            />

            <Textarea
              placeholder="Resultado gerado pela IA..."
              readOnly
              className="resize-none p-5 leading-relaxed"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-violet-500">{'{transcription}'}</code> no seu prompt
            para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
        </div>

        <aside className="transcription-menu w-96 my-5 me-5 mb-14 max-h-full overflow-y-auto relative">
          <div className="absolute px-2 space-y-6">
            <FormVideo />

            <Separator />

            <FormTranscription />
          </div>
        </aside>
      </main>
    </div>
  );
}
