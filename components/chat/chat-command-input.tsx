import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { FilePicker } from "./file-picker"
import { PromptPicker } from "./prompt-picker"
import { ToolPicker } from "./tool-picker"
import { AutocompletePicker } from "./autocomplete-picker"

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  const {
    newMessageFiles,
    chatFiles,
    slashCommand,
    isAtPickerOpen,
    setIsAtPickerOpen,
    atCommand,
    focusPrompt,
    focusFile,
    autocompleteSuggestions
  } = useContext(ChatbotUIContext)

  const { handleSelectUserFile, handleSelectUserCollection } =
    usePromptAndCommand()

  return (
    <>
      <AutocompletePicker
        suggestions={autocompleteSuggestions.filter(s => s.relevance > 0)}
      />

      <PromptPicker />

      <FilePicker
        isOpen={isAtPickerOpen}
        searchQuery={atCommand}
        onOpenChange={setIsAtPickerOpen}
        selectedFileIds={[...newMessageFiles, ...chatFiles].map(
          file => file.id
        )}
        selectedCollectionIds={[]}
        onSelectFile={handleSelectUserFile}
        onSelectCollection={handleSelectUserCollection}
        isFocused={focusFile}
      />

      <ToolPicker />
    </>
  )
}
