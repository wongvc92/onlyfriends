export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Could not convert blob to Data URL"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read the blob"));
    };
    reader.readAsDataURL(blob);
  });
};
