import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (elementId: string, fileName: string) => {
  try {
    const input = document.querySelector(`[itemID="${elementId}"]`) as HTMLElement;
    if (!input) return null;

    const scale = 3;

    const originalFontColor = input.style.color;
    input.style.color = "#000000";

    const canvas = await html2canvas(input, { scale: scale });

    input.style.color = originalFontColor;

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = (canvas.width / scale) * 0.75;
    const pdfHeight = (canvas.height / scale) * 0.75;

    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "l" : "p",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const pdfOutput = pdf.output("blob");

    return {
      blob: pdfOutput,
      fileName: `${fileName}.pdf`,
    };
  } catch (error) {
    console.error("Failed to generate PDF: ", error);
    return null;
  }
};
