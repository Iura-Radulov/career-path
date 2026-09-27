'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    [{ align: [] }],
    ['link', 'clean'],
  ],
};

export default function HtmlEditor({ label, value, onChange, required }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-slate-300 text-sm font-medium">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="quill-editor-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder="Write article content..."
        />
      </div>
    </div>
  );
}
