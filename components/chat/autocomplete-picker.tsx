import { ChatbotUIContext } from "@/context/context"
import { AutocompleteSuggestion } from "@/types"
import { FC, useMemo, useContext } from "react"

interface AutocompleteSuggestionComponentProps {
  suggestion: AutocompleteSuggestion
}

const AutocompleteSuggestionComponent: FC<
  AutocompleteSuggestionComponentProps
> = ({ suggestion }) => {
  const ranges = useMemo(() => {
    type Range = { highlighted: boolean; content: string }
    const _ranges: Range[] = []
    let position = 0
    const { suggestion: text, highlights } = suggestion
    for (const highlight of highlights) {
      if (highlight.start > position)
        _ranges.push({
          highlighted: false,
          content: text.substring(position, highlight.start)
        })

      _ranges.push({
        highlighted: true,
        content: text.substring(highlight.start, highlight.end)
      })
      position = highlight.end
    }
    if (position < text.length)
      _ranges.push({ highlighted: false, content: text.substring(position) })
    return _ranges
  }, [suggestion])
  return ranges.map(range =>
    range.highlighted ? (
      <b key={range.content}>{range.content}</b>
    ) : (
      range.content
    )
  )
}

interface AutocompletePickerProps {
  suggestions: AutocompleteSuggestion[]
}

export const AutocompletePicker: FC<AutocompletePickerProps> = ({
  suggestions
}) => {
  const { isAutocompletePickerOpen } = useContext(ChatbotUIContext)

  return (
    isAutocompletePickerOpen && (
      <ul>
        {suggestions.map(suggestion => (
          <li key={suggestion.suggestion}>
            <AutocompleteSuggestionComponent suggestion={suggestion} />
          </li>
        ))}
      </ul>
    )
  )
}
