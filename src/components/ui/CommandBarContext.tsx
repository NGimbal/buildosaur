import React, { useCallback, useContext, useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./CommandBar";
import { useAddObjects } from "../../hooks/useObjects";

interface CommandBarState {
  foo?: string;
}

const DEFAULT_PREFERENCES: CommandBarState = {
  foo: undefined,
};

interface CommandBarContextValue {
  toggleCommandBar: (open?: boolean) => void;
  cBarState: typeof DEFAULT_PREFERENCES;
  setCBarState: (preferences: Partial<typeof DEFAULT_PREFERENCES>) => void;
}

const Context = React.createContext<CommandBarContextValue>(
  {} as CommandBarContextValue
);

interface CommandBarProviderProps {
  children?: React.ReactNode;
}

export const CommandBarProvider = ({
  children,
}: CommandBarProviderProps): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleCommandBar = useCallback(
    (open?: boolean) =>
      setOpen((o) => {
        return typeof open === "boolean" ? open : !o;
      }),
    []
  );

  const [cBarState, setCBarState] = useState(DEFAULT_PREFERENCES);

  const { addBox } = useAddObjects();

  return (
    <Context.Provider
      value={{
        toggleCommandBar,
        cBarState,
        setCBarState,
      }}
    >
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandSeparator />
        <CommandList>
          <CommandItem
            key={"select-me"}
            onSelect={() => {
              console.log("selected");
              addBox({});
            }}
            className="hover:bg-gray-100 p-2 rounded-md"
          >
            Add Box
          </CommandItem>
        </CommandList>
      </CommandDialog>
      {children}
    </Context.Provider>
  );
};

export const useCommandBar = (): CommandBarContextValue => {
  return useContext(Context);
};