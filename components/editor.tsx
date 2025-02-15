"use client"
import dynamic from 'next/dynamic';//hydration error
import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
interface EditorProps{
    onChange:(value:string)=>void
    value:string
}
const Editor = ({onChange,value}:EditorProps) => {
    const reactQuill=useMemo(()=>dynamic(()=>import("react-quill"),{ssr:false}),[])
  return   <div className='bg-red-400'>
    <ReactQuill value={value} onChange={onChange} theme='snow'/>
  </div>
}
export default Editor