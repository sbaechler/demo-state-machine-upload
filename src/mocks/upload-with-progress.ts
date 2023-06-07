/**
 * A mock function that simulates an upload with a progress callback.
 * The onProgress callback is called 10 times each 10% of the upload. The value is between 0 and 1.
 * @param duration - The duration of the upload in milliseconds.
 * @param onProgress - A callback function that is called with the progress of the upload.
 * @returns - A promise that resolves when the upload is finished.
 */
export async function uploadWithProgress(duration: number, onProgress: (progress: number) => void) {
  const interval = duration / 10;
  let currentProgress = 0;
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      currentProgress += 0.1;
      onProgress(currentProgress);
      if (currentProgress >= 0.999) {  // Because Javascript
        clearInterval(intervalId);
        resolve(undefined);
      }
    }, interval);
  });
}