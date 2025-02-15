"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <div className="bg-red-400">
      <ReactQuill value={value} onChange={onChange} theme="snow" />
    </div>
  );
};

export default Editor;
