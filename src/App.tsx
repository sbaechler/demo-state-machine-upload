import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import './App.css'

function App() {
  const [files, setFiles] = useState<FileList | null>(null)

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!files) {
        return;
      }

      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      return null
    }
  })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (files) {
      Array.from(files).forEach(fileItem => {
        mutation.mutate(fileItem);
      });
    }
  }

  return (
    <>
      <h1>State Upload</h1>
      <div className="card">
        <form onSubmit={onSubmit}>
          <label>Upload File
            <input 
              type="file" 
              name="files" 
              multiple={true} 
              onChange={(e) => setFiles(e.target.files)} 
            />
          </label>
          <p>
            <button type="submit">Submit</button>
          </p>
          
        </form>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {mutation.isPending ? (
        "Uploading..."
      ) : (
        <>
          {mutation.isError ? (
            <div>Error: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>File uploaded successfully</div> : null}
        </>
      )}
    </>
  )
}

export default App
