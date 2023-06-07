import { useReducer, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import './App.css'
import { uploadWithProgress } from './mocks/upload-with-progress'


type File = { name: string, size: number }

// A list of "files" to upload. The size are the number of milliseconds it takes to "upload" the file.
const uploads: File[] = [
    { name: "file1", size: 1000 },
    { name: "file2", size: 2000 },
    { name: "file3", size: 3000 },
    { name: "file4", size: 4000 },
]

/**
 * We store the progress of each file in an array.
 */
function filesReducer(state: number[], action: any) {
    switch (action.type) {
        case "add":
            return [...state, 0]
        case "update":
            return state.map((item: number, index: number) => {
                if (index === action.index) {
                    return action.value
                }
                return item
            })
        case "done":
            return []
        default:
            return state
        }
    }
    

/**
 * We are still using React Query here, but simulate the File upload using a mock.
 * Fetch does not support progress events, so we cannot use it to track the progress of the upload.
 * We could use Axios instead but for simplicity we will use a mock.
 */
export function UploadReactQueryWithProgress() {
    const [state, dispatch] = useReducer(filesReducer, [])
  

  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
        files.forEach(() => dispatch({ type: "add" }))

        await Promise.all(
            files.map((file, index) => uploadWithProgress(file.size, (value: number) => dispatch({ type: "update", index, value }))
        ))
    },
    onSuccess: () => dispatch({ type: "done" }) 
    })

  return (
    <>
      <h1>Upload with Progress</h1>
      <div className="card">
        <button type="button" onClick={() => mutation.mutate(uploads)}>Upload Files</button>
      </div>

      {mutation.isPending ? (
        <div>
            <p>Uploading...</p>
            <ul>{state.map((item, index) => (<li key={index}>{`Upload ${Math.round(item*100)}%`}</li>))}</ul>
        </div>
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
