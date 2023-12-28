import { FileVideo, Github, Upload, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">TranscriptionAI</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Densenvolvido no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant={'outline'}>
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </header>

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
            <form className="space-y-5">
              <label
                htmlFor="video"
                className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground duration-300 hover:bg-primary/5"
              >
                <FileVideo className="w-5 h-5" />
                Selecione um vídeo
              </label>

              <input
                type="file"
                name="video"
                id="video"
                accept="video/mp4"
                className="sr-only"
              />

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>

                <Textarea
                  id="transcription_prompt"
                  className="h-20 leading-relaxed resize-none"
                  placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula (,)"
                />
              </div>

              <Button type="submit" className="w-full">
                Carregar Video <Upload className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <Separator />

            <form className="space-y-5">
              <div className="space-y-2">
                <Label>Prompt</Label>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um prompt..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="title" className="cursor-pointer">
                      Título do Youtube
                    </SelectItem>
                    <SelectItem value="description" className="cursor-pointer">
                      Descrição do Youtube
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>

                <Select defaultValue="gpt3.5" disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>

                <span className="block italic text-xs text-muted-foreground">
                  Você poderá customizar essa opção em breve
                </span>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Temperatura</Label>

                <Slider min={0} max={1} step={0.1}>
                  <Slider />
                </Slider>

                <span className="block italic text-xs text-slate-500 leading-relaxed">
                  Valores mais elevados tender a deixar o resultado mais criativo, mas
                  também mais propenso a erros.
                </span>
              </div>

              <Separator />

              <Button type="submit" className="w-full">
                Executar
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </aside>
      </main>
    </div>
  );
}
