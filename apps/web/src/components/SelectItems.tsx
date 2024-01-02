import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PromptDTO } from '@/dtos/PromptDTO';

interface SelectItemsProps {
  label: string;
  placeholder?: string;
  array?: PromptDTO[];
  defaultValue?: string;
  defaultText?: string;
  onSelect?: (str: string) => void;
}

export const SelectItems = ({
  label,
  placeholder,
  array,
  defaultValue,
  defaultText,
  onSelect,
}: SelectItemsProps) => {
  const handleSelect = (id: string) => {
    const selected = array?.find((item) => item.id === id);

    if (!selected) return;

    if (onSelect) {
      onSelect(selected.template);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select
        defaultValue={defaultValue}
        disabled={!!defaultValue}
        onValueChange={handleSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {array ? (
            array.map((item) => (
              <SelectItem value={item.id} key={item.id} className="cursor-pointer">
                {item.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value={defaultValue as string} className="cursor-pointer">
              {defaultText}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
