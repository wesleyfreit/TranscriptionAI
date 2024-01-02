'use client';
import { Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SelectItems } from '@/components/SelectItems';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { PromptDTO } from '@/dtos/PromptDTO';
import { getPrompts } from '@/services/prompts';

export const FormTranscription = () => {
  const [prompts, setPrompts] = useState<PromptDTO[]>([] as PromptDTO[]);
  const [temperature, setTemperature] = useState(0.5);

  useEffect(() => {
    fechPrompts();
  }, []);

  const fechPrompts = async () => {
    const promptsResponse = await getPrompts();
    setPrompts(promptsResponse.data);
  };

  const onPromptSelect = (template: string) => {
    console.log(template);
  };

  return (
    <form className="space-y-5">
      <SelectItems
        label="Prompt"
        placeholder="Selecione um prompt..."
        array={prompts}
        onSelect={onPromptSelect}
      />

      <div className="space-y-2">
        <SelectItems
          label="Modelo"
          defaultValue="gpt3.5"
          defaultText="GPT 3.5-turbo 16k"
        />
        <span className="block italic text-xs text-muted-foreground">
          Você poderá customizar essa opção em breve
        </span>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Temperatura</Label>

        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[temperature]}
          onValueChange={(value) => setTemperature(value[0] as number)}
        >
          <Slider />
        </Slider>

        <span className="block italic text-xs text-slate-500 leading-relaxed">
          Valores mais elevados tender a deixar o resultado mais criativo, mas também mais
          propenso a erros.
        </span>
      </div>

      <Separator />

      <Button type="submit" className="w-full">
        Executar
        <Wand2 className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
};
