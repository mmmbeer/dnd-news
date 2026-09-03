"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ImageOff } from "lucide-react";
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
import { categoryLabels } from "@/lib/news/generator";
import { storyIllustrations, type IllustrationKind } from "@/lib/news/illustrations";
import type { NewsStory } from "@/lib/news/types";

type ImageFilter = "all" | IllustrationKind;

interface ImagePickerDialogProps {
  story?: NewsStory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (illustrationId: string | null) => void;
}

const filters: Array<{ value: ImageFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "generated", label: "Illustrations" },
  { value: "historical", label: "Engravings" },
  { value: "cartoon", label: "Cartoons" },
];

export function ImagePickerDialog({ story, open, onOpenChange, onApply }: ImagePickerDialogProps) {
  const [filter, setFilter] = useState<ImageFilter>(story?.kind === "comic" ? "cartoon" : "all");
  const [selectedId, setSelectedId] = useState<string | null>(story?.illustrationId ?? null);

  const images = useMemo(
    () => filter === "all" ? storyIllustrations : storyIllustrations.filter((image) => image.kind === filter),
    [filter],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="studio-dialog image-picker-dialog" showCloseButton>
        <DialogHeader className="studio-dialog-header">
          <div>
            <span className="eyebrow">{story?.title}</span>
            <DialogTitle>Choose featured image</DialogTitle>
            <DialogDescription>Select any illustration, public-domain engraving, or editorial cartoon.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="studio-dialog-body image-picker-body">
          <div className="image-filter-tabs" role="tablist" aria-label="Image type">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={filter === item.value}
                className={filter === item.value ? "is-active" : ""}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="image-library-grid" role="listbox" aria-label="Available story images">
            {images.map((artwork) => {
              const selected = artwork.id === selectedId;
              return (
                <button
                  key={artwork.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`image-library-card ${selected ? "is-selected" : ""}`}
                  onClick={() => setSelectedId(artwork.id)}
                >
                  <span className="image-library-thumb">
                    <Image src={artwork.src} alt={artwork.alt} width={180} height={180} />
                    {selected && <span className="image-selected-mark"><Check aria-hidden="true" /></span>}
                  </span>
                  <strong>{artwork.label}</strong>
                  <small>{artwork.creator || categoryLabels[artwork.category]}</small>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="studio-dialog-footer">
          <div className="dialog-footer-secondary">
            <Button type="button" variant="ghost" className="danger-action" disabled={!story?.illustrationId} onClick={() => { onApply(null); onOpenChange(false); }}>
              <ImageOff /> Remove image
            </Button>
          </div>
          <div className="dialog-footer-primary">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" disabled={!selectedId} onClick={() => { onApply(selectedId); onOpenChange(false); }}>Use selected image</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
