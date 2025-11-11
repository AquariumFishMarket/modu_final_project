import { BrowserRouter } from "react-router-dom";
import RootRoute from "./rootRoute";
import { SearchProvider } from "./contexts/SearchContext";
import Pusher from "pusher-js";

export const pusher = new Pusher('25b10e3b7afa8175af9e', {
  cluster: 'ap3', // 도쿄
});

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