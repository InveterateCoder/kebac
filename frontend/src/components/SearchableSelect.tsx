import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

type SearchableSelectProps = {
  label: string
  placeholder: string
  value: string
  options: string[]
  onChange: (value: string) => void
  disabled?: boolean
  hint?: string
}

export function SearchableSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled,
  hint,
}: SearchableSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Combobox
        items={options}
        value={value || null}
        onValueChange={(next) => onChange(next ?? "")}
        disabled={disabled}
      >
        <ComboboxInput
          className="w-full"
          placeholder={placeholder}
          disabled={disabled}
          showClear
        />
        <ComboboxContent>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No matches found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  )
}
