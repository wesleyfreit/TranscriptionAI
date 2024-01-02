import { Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Header = () => {
  return (
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
  );
};
