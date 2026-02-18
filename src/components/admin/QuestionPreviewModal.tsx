type Props = {
  question: {
    text: string;
    options: string[];
  };
  onClose: () => void;
};

export default function QuestionPreviewModal({ question, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[500px] space-y-4">
        <h2 className="font-semibold">Preview</h2>

        <p>{question.text}</p>

        {question.options.map((o, i) => (
          <div key={i} className="border p-2 rounded">
            {o}
          </div>
        ))}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
