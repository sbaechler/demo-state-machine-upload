import { UploadReactQueryWithProgress } from "./UploadReactQueryProgress";
import { UploadUsingFetch } from "./UploadUsingFetch";

function App() {
  return (
    <div className="App">
      <UploadUsingFetch />
      <UploadReactQueryWithProgress />
    </div>
  );
}

export default App;