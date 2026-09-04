export type PdfPageSize = "newspaper" | "letter" | "a4" | "tabloid";
export type PdfOrientation = "portrait" | "landscape";
export type PdfPagination = "single" | "multipage";
export type PdfQuality = "draft" | "standard" | "high";

export interface PdfExportSettings {
  filename: string;
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  pagination: PdfPagination;
  marginInches: number;
  quality: PdfQuality;
  includeWeathering: boolean;
}

const PAGE_FORMATS: Record<Exclude<PdfPageSize, "newspaper">, [number, number]> = {
  letter: [612, 792],
  a4: [595.28, 841.89],
  tabloid: [792, 1224],
};

const QUALITY_SCALE: Record<PdfQuality, number> = {
  draft: 1,
  standard: 1.75,
  high: 2.5,
};

const MAX_CANVAS_PIXELS = 48_000_000;
const MAX_CANVAS_EDGE = 16_000;

export function safePdfFilename(value: string) {
  const name = value
    .trim()
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${name || "newspaper"}.pdf`;
}

export function pageFormatPoints(
  pageSize: PdfPageSize,
  orientation: PdfOrientation,
  sourceWidth: number,
  sourceHeight: number,
): [number, number] {
  const format = pageSize === "newspaper"
    ? [sourceWidth * 0.75, sourceHeight * 0.75] as [number, number]
    : PAGE_FORMATS[pageSize];
  const short = Math.min(...format);
  const long = Math.max(...format);
  return orientation === "portrait" ? [short, long] : [long, short];
}

export function fitWithin(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  return { width: sourceWidth * scale, height: sourceHeight * scale };
}

function safeCaptureScale(width: number, height: number, quality: PdfQuality) {
  const requested = QUALITY_SCALE[quality];
  const areaScale = Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height));
  const edgeScale = Math.min(MAX_CANVAS_EDGE / Math.max(1, width), MAX_CANVAS_EDGE / Math.max(1, height));
  return Math.max(0.75, Math.min(requested, areaScale, edgeScale));
}

async function waitForPageAssets(element: HTMLElement) {
  await document.fonts?.ready;
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(images.map((image) => {
    if (image.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });
  }));
}

function addSinglePage(
  pdf: import("jspdf").jsPDF,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeight: number,
  margin: number,
) {
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const fitted = fitWithin(canvas.width, canvas.height, printableWidth, printableHeight);
  const x = margin + (printableWidth - fitted.width) / 2;
  const y = margin + (printableHeight - fitted.height) / 2;
  pdf.addImage(canvas, "PNG", x, y, fitted.width, fitted.height, undefined, "FAST");
}

function addMultiplePages(
  pdf: import("jspdf").jsPDF,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeight: number,
  margin: number,
) {
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const pdfScale = printableWidth / canvas.width;
  const sliceHeight = Math.max(1, Math.floor(printableHeight / pdfScale));

  for (let sourceY = 0, page = 0; sourceY < canvas.height; sourceY += sliceHeight, page += 1) {
    const height = Math.min(sliceHeight, canvas.height - sourceY);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = height;
    const context = slice.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the PDF page image.");
    context.drawImage(canvas, 0, sourceY, canvas.width, height, 0, 0, canvas.width, height);
    if (page > 0) pdf.addPage();
    pdf.addImage(slice, "PNG", margin, margin, printableWidth, height * pdfScale, undefined, "FAST");
  }
}

export async function exportNewspaperPdf(element: HTMLElement, settings: PdfExportSettings) {
  await waitForPageAssets(element);
  const sourceWidth = element.scrollWidth;
  const sourceHeight = element.scrollHeight;
  if (!sourceWidth || !sourceHeight) throw new Error("The newspaper preview is not ready to export.");

  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  const captureScale = safeCaptureScale(sourceWidth, sourceHeight, settings.quality);
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    height: sourceHeight,
    imageTimeout: 15_000,
    logging: false,
    scale: captureScale,
    useCORS: true,
    width: sourceWidth,
    windowHeight: sourceHeight,
    windowWidth: sourceWidth,
    onclone: (clonedDocument) => {
      const clonedPage = clonedDocument.querySelector<HTMLElement>("[data-pdf-export-root]");
      if (!clonedPage) return;
      clonedPage.classList.add("is-finalized", "is-pdf-exporting");
      clonedPage.classList.remove("is-editing");
      const zoomContainer = clonedPage.closest<HTMLElement>(".page-zoom, .shared-page-zoom");
      if (zoomContainer) zoomContainer.style.zoom = "1";
      if (!settings.includeWeathering) clonedPage.querySelector(".paper-weathering-overlay")?.remove();
    },
  });

  const [formatWidth, formatHeight] = pageFormatPoints(
    settings.pageSize,
    settings.orientation,
    sourceWidth,
    sourceHeight,
  );
  const pdf = new jsPDF({
    compress: true,
    format: [formatWidth, formatHeight],
    orientation: settings.orientation,
    unit: "pt",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxMargin = Math.max(0, Math.min(pageWidth, pageHeight) / 2 - 1);
  const margin = Math.min(settings.marginInches * 72, maxMargin);

  if (settings.pagination === "multipage" && settings.pageSize !== "newspaper") {
    addMultiplePages(pdf, canvas, pageWidth, pageHeight, margin);
  } else {
    addSinglePage(pdf, canvas, pageWidth, pageHeight, margin);
  }

  pdf.setProperties({
    title: settings.filename.replace(/\.pdf$/i, ""),
    creator: "Broadsheet Fantasy Newspaper Studio",
  });
  pdf.save(safePdfFilename(settings.filename));
}
