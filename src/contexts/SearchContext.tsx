import { createContext, useContext, ReactNode } from "react";
import { useSearch } from "../hooks/useSearch";
import type { UserData } from "../hooks/useSearch";

interface SearchContextType {
  searchResults: UserData[];
  isLoading: boolean;
  hasSearched: boolean;
  currentKeyword: string;
  inputValue: string;
  error: string | null;
  handleInputChange: (value: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const searchState = useSearch();

  return (
    <SearchContext.Provider value={searchState}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }
  return context;
}
