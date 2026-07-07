import './TranscriptPreview.css'

interface TranscriptPreviewProps {
  text: string
}

function TranscriptPreview({ text }: TranscriptPreviewProps): React.JSX.Element {
  return (
    <div className="transcript-preview">
      {text}
      <span className="transcript-preview-shimmer" aria-hidden="true" />
    </div>
  )
}

export default TranscriptPreview
