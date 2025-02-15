"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Preview = ({ value }: PreviewProps) => {
  return (
    <div className="bg-red-400">
      <ReactQuill value={value} theme="bubble" readOnly />
    </div>
  );
};

export default Preview;
