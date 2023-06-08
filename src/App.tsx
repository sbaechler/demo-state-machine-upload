import { UploadReactQueryWithProgress } from "./UploadReactQueryProgress";
import { UploadUsingFetch } from "./UploadUsingFetch";
import { UploadXState } from "./UploadXState";

function App() {
  return (
    <div className="App">
      <UploadUsingFetch />
      <UploadReactQueryWithProgress />
      <UploadXState />
    </div>
  );
}

export default App;