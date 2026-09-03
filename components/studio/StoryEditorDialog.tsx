"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, ImageIcon, RefreshCw, Trash2 } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { categoryLabels } from "@/lib/news/generator";
import { illustrationById } from "@/lib/news/illustrations";
import { storyColumnSpan } from "@/lib/news/layout";
import type {
  IllustrationAlignment,
  NewsStory,
  StoryCategory,
  StoryKind,
  StoryWidth,
} from "@/lib/news/types";

interface StoryEditorDialogProps {
  story?: NewsStory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (story: NewsStory) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReroll: (id: string) => void;
  onChooseImage: (id: string) => void;
  pageColumns: number;
}

function Field({ id, label, children, hint }: { id?: string; label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="field-stack">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export function StoryEditorDialog({
  story,
  open,
  onOpenChange,
  onSave,
  onDelete,
  onDuplicate,
  onReroll,
  onChooseImage,
  pageColumns,
}: StoryEditorDialogProps) {
  const [draft, setDraft] = useState<NewsStory | undefined>(story);

  if (!draft) return null;
  const artwork = illustrationById.get(draft.illustrationId ?? "");
  const wordCount = draft.body.trim().split(/\s+/).filter(Boolean).length;
  const availableBodyColumns = storyColumnSpan(draft, pageColumns);

  function change<K extends keyof NewsStory>(key: K, value: NewsStory[K]) {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="studio-dialog story-editor-dialog" showCloseButton>
        <DialogHeader className="studio-dialog-header">
          <div>
            <span className="eyebrow">{draft.kind === "comic" ? "Editorial comic" : "Story"}</span>
            <DialogTitle>Edit story</DialogTitle>
            <DialogDescription>Changes appear in the rendered page after you save.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="studio-dialog-body">
          <Field id="story-headline" label="Headline">
            <Textarea id="story-headline" value={draft.title} rows={2} onChange={(event) => change("title", event.target.value)} />
          </Field>
          <div className="two-fields">
            <Field id="story-kicker" label="Kicker">
              <Input id="story-kicker" value={draft.kicker} onChange={(event) => change("kicker", event.target.value)} />
            </Field>
            <Field id="story-dateline" label="Dateline">
              <Input id="story-dateline" value={draft.location} onChange={(event) => change("location", event.target.value.toUpperCase())} />
            </Field>
          </div>
          <Field id="story-dek" label={draft.kind === "comic" ? "Caption" : "Deck / summary"}>
            <Textarea id="story-dek" value={draft.dek} rows={3} onChange={(event) => change("dek", event.target.value)} />
          </Field>
          <Field id="story-byline" label={draft.kind === "comic" ? "Artist credit" : "Byline"}>
            <Input id="story-byline" value={draft.byline} onChange={(event) => change("byline", event.target.value)} />
          </Field>

          <div className={draft.kind === "comic" ? "three-fields" : "four-fields"}>
            <Field id="story-format" label="Format">
              <NativeSelect id="story-format" value={draft.kind} onChange={(event) => change("kind", event.target.value as StoryKind)}>
                <NativeSelectOption value="lead">Lead</NativeSelectOption>
                <NativeSelectOption value="news">News</NativeSelectOption>
                <NativeSelectOption value="brief">Brief</NativeSelectOption>
                <NativeSelectOption value="notice">Notice</NativeSelectOption>
                <NativeSelectOption value="advert">Advert</NativeSelectOption>
                <NativeSelectOption value="obituary">Obituary</NativeSelectOption>
                <NativeSelectOption value="comic">Comic column</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field id="story-width" label="Column span">
              <NativeSelect
                id="story-width"
                value={draft.width}
                onChange={(event) => {
                  change("width", event.target.value as StoryWidth);
                  change("columnSpan", undefined);
                  change("bodyColumns", undefined);
                }}
              >
                <NativeSelectOption value="standard">1 column</NativeSelectOption>
                <NativeSelectOption value="wide">2 columns</NativeSelectOption>
                <NativeSelectOption value="full">Full width</NativeSelectOption>
              </NativeSelect>
            </Field>
            {draft.kind !== "comic" && (
              <Field id="story-body-columns" label="Text columns" hint="Automatic follows the story width">
                <NativeSelect
                  id="story-body-columns"
                  value={draft.bodyColumns ? String(draft.bodyColumns) : "auto"}
                  onChange={(event) => change("bodyColumns", event.target.value === "auto" ? undefined : Number(event.target.value))}
                >
                  <NativeSelectOption value="auto">Automatic</NativeSelectOption>
                  {Array.from({ length: availableBodyColumns }, (_, index) => index + 1).map((column) => (
                    <NativeSelectOption key={column} value={column}>{column}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            )}
            <Field id="story-section" label="Section">
              <NativeSelect id="story-section" value={draft.category} onChange={(event) => change("category", event.target.value as Exclude<StoryCategory, "any">)}>
                {Object.entries(categoryLabels).filter(([key]) => key !== "any").map(([key, label]) => (
                  <NativeSelectOption key={key} value={key}>{label}</NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </div>

          <Field id="story-body" label={draft.kind === "comic" ? "Additional copy" : "Story body"} hint={`${wordCount} words · Blank lines create paragraphs`}>
            <Textarea id="story-body" className="story-body-input" value={draft.body} rows={12} onChange={(event) => change("body", event.target.value)} />
          </Field>

          <div className="story-editor-art">
            <div className="inspector-divider"><span>Featured image</span></div>
            {artwork ? (
              <button type="button" className="art-control-preview art-control-button" onClick={() => { onSave(draft); onOpenChange(false); onChooseImage(draft.id); }}>
                <Image src={artwork.src} alt="" width={116} height={116} unoptimized />
                <span>
                  <strong>{artwork.label}</strong>
                  <small>{artwork.creator ? `${artwork.creator} · ${artwork.license}` : categoryLabels[artwork.category]}</small>
                </span>
                <ImageIcon aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="empty-art-button" onClick={() => { onSave(draft); onOpenChange(false); onChooseImage(draft.id); }}><ImageIcon /> Choose an image</button>
            )}
            {artwork && draft.kind !== "comic" && (
              <>
                <Field id="story-image-caption" label="Image caption">
                  <Input
                    id="story-image-caption"
                    value={draft.illustrationCaption ?? ""}
                    onChange={(event) => change("illustrationCaption", event.target.value)}
                  />
                </Field>
                <div className="two-fields">
                  <Field id="story-image-flow" label="Text flow">
                    <NativeSelect id="story-image-flow" value={draft.illustrationAlign} onChange={(event) => change("illustrationAlign", event.target.value as IllustrationAlignment)}>
                      <NativeSelectOption value="left">Image left</NativeSelectOption>
                      <NativeSelectOption value="right">Image right</NativeSelectOption>
                      <NativeSelectOption value="center">Image centered</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                  <div className="range-field">
                    <div className="range-label"><Label>Image size</Label><span>{draft.illustrationScale ?? 44}%</span></div>
                    <Slider value={[draft.illustrationScale ?? 44]} min={20} max={100} step={2} onValueChange={(next) => change("illustrationScale", next[0])} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="switch-row compact">
            <span><strong>Lock this story</strong><small>Keep it when generated filler is rerolled</small></span>
            <Switch checked={draft.locked} onCheckedChange={(value) => change("locked", value)} aria-label="Lock this story" />
          </div>
        </div>

        <DialogFooter className="studio-dialog-footer">
          <div className="dialog-footer-secondary">
            <Button type="button" variant="ghost" size="sm" onClick={() => { onDuplicate(draft.id); onOpenChange(false); }}><Copy /> Duplicate</Button>
            {draft.generated && <Button type="button" variant="ghost" size="sm" onClick={() => { onReroll(draft.id); onOpenChange(false); }}><RefreshCw /> Rewrite</Button>}
            <Button type="button" variant="ghost" size="sm" className="danger-action" onClick={() => { onDelete(draft.id); onOpenChange(false); }}><Trash2 /> Remove</Button>
          </div>
          <div className="dialog-footer-primary">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={() => { onSave(draft); onOpenChange(false); }}>Save story</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
