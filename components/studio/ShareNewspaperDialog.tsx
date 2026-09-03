"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Download, ExternalLink, LoaderCircle, QrCode, RefreshCw, TriangleAlert } from "lucide-react";
import QRCode from "qrcode";
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

export interface ShareSnapshot {
  url: string;
  expiresAt: number;
}

interface ShareNewspaperDialogProps {
  open: boolean;
  issueName: string;
  loading: boolean;
  error: string | null;
  snapshot: ShareSnapshot | null;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
}

export function ShareNewspaperDialog({
  open,
  issueName,
  loading,
  error,
  snapshot,
  onOpenChange,
  onRetry,
}: ShareNewspaperDialogProps) {
  const [qrCode, setQrCode] = useState<{ url: string; dataUrl: string } | null>(null);
  const [copyState, setCopyState] = useState<{ url: string; label: string } | null>(null);
  const qrDataUrl = qrCode?.url === snapshot?.url ? qrCode?.dataUrl ?? "" : "";
  const copyLabel = copyState?.url === snapshot?.url ? copyState?.label ?? "Copy link" : "Copy link";

  useEffect(() => {
    if (!snapshot?.url) return;

    let current = true;
    QRCode.toDataURL(snapshot.url, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#171714", light: "#fffdf5" },
    }).then((value) => {
      if (current) setQrCode({ url: snapshot.url, dataUrl: value });
    }).catch(() => undefined);

    return () => { current = false; };
  }, [snapshot?.url]);

  async function copyLink() {
    if (!snapshot?.url) return;
    try {
      await navigator.clipboard.writeText(snapshot.url);
      setCopyState({ url: snapshot.url, label: "Copied" });
    } catch {
      setCopyState({ url: snapshot.url, label: "Copy failed" });
    }
  }

  function downloadQrCode() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${issueName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "newspaper"}-qr.png`;
    link.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="studio-dialog share-dialog">
        <DialogHeader className="studio-dialog-header">
          <DialogTitle>Share finalized newspaper</DialogTitle>
          <DialogDescription>
            The link opens a read-only copy and expires automatically after 30 days.
          </DialogDescription>
        </DialogHeader>

        <div className="studio-dialog-body share-dialog-body">
          {loading && (
            <div className="share-dialog-state" role="status">
              <LoaderCircle className="share-spinner" />
              <strong>Saving this edition…</strong>
              <span>Stories, images, and the finalized layout are being preserved.</span>
            </div>
          )}

          {!loading && error && (
            <div className="share-dialog-state share-dialog-error" role="alert">
              <TriangleAlert />
              <strong>Could not create the share link</strong>
              <span>{error}</span>
              <Button variant="outline" onClick={onRetry}><RefreshCw /> Try again</Button>
            </div>
          )}

          {!loading && snapshot && (
            <div className="share-result">
              <div className="share-qr-panel">
                {qrDataUrl ? (
                  <Image src={qrDataUrl} alt={`QR code for the shared ${issueName}`} width={640} height={640} unoptimized />
                ) : (
                  <div className="share-qr-placeholder"><QrCode /><span>Preparing QR code…</span></div>
                )}
              </div>
              <div className="share-link-panel">
                <span className="eyebrow">Read-only edition</span>
                <h3>{issueName}</h3>
                <p>Anyone with this link can read and print this exact edition. They cannot edit it, and later changes to your issue will not alter this copy.</p>
                <label htmlFor="share-newspaper-url">Share link</label>
                <div className="share-url-row">
                  <input id="share-newspaper-url" readOnly value={snapshot.url} onFocus={(event) => event.currentTarget.select()} />
                  <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy share link"><Copy /></Button>
                </div>
                <small>Available until {new Date(snapshot.expiresAt).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}.</small>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="studio-dialog-footer">
          <div className="dialog-footer-secondary">
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
            {snapshot && <Button variant="outline" onClick={downloadQrCode} disabled={!qrDataUrl}><Download /> Download QR</Button>}
          </div>
          <div className="dialog-footer-primary">
            {snapshot && <Button variant="outline" onClick={copyLink}><Copy /> {copyLabel}</Button>}
            {snapshot && <Button asChild><a href={snapshot.url} target="_blank" rel="noreferrer"><ExternalLink /> Open shared view</a></Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
