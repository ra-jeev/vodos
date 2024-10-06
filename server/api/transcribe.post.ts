export default defineEventHandler(async (event) => {
  console.log('incoming transcribe request', event.headers);

  const files = await readMultipartFormData(event);
  console.log(
    'incoming transcribe request with multipart length: ',
    files?.length
  );

  if (files?.length) {
    const formData = files[0];
    console.log(formData.name, formData.filename, formData.data.byteLength);
  }

  return {
    success: true,
  };
});
