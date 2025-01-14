"use client";

import React, { useEffect } from "react";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";

const Barcode = ({ barcode }: { barcode: string }) => {
  useEffect(() => {
    if (barcode) {
      JsBarcode(`#barcode-${barcode}`, barcode, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true,
      });
    }
  }, [barcode]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Fetch the barcode SVG
    const svgElement = document.getElementById(`barcode-${barcode}`);
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const DOMURL = window.URL || window.webkitURL || window;
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          DOMURL.revokeObjectURL(url);

          // Add the barcode to the PDF
          const imgData = canvas.toDataURL("image/png");
          doc.text("Barcode:", 10, 10); // Add some text
          doc.addImage(imgData, "PNG", 10, 20, 100, 50); // x, y, width, height
          doc.save(`${barcode}.pdf`);
        };
        img.src = url;
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Display the barcode */}
      <svg id={`barcode-${barcode}`} />

      {/* Download button */}
      <button
        onClick={handleDownloadPDF}
        
      >
        <p className="mt-1 text-xs text-gray-500">
        Click here to download.
      </p>
      </button>

      {/* Small text */}
      
    </div>
  );
};

export default Barcode;
