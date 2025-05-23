"use client";

import { storage } from "@/config/firebase.config";
import {  getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {  FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ResumeUploadProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const ResumeUpload = ({ disabled, onChange, value }: ResumeUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    const newUrls: { url: string; name: string }[] = [];
    let completedFiles = 0;

    files.forEach((file: File) => {
      const uploadTask = uploadBytesResumable(
        ref(storage, `Attachments/${Date.now()}-${file.name}`),
        file,
        { contentType: file.type }
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          toast.error(error.message);
          setIsLoading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          newUrls.push({ url: downloadUrl, name: file.name });

          completedFiles++;
          if (completedFiles === files.length) {
            setIsLoading(false);
            onChange([...value, ...newUrls]);
          }
        }
      );
    });
  };

  

  return (
    <div>
      <div className="w-full p-2 h-24 bg-purple-100 flex items-center justify-center">
        {isLoading ? (
          <p>{`${progress.toFixed(2)}%`}</p>
        ) : (
          <label className="w-full h-full flex items-center justify-center cursor-pointer">
            <div
              className={`flex gap-2 items-center justify-center cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FilePlus className="w-3 h-3 mr-2" />
              <p>Add a file</p>
            </div>
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .rtf, .odt"
              multiple
              className="w-0 h-0"
              disabled={disabled}
              onChange={onUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};
