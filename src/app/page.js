"use client"

import { UploadButton } from "@uploadthing/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [pdfData,setPdfData]=useState('');
  return (
    <div className="gap-2">
  <div className="flex items-center justify-between">
    <label className="text-sm font-bold text-gray-500 tracking-wide">
      Attach Document
    </label>
    {pdfData && (
      <button
        type="button"
        onClick={() => setPdfData("")}
        className="py-1 px-3 focus:outline-none hover:bg-gray-200 bg-black text-white"
      >
        + edit pdf
      </button>
    )}
  </div>
  {pdfData ? (
    <a
      target="_blank"
      href={pdfData?.[0]?.url}
      className="col-span-6 sm:col-span-4 text-red-400 underline"
    >
      {pdfData?.[0]?.name}
    </a>
  ) : (
    <>
      <UploadButton
        endpoint={"productPdf"}
        onClientUploadComplete={(url) => {
          console.log("files", url);
          setPdfData(url);
          window.alert("Upload completed");
        }}
      />
    </>
  )}
</div>
  );
}
