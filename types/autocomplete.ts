export type AutocompleteHighlightRange = { start: number; end: number }

export type AutocompleteSuggestion = {
  suggestion: string
  relevance: number
  highlights: AutocompleteHighlightRange[]
}
