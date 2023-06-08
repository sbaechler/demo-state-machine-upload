import { createMachine, assign, stop, fromCallback, ActorRef } from 'xstate';
import { useMachine } from '@xstate/react';

type File = { name: string, size: number }

// A list of "files" to upload. The size are the number of milliseconds it takes to "upload" the file.
const uploads: File[] = [
    { name: "file1", size: 1000 },
    { name: "file2", size: 2000 },
    { name: "file3", size: 3000 },
    { name: "file4", size: 4000 },
]

const uploadFileCallback = (params: { file: File }) => fromCallback((callback, onRecieve) => {
  const { file } = params
  const { name, size } = file
  console.log(`Uploading ${name}...`)
  onRecieve((e) => {console.log(e)})
  const interval = size / 10;
  let currentProgress = 0;
  const intervalId = setInterval(() => {
      currentProgress += 0.1;
      callback({type: 'PROGRESS', params: {file, value: currentProgress}});
      if (currentProgress >= 0.999) {  // Because Javascript
        clearInterval(intervalId);
        callback({type: 'DONE', params: { file }});
      }
    }, interval);
  return () => clearInterval(intervalId);
});

/**
 * This uses XState 5 which has some breaking changes over XState 4..
 */
const uploadMachine = createMachine({
  types: {} as {
    context: {
      [id: string]: {
        file: File,
        ref: ActorRef<any, any>
        progress: number,
      }
    },
    events: 
      | { type: 'UPLOAD', params: {file: File} }
      | { type: 'PROGRESS', params: { value: number, file: File } }
      | { type: 'DONE', params: { file: File }}
  },
  id: 'upload',
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: {
        'UPLOAD': {
          target: 'uploading',
          actions: ['uploadFile'],
        },
      },
    },
    uploading: {
      always: {
        target: 'idle',
        guard: ({context}) => Object.values(context).every(({progress}) => progress >= 0.999),
      },
      on: {
        'UPLOAD': {
          actions: ['uploadFile'],
        },
        'PROGRESS': {
          actions: ['updateProgress'],
        },
        'DONE': {
          actions: ['stopActor'],
        },
      }
    },
    // still needs error states.
  }
}, {
  actions: {
    uploadFile: assign(({context, event, spawn}) => {
      return {
        [event.params.file.name]: {
          file: event.params.file,
          progress: 0,
          ref: spawn(uploadFileCallback(event.params), { id: `upload-${event.params.file.name}`}),
        }
      }
    }),
    updateProgress: assign(({context, event}) => {
      const { file, value } = event.params;
      const fileContext = context[file.name];
      if (!fileContext) {
        return context;
      }
      return {
        ...context,
        [file.name]: {
          ...fileContext,
          progress: value,
        }
      }
    }),
    stopActor: ({event}) => stop(event.params.file.name),
}});

          

    
export function UploadXState() {
  // use useInterpred for production apps.
  const [current, send] = useMachine(uploadMachine, { devTools: true });

  const onUpload = () => {
    uploads.forEach((file) => {
      send({type: 'UPLOAD', params: {file}});
    })
  }
  
  return (
    <>
      <h1>Upload with XState</h1>
      <div className="card">
        <button type="button" onClick={onUpload}>Upload Files</button>
      </div>
      { current.matches('uploading') ? (
        <div>
        <p>Uploading...</p>
        <ul>{Object.values(current.context).map((item) => (
          <li key={item.file.name}>{`Upload File ${item.file.name}: ${Math.round(item.progress*100)}%`}
          </li>))}
        </ul>
       </div>
      ): null }
    </>
  )
}