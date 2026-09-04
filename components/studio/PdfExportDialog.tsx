"use client";

import { useState } from "react";
import { Download, FileText, LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import {
  exportNewspaperPdf,
  safePdfFilename,
  type PdfExportSettings,
  type PdfOrientation,
  type PdfPageSize,
  type PdfPagination,
  type PdfQuality,
} from "@/lib/pdf/export-newspaper";
import type { PageSize } from "@/lib/news/types";

interface PdfExportDialogProps {
  open: boolean;
  issueName: string;
  newspaperPageSize: PageSize;
  onOpenChange: (open: boolean) => void;
}

function initialSettings(issueName: string, newspaperPageSize: PageSize): PdfExportSettings {
  return {
    filename: safePdfFilename(issueName),
    pageSize: newspaperPageSize === "letter" ? "letter" : newspaperPageSize === "tabloid" ? "tabloid" : "newspaper",
    orientation: "portrait",
    pagination: "single",
    marginInches: 0.25,
    quality: "standard",
    includeWeathering: true,
  };
}

export function PdfExportDialog({ open, issueName, newspaperPageSize, onOpenChange }: PdfExportDialogProps) {
  const [settings, setSettings] = useState(() => initialSettings(issueName, newspaperPageSize));
  const [status, setStatus] = useState<"idle" | "exporting" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof PdfExportSettings>(key: K, value: PdfExportSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function createPdf() {
    const page = document.querySelector<HTMLElement>("[data-pdf-export-root]");
    if (!page) {
      setStatus("error");
      setError("The newspaper preview is not ready to export.");
      return;
    }

    setStatus("exporting");
    setError("");
    try {
      await exportNewspaperPdf(page, settings);
      onOpenChange(false);
    } catch (reason) {
      setStatus("error");
      setError(reason instanceof Error ? reason.message : "The PDF could not be created.");
    }
  }

  const busy = status === "exporting";
  const standardPage = settings.pageSize !== "newspaper";

  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="studio-dialog pdf-export-dialog">
        <DialogHeader className="studio-dialog-header">
          <DialogTitle>Export newspaper as PDF</DialogTitle>
          <DialogDescription>The file is created on this device. Nothing is uploaded.</DialogDescription>
        </DialogHeader>

        <div className="studio-dialog-body pdf-export-body">
          <div className="pdf-export-intro">
            <FileText />
            <div><strong>{issueName}</strong><span>Illustrations, typography, columns, and paper texture are captured from the final proof.</span></div>
          </div>

          <div className="pdf-settings-grid">
            <div className="field-stack pdf-filename-field">
              <Label htmlFor="pdf-filename">File name</Label>
              <Input id="pdf-filename" value={settings.filename} onChange={(event) => update("filename", event.target.value)} />
            </div>
            <div className="field-stack">
              <Label htmlFor="pdf-page-size">Page size</Label>
              <NativeSelect id="pdf-page-size" value={settings.pageSize} onChange={(event) => update("pageSize", event.target.value as PdfPageSize)}>
                <NativeSelectOption value="newspaper">Match newspaper canvas</NativeSelectOption>
                <NativeSelectOption value="letter">US Letter</NativeSelectOption>
                <NativeSelectOption value="a4">A4</NativeSelectOption>
                <NativeSelectOption value="tabloid">Tabloid (11 × 17)</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="field-stack">
              <Label htmlFor="pdf-orientation">Orientation</Label>
              <NativeSelect id="pdf-orientation" value={settings.orientation} onChange={(event) => update("orientation", event.target.value as PdfOrientation)}>
                <NativeSelectOption value="portrait">Portrait</NativeSelectOption>
                <NativeSelectOption value="landscape">Landscape</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="field-stack">
              <Label htmlFor="pdf-pagination">Layout</Label>
              <NativeSelect id="pdf-pagination" value={settings.pagination} disabled={!standardPage} onChange={(event) => update("pagination", event.target.value as PdfPagination)}>
                <NativeSelectOption value="single">Fit to one page</NativeSelectOption>
                <NativeSelectOption value="multipage">Tile across pages</NativeSelectOption>
              </NativeSelect>
              {!standardPage && <span className="field-hint">Canvas size always exports as one continuous page.</span>}
            </div>
            <div className="field-stack">
              <Label htmlFor="pdf-margin">Margins</Label>
              <NativeSelect id="pdf-margin" value={settings.marginInches} onChange={(event) => update("marginInches", Number(event.target.value))}>
                <NativeSelectOption value={0}>None</NativeSelectOption>
                <NativeSelectOption value={0.125}>⅛ inch</NativeSelectOption>
                <NativeSelectOption value={0.25}>¼ inch</NativeSelectOption>
                <NativeSelectOption value={0.5}>½ inch</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="field-stack">
              <Label htmlFor="pdf-quality">Image quality</Label>
              <NativeSelect id="pdf-quality" value={settings.quality} onChange={(event) => update("quality", event.target.value as PdfQuality)}>
                <NativeSelectOption value="draft">Draft — smaller file</NativeSelectOption>
                <NativeSelectOption value="standard">Standard</NativeSelectOption>
                <NativeSelectOption value="high">High — larger file</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <div className="pdf-switch-row">
            <span><strong>Include paper aging</strong><small>Keep stains, folds, wrinkles, and weathering in the PDF.</small></span>
            <Switch checked={settings.includeWeathering} onCheckedChange={(checked) => update("includeWeathering", checked)} aria-label="Include paper aging" />
          </div>

          {status === "exporting" && <div className="pdf-export-status" role="status"><LoaderCircle /> Building PDF on this device…</div>}
          {status === "error" && <div className="pdf-export-status pdf-export-error" role="alert"><TriangleAlert /> {error}</div>}
        </div>

        <DialogFooter className="studio-dialog-footer">
          <div className="dialog-footer-secondary"><DialogClose asChild><Button variant="outline" disabled={busy}>Cancel</Button></DialogClose></div>
          <div className="dialog-footer-primary"><Button onClick={createPdf} disabled={busy || !settings.filename.trim()}>{busy ? <LoaderCircle className="pdf-export-spinner" /> : <Download />} {busy ? "Creating PDF…" : "Download PDF"}</Button></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
