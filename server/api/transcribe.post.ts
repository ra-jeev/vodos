export default defineEventHandler(async (event) => {
  console.log('incoming transcribe request', event.headers);

  const formData = await readMultipartFormData(event);
  console.log(
    'incoming transcribe request with multipart length: ',
    formData?.length
  );

  if (formData?.length) {
    const fileData = formData[0];
    console.log(fileData.name, fileData.filename, fileData.data.byteLength);

    const input = {
      audio: [...new Uint8Array(fileData.data)],
    };

    const response = await hubAI().run('@cf/openai/whisper-tiny-en', input);
    // const response = await hubAI().run('@cf/openai/whisper', input);

    return {
      success: true,
      response,
    };
  }

  return {
    success: false,
    response: null,
  };
});
