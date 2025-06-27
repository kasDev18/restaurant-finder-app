import { Toaster } from "react-hot-toast";
import Home from "./components/Home";

function App() {

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Home />
    </>
  );
}

export default App;
