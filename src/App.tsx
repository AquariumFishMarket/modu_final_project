import { BrowserRouter } from "react-router-dom";
import RootRoute from "./rootRoute";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <RootRoute />
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;
