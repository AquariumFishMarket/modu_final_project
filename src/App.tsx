import { BrowserRouter } from "react-router-dom";
import RootRoute from "./rootRoute";
import { SearchProvider } from "./contexts/SearchContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <RootRoute />
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
