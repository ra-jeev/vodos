export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (formData?.length) {
    const fileData = formData[0];
    console.log(fileData.name, fileData.filename, fileData.data.byteLength);

    const input = {
      audio: [...new Uint8Array(fileData.data)],
    };

    const response = await hubAI().run('@cf/openai/whisper-tiny-en', input);

    console.dir(response, { depth: null });
    // const response = await hubAI().run('@cf/openai/whisper', input);

    return handleUserRequest(response.text as string);
  }

  return {
    success: false,
    response: null,
  };
});
