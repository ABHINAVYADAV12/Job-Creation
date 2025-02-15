"use client"
import dynamic from 'next/dynamic';//hydration error
import { useMemo } from 'react';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';
interface PreviewProps{
    value:string
}
const Preview= ({value}:PreviewProps) => {
    const reactQuill=useMemo(()=>dynamic(()=>import("react-quill"),{ssr:false}),[])
  return   <div className='bg-red-400'>
    <ReactQuill value={value}  theme='bubble' readOnly/>
  </div>
}

export default Preview