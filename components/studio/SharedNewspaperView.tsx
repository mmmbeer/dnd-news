"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileDown, FilePlus2, LoaderCircle, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { NewspaperPage } from "@/components/studio/NewspaperPage";
import { PdfExportDialog } from "@/components/studio/PdfExportDialog";
import type { NewspaperIssue } from "@/lib/news/types";

interface SharedNewspaperViewProps {
  id: string;
}

interface SharedSnapshotResponse {
  issue: NewspaperIssue;
  createdAt: number;
  expiresAt: number;
}

export function SharedNewspaperView({ id }: SharedNewspaperViewProps) {
  const [snapshot, setSnapshot] = useState<SharedSnapshotResponse | null>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(85);
  const [pdfExportOpen, setPdfExportOpen] = useState(false);

  useEffect(() => {
    let current = true;
    const controller = new AbortController();

    fetch(`/api/newspapers/${encodeURIComponent(id)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as SharedSnapshotResponse & { error?: string };
        if (!response.ok) throw new Error(data.error || "This newspaper could not be opened.");
        return data;
      })
      .then((data) => { if (current) setSnapshot(data); })
      .catch((reason: unknown) => {
        if (current && !(reason instanceof DOMException && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "This newspaper could not be opened.");
        }
      });

    return () => {
      current = false;
      controller.abort();
    };
  }, [id]);

  if (!snapshot && !error) {
    return (
      <main className="shared-loading" role="status">
        <LoaderCircle />
        <strong>Opening newspaper…</strong>
      </main>
    );
  }

  if (!snapshot) {
    return (
      <main className="shared-unavailable">
        <Newspaper />
        <h1>Newspaper unavailable</h1>
        <p>{error}</p>
        <Button asChild><Link href="/"><FilePlus2 /> Create your own newspaper</Link></Button>
      </main>
    );
  }

  const { issue, expiresAt } = snapshot;
  const noChange = () => undefined;

  return (
    <div className="shared-newspaper-shell">
      <header className="shared-toolbar">
        <div className="brand-lockup">
          <div className="brand-mark">B</div>
          <div><strong>Broadsheet</strong><span>Shared newspaper</span></div>
        </div>
        <div className="shared-toolbar-details">
          <strong>{issue.settings.newspaperName}</strong>
          <span>Read-only edition · available through {new Date(expiresAt).toLocaleDateString([], { dateStyle: "long" })}</span>
        </div>
        <div className="shared-toolbar-actions">
          <NativeSelect size="sm" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Newspaper zoom">
            {[60, 70, 85, 100, 115].map((value) => <NativeSelectOption key={value} value={value}>{value}%</NativeSelectOption>)}
          </NativeSelect>
          <Button variant="ghost" size="sm" onClick={() => setPdfExportOpen(true)}><FileDown /> PDF</Button>
          <Button asChild size="sm"><Link href="/"><FilePlus2 /> Create your own</Link></Button>
        </div>
      </header>

      <main className="shared-page-scroll">
        <div className="shared-page-zoom" style={{ zoom: `${zoom}%` }}>
          <NewspaperPage
            issue={issue}
            selectedId=""
            finalized
            onSelect={noChange}
            onEdit={noChange}
            onDelete={noChange}
            onMove={noChange}
            onChooseImage={noChange}
            onRemoveImage={noChange}
            onStoryChange={noChange}
            onSettingsChange={noChange}
          />
        </div>
      </main>
      {pdfExportOpen && (
        <PdfExportDialog
          open
          issueName={issue.settings.newspaperName}
          newspaperPageSize={issue.settings.pageSize}
          onOpenChange={setPdfExportOpen}
        />
      )}
    </div>
  );
}
