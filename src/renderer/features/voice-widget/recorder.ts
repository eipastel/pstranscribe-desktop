// Captura de microfone: getUserMedia + MediaRecorder (webm/opus) acumulando num blob.
let mediaRecorder: MediaRecorder | null = null
let stream: MediaStream | null = null
let chunks: Blob[] = []

export async function startRecording(): Promise<MediaStream> {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  chunks = []
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }
  mediaRecorder.start()
  return stream
}

export function stopRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    const recorder = mediaRecorder
    if (!recorder || recorder.state === 'inactive') {
      resolve(null)
      return
    }
    recorder.onstop = () => {
      stream?.getTracks().forEach((track) => track.stop())
      stream = null
      mediaRecorder = null
      resolve(new Blob(chunks, { type: recorder.mimeType }))
    }
    recorder.stop()
  })
}
