import { ChatbotUIContext } from "@/context/context"
import { AutocompleteSuggestion } from "@/types"
import { FC, useMemo, useContext } from "react"

interface AutocompleteSuggestionComponentProps {
  suggestion: AutocompleteSuggestion
}

type Range = { highlighted: boolean; content: string }
const normalizeRanges = (rangesIn: Range[]): Range[] => {
  const normalizedRanges: Range[] = []
  let currentRange: Range = rangesIn[0]
  for (const range of rangesIn.slice(1)) {
    if (range.highlighted === currentRange.highlighted)
      currentRange.content += range.content
    else {
      normalizedRanges.push(currentRange)
      currentRange = range
    }
  }
  normalizedRanges.push(currentRange)
  return normalizedRanges
}

const suggestionToRanges = (suggestion: AutocompleteSuggestion) => {
  const suggestionTextChars: Range[] = suggestion.suggestion
    .split("")
    .map(char => ({ highlighted: false, content: char }))
  for (const highlight of suggestion.highlights) {
    for (let i = highlight.start; i < highlight.end; i++)
      suggestionTextChars[i].highlighted = true
  }
  return normalizeRanges(suggestionTextChars)
}

const AutocompleteSuggestionComponent: FC<
  AutocompleteSuggestionComponentProps
> = ({ suggestion }) => {
  const { setUserInput, setIsAutocompletePickerOpen } =
    useContext(ChatbotUIContext)
  const ranges = useMemo(() => suggestionToRanges(suggestion), [suggestion])
  const handleSuggestion = () => {
    setUserInput(suggestion.suggestion)
    setIsAutocompletePickerOpen(false)
  }
  return (
    <span
      className="cursor-pointer hover:opacity-50"
      onClick={handleSuggestion}
    >
      {ranges.map(range =>
        range.highlighted ? (
          <b key={range.content}>{range.content}</b>
        ) : (
          range.content
        )
      )}
    </span>
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
    isAutocompletePickerOpen &&
    suggestions.length > 0 && (
      <div className="bg-background space-y-1 rounded-xl border-2 p-2">
        <ul id="autocomplete-list">
          {suggestions.map(suggestion => (
            <li key={suggestion.suggestion}>
              <AutocompleteSuggestionComponent suggestion={suggestion} />
            </li>
          ))}
        </ul>
      </div>
    )
  )
}
