"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { Edit3, Grip, ImageIcon, Trash2 } from "lucide-react";
import { InlineTextFormattingController } from "@/components/studio/InlineTextFormattingController";
import { PaperWeatheringOverlay } from "@/components/studio/PaperWeatheringOverlay";
import { fontFamilyFor } from "@/lib/news/fonts";
import type { NewsStory, NewspaperIssue, IssueSettings } from "@/lib/news/types";
import { illustrationById } from "@/lib/news/illustrations";
import { storyBodyColumns, storyColumnSpan } from "@/lib/news/layout";
import { masonryRowSpan } from "@/lib/news/masonry";

interface NewspaperPageProps {
  issue: NewspaperIssue;
  selectedId: string;
  finalized: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onChooseImage: (id: string) => void;
  onStoryChange: <K extends keyof NewsStory>(id: string, key: K, value: NewsStory[K]) => void;
  onSettingsChange: <K extends keyof IssueSettings>(key: K, value: IssueSettings[K]) => void;
}

const colorThemes = {
  charcoal: "#20201e",
  oxblood: "#721c24",
  navy: "#193451",
  forest: "#214c3a",
};

type DropSide = "left" | "right" | "top" | "bottom" | "margin-left" | "margin-right";

interface DropHint {
  targetId: string;
  toIndex: number;
  side: DropSide;
  valid: boolean;
}

interface MeasuredStory {
  id: string;
  index: number;
  rect: DOMRect;
}

function insertionIndex(from: number, target: number, after: boolean, count: number) {
  let to = target + (after ? 1 : 0);
  if (to > from) to -= 1;
  return Math.max(0, Math.min(count - 1, to));
}

function distanceToRect(x: number, y: number, rect: DOMRect) {
  const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
  const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
  if (dx || dy) return Math.hypot(dx, dy);
  return Math.hypot(x - (rect.left + rect.right) / 2, y - (rect.top + rect.bottom) / 2) * 0.01;
}

function edgeForPoint(x: number, y: number, rect: DOMRect): Exclude<DropSide, "margin-left" | "margin-right"> {
  const distances = [
    ["left", Math.abs(x - rect.left)],
    ["right", Math.abs(x - rect.right)],
    ["top", Math.abs(y - rect.top)],
    ["bottom", Math.abs(y - rect.bottom)],
  ] as const;
  return [...distances].sort((a, b) => a[1] - b[1])[0][0];
}

function guideStyle(side: DropSide): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    zIndex: 12,
    pointerEvents: "none",
    background: "#2f9859",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.72), 0 0 9px rgba(47,152,89,0.55)",
  };
  if (side === "left" || side === "margin-left") return { ...base, top: 2, bottom: 2, left: -2, width: 4 };
  if (side === "right" || side === "margin-right") return { ...base, top: 2, bottom: 2, right: -2, width: 4 };
  if (side === "top") return { ...base, top: -2, left: 2, right: 2, height: 4 };
  return { ...base, bottom: -2, left: 2, right: 2, height: 4 };
}

function dropHintLabel(side: DropSide) {
  switch (side) {
    case "margin-left": return "Snap to left paper margin";
    case "margin-right": return "Snap to right paper margin";
    case "left": return "Snap left of article";
    case "right": return "Snap right of article";
    case "top": return "Place before article";
    case "bottom": return "Place after article";
  }
}

function EditableText({
  as: Component = "span",
  value,
  finalized,
  className,
  multiline = false,
  onChange,
}: {
  as?: ElementType;
  value: string;
  finalized: boolean;
  className?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Component
      className={`${className ?? ""} ${finalized ? "" : "preview-editable"}`.trim()}
      contentEditable={!finalized}
      suppressContentEditableWarning
      spellCheck={!finalized}
      onClick={(event: React.MouseEvent) => event.stopPropagation()}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        event.stopPropagation();
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const next = multiline ? event.currentTarget.innerText : event.currentTarget.textContent ?? "";
        if (next !== value) onChange(next);
      }}
    >
      {value}
    </Component>
  );
}

function StoryBody({ story, columns, finalized, onChange }: { story: NewsStory; columns: number; finalized: boolean; onChange: (value: string) => void }) {
  const isEmpty = !story.body.trim();
  const bodyColumns = storyBodyColumns(story, columns);
  return (
    <div
      className={`newspaper-copy ${isEmpty ? "is-empty" : ""} ${finalized ? "" : "preview-editable"}`.trim()}
      style={{ columnCount: bodyColumns }}
      contentEditable={!finalized}
      suppressContentEditableWarning
      spellCheck={!finalized}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      onBlur={(event) => {
        const next = event.currentTarget.innerText.trim();
        if (next !== story.body) onChange(next);
      }}
    >
      {story.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
        <p key={`${story.id}-${index}`}>{paragraph}</p>
      ))}
      {isEmpty && !finalized && <p className="empty-copy-placeholder">Click to add story copy</p>}
    </div>
  );
}

export function NewspaperPage({
  issue,
  selectedId,
  finalized,
  onSelect,
  onEdit,
  onDelete,
  onMove,
  onChooseImage,
  onStoryChange,
  onSettingsChange,
}: NewspaperPageProps) {
  const { settings } = issue;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropHint, setDropHint] = useState<DropHint | null>(null);
  const gridRef = useRef<HTMLElement | null>(null);
  const storyElements = useRef(new Map<string, HTMLElement>());
  const [storyRows, setStoryRows] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    let animationFrame = 0;

    const measureStories = () => {
      const nextRows: Record<string, number> = {};

      for (const story of issue.stories) {
        const element = storyElements.current.get(story.id);
        if (!element) continue;

        const styles = window.getComputedStyle(element);
        const verticalMargins = Number.parseFloat(styles.marginTop) + Number.parseFloat(styles.marginBottom);
        nextRows[story.id] = masonryRowSpan(element.offsetHeight + verticalMargins);
      }

      setStoryRows((currentRows) => {
        const currentIds = Object.keys(currentRows);
        const nextIds = Object.keys(nextRows);
        const unchanged = currentIds.length === nextIds.length
          && nextIds.every((id) => currentRows[id] === nextRows[id]);
        return unchanged ? currentRows : nextRows;
      });
    };

    const scheduleMeasurement = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(measureStories);
    };

    measureStories();
    const observer = new ResizeObserver(scheduleMeasurement);
    storyElements.current.forEach((element) => observer.observe(element));
    window.addEventListener("beforeprint", measureStories);

    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", measureStories);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [issue.stories, settings, finalized]);

  const paperLightness = 97 - settings.paperTone * 0.045;
  const style = {
    position: "relative",
    "--news-accent": colorThemes[settings.colorTheme],
    "--news-paper": `hsl(43 38% ${paperLightness}%)`,
    "--masthead-font": fontFamilyFor("masthead", settings.mastheadFont),
    "--headline-font": fontFamilyFor("headline", settings.headlineFont),
    "--body-font": fontFamilyFor("body", settings.bodyFont),
    "--body-size": `${settings.bodySize}px`,
    "--body-leading": settings.lineHeight,
    "--headline-scale": settings.headlineScale,
    "--story-columns": settings.columns,
  } as CSSProperties;

  const storyEntries = issue.stories.map((story, originalIndex) => ({ story, originalIndex }));
  const displayEntries = (() => {
    if (draggedIndex === null || !dropHint?.valid || dropHint.toIndex === draggedIndex) return storyEntries;
    const entries = [...storyEntries];
    const sourcePosition = entries.findIndex((entry) => entry.originalIndex === draggedIndex);
    if (sourcePosition < 0) return entries;
    const [dragged] = entries.splice(sourcePosition, 1);
    entries.splice(dropHint.toIndex, 0, dragged);
    return entries;
  })();

  function clearDragState() {
    setDraggedIndex(null);
    setDropHint(null);
  }

  function updateDropPlacement(clientX: number, clientY: number) {
    if (draggedIndex === null) return;
    const grid = gridRef.current;
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();
    if (clientX < gridRect.left || clientX > gridRect.right || clientY < gridRect.top || clientY > gridRect.bottom) {
      setDropHint(null);
      return;
    }

    const measured = issue.stories.flatMap<MeasuredStory>((story, index) => {
      if (index === draggedIndex) return [];
      const element = storyElements.current.get(story.id);
      return element ? [{ id: story.id, index, rect: element.getBoundingClientRect() }] : [];
    });
    if (!measured.length) return;

    const marginSnap = Math.max(24, Math.min(44, gridRect.width / settings.columns * 0.28));
    let target: MeasuredStory;
    let side: DropSide;

    if (clientX <= gridRect.left + marginSnap || clientX >= gridRect.right - marginSnap) {
      const sameBand = measured.filter(({ rect }) => clientY >= rect.top - 14 && clientY <= rect.bottom + 14);
      const pool = sameBand.length ? sameBand : measured;
      const verticalDistance = (entry: MeasuredStory) => Math.abs(clientY - (entry.rect.top + entry.rect.bottom) / 2);
      if (clientX <= gridRect.left + marginSnap) {
        target = [...pool].sort((a, b) => a.rect.left - b.rect.left || verticalDistance(a) - verticalDistance(b))[0];
        side = "margin-left";
      } else {
        target = [...pool].sort((a, b) => b.rect.right - a.rect.right || verticalDistance(a) - verticalDistance(b))[0];
        side = "margin-right";
      }
    } else {
      target = [...measured].sort((a, b) => distanceToRect(clientX, clientY, a.rect) - distanceToRect(clientX, clientY, b.rect))[0];
      side = edgeForPoint(clientX, clientY, target.rect);
    }

    const after = side === "right" || side === "bottom" || side === "margin-right";
    const toIndex = insertionIndex(draggedIndex, target.index, after, issue.stories.length);
    const nextHint: DropHint = {
      targetId: target.id,
      toIndex,
      side,
      valid: toIndex !== draggedIndex,
    };
    setDropHint((current) => current
      && current.targetId === nextHint.targetId
      && current.toIndex === nextHint.toIndex
      && current.side === nextHint.side
      && current.valid === nextHint.valid
      ? current
      : nextHint);
  }

  function startStoryResize(event: ReactPointerEvent<HTMLButtonElement>, story: NewsStory, axis: "horizontal" | "vertical") {
    event.preventDefault();
    event.stopPropagation();
    const article = event.currentTarget.closest("article");
    const grid = event.currentTarget.closest(".newspaper-grid");
    if (!article || !grid) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const startSpan = storyColumnSpan(story, settings.columns);
    const startHeight = article.getBoundingClientRect().height;
    const columnWidth = grid.getBoundingClientRect().width / settings.columns;

    function handlePointerMove(moveEvent: PointerEvent) {
      if (axis === "horizontal") {
        const span = Math.max(1, Math.min(settings.columns, Math.round(startSpan + (moveEvent.clientX - startX) / columnWidth)));
        onStoryChange(story.id, "columnSpan", span);
        onStoryChange(story.id, "width", span === 1 ? "standard" : span === settings.columns ? "full" : "wide");
        if (story.bodyColumns && story.bodyColumns > span) onStoryChange(story.id, "bodyColumns", span);
      } else {
        onStoryChange(story.id, "minHeight", Math.max(90, Math.round(startHeight + moveEvent.clientY - startY)));
      }
    }

    function stopResize() {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopResize);
      document.body.classList.remove("is-resizing-layout");
    }

    document.body.classList.add("is-resizing-layout");
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopResize, { once: true });
  }

  function startImageResize(event: ReactPointerEvent<HTMLButtonElement>, story: NewsStory) {
    event.preventDefault();
    event.stopPropagation();
    const article = event.currentTarget.closest("article");
    if (!article) return;
    const startX = event.clientX;
    const startScale = story.illustrationScale ?? (story.kind === "lead" ? 28 : story.width === "wide" ? 32 : 44);
    const articleWidth = article.getBoundingClientRect().width;

    function handlePointerMove(moveEvent: PointerEvent) {
      const scale = Math.max(20, Math.min(100, Math.round(startScale + ((moveEvent.clientX - startX) / articleWidth) * 100)));
      onStoryChange(story.id, "illustrationScale", scale);
    }

    function stopResize() {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopResize);
      document.body.classList.remove("is-resizing-layout");
    }

    document.body.classList.add("is-resizing-layout");
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopResize, { once: true });
  }

  return (
    <div
      className={`newspaper-page page-${settings.pageSize} ${settings.showRules ? "with-rules" : ""} ${settings.justifyText ? "is-justified" : ""} ${settings.showDropCaps ? "with-dropcaps" : ""} ${finalized ? "is-finalized" : "is-editing"}`}
      style={style}
      onDragOver={(event) => {
        if (finalized || draggedIndex === null) return;
        if (gridRef.current?.contains(event.target as Node)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "none";
        setDropHint(null);
      }}
    >
      <header className="newspaper-header">
        <EditableText as="div" value={settings.motto} finalized={finalized} onChange={(value) => onSettingsChange("motto", value)} className="newspaper-motto" />
        <EditableText as="h1" value={settings.newspaperName} finalized={finalized} onChange={(value) => onSettingsChange("newspaperName", value)} />
        <div className="newspaper-folio">
          <span>Vol. <EditableText value={settings.volume} finalized={finalized} onChange={(value) => onSettingsChange("volume", value)} /> · No. <EditableText value={settings.issueNumber} finalized={finalized} onChange={(value) => onSettingsChange("issueNumber", value)} /></span>
          <EditableText value={settings.publicationDate} finalized={finalized} onChange={(value) => onSettingsChange("publicationDate", value)} />
          <EditableText value={settings.price} finalized={finalized} onChange={(value) => onSettingsChange("price", value)} />
        </div>
        <div className="newspaper-edition">
          <EditableText value={settings.dateline} finalized={finalized} onChange={(value) => onSettingsChange("dateline", value)} />
          <EditableText as="strong" value={settings.edition} finalized={finalized} onChange={(value) => onSettingsChange("edition", value)} />
        </div>
      </header>

      <main
        ref={gridRef}
        className="newspaper-grid"
        style={{ gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))`, position: "relative" }}
        onDragOver={(event) => {
          if (finalized || draggedIndex === null) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = dropHint?.valid === false ? "none" : "move";
          updateDropPlacement(event.clientX, event.clientY);
        }}
        onDrop={(event) => {
          if (finalized || draggedIndex === null) return;
          event.preventDefault();
          if (dropHint?.valid) onMove(draggedIndex, dropHint.toIndex);
          clearDragState();
        }}
        onDragLeave={(event) => {
          const related = event.relatedTarget as Node | null;
          if (!related || !event.currentTarget.contains(related)) setDropHint(null);
        }}
      >
        {displayEntries.map(({ story, originalIndex }) => {
          const span = storyColumnSpan(story, settings.columns);
          const illustration = story.illustrationId ? illustrationById.get(story.illustrationId) : undefined;
          const illustrationAlign = story.kind === "comic" ? "center" : story.illustrationAlign ?? "right";
          const isDragged = draggedIndex === originalIndex;
          const isDropTarget = draggedIndex !== null && dropHint?.targetId === story.id;
          const validDropTarget = isDropTarget && dropHint?.valid;
          const storyStyle = {
            gridColumn: `span ${span}`,
            gridRowEnd: storyRows[story.id] ? `span ${storyRows[story.id]}` : undefined,
            minHeight: story.minHeight ? `${story.minHeight}px` : undefined,
            ...(isDragged ? {
              opacity: 0.56,
              outline: "2px dashed rgba(47, 152, 89, 0.82)",
              outlineOffset: "-2px",
              background: "rgba(47, 152, 89, 0.045)",
            } : {}),
            ...(isDropTarget ? {
              zIndex: 4,
              outline: validDropTarget ? "3px solid rgba(47, 152, 89, 0.92)" : "3px solid rgba(180, 107, 44, 0.88)",
              outlineOffset: "-3px",
              background: validDropTarget ? "rgba(47, 152, 89, 0.085)" : "rgba(180, 107, 44, 0.07)",
            } : {}),
          } as CSSProperties;
          const artStyle = story.illustrationScale ? { "--art-width": `${story.illustrationScale}%` } as CSSProperties : undefined;

          return (
            <article
              key={story.id}
              ref={(element) => {
                if (element) storyElements.current.set(story.id, element);
                else storyElements.current.delete(story.id);
              }}
              className={`newspaper-story story-${story.kind} story-${story.width} ${!finalized && selectedId === story.id ? "is-selected" : ""}`}
              style={storyStyle}
              onClick={() => !finalized && onSelect(story.id)}
              onFocusCapture={() => !finalized && onSelect(story.id)}
              tabIndex={finalized ? undefined : 0}
              onKeyDown={(event) => {
                if (!finalized && (event.key === "Enter" || event.key === " ")) onSelect(story.id);
              }}
              aria-label={finalized ? undefined : `Edit story: ${story.title}`}
            >
              {isDropTarget && dropHint && (
                <>
                  <span style={guideStyle(dropHint.side)} aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      zIndex: 13,
                      top: 7,
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "3px 6px",
                      background: validDropTarget ? "#215f3a" : "#7b4d26",
                      color: "#fffdf4",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.28)",
                      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                      fontSize: 8,
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: "0.055em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                    }}
                  >
                    {validDropTarget ? dropHintLabel(dropHint.side) : "Already here"}
                  </span>
                </>
              )}

              {!finalized && (
                <>
                  <span
                    className="story-drag-handle"
                    role="button"
                    tabIndex={0}
                    draggable
                    title="Drag to reposition story; edges and paper margins snap"
                    aria-label={`Drag to reposition ${story.title}`}
                    onClick={(event) => event.stopPropagation()}
                    onDragStart={(event) => {
                      setDraggedIndex(originalIndex);
                      setDropHint(null);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", story.id);
                      const article = event.currentTarget.closest("article");
                      if (article instanceof HTMLElement) event.dataTransfer.setDragImage(article, 20, 20);
                      event.stopPropagation();
                    }}
                    onDragEnd={clearDragState}
                  ><Grip aria-hidden="true" /></span>
                  <span className="story-preview-tools">
                    <button type="button" onClick={(event) => { event.stopPropagation(); onChooseImage(story.id); }} aria-label={illustration ? "Change image" : "Add image"} title={illustration ? "Change image" : "Add image"}><ImageIcon /></button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); onEdit(story.id); }} aria-label="Edit story" title="Edit story"><Edit3 /></button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(story.id); }} aria-label="Remove story" title="Remove story"><Trash2 /></button>
                  </span>
                  <button type="button" className="story-resize-handle resize-horizontal" onPointerDown={(event) => startStoryResize(event, story, "horizontal")} aria-label="Resize story column span" title="Drag to change column span" />
                  <button type="button" className="story-resize-handle resize-vertical" onPointerDown={(event) => startStoryResize(event, story, "vertical")} aria-label="Resize story height" title="Drag to change story height" />
                </>
              )}

              {story.kicker && <EditableText as="div" value={story.kicker} finalized={finalized} onChange={(value) => onStoryChange(story.id, "kicker", value)} className="story-kicker" />}
              <EditableText as="h2" value={story.title} finalized={finalized} onChange={(value) => onStoryChange(story.id, "title", value)} />
              {story.dek && <EditableText as="p" value={story.dek} finalized={finalized} onChange={(value) => onStoryChange(story.id, "dek", value)} className="story-dek" multiline />}
              {story.kind !== "comic" && (
                <div className="story-byline">By <EditableText value={story.byline} finalized={finalized} onChange={(value) => onStoryChange(story.id, "byline", value)} /></div>
              )}
              {illustration && (
                <figure
                  className={`story-art story-art-${illustration.kind} art-align-${illustrationAlign}`}
                  style={artStyle}
                  title={illustration.sourceTitle ? `${illustration.sourceTitle} — ${illustration.creator} — ${illustration.license}` : illustration.label}
                  onClick={(event) => { if (!finalized) { event.stopPropagation(); onChooseImage(story.id); } }}
                >
                  <Image src={illustration.src} alt={illustration.alt} width={512} height={512} unoptimized />
                  <figcaption>{story.illustrationCaption || (story.kind === "comic" ? "Editorial cartoon" : illustration.alt)}</figcaption>
                  {!finalized && <button type="button" className="image-resize-handle" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startImageResize(event, story)} aria-label="Resize image" title="Drag to resize image" />}
                </figure>
              )}
              {story.kind === "comic" && story.byline && (
                <div className="story-byline">By <EditableText value={story.byline} finalized={finalized} onChange={(value) => onStoryChange(story.id, "byline", value)} /></div>
              )}
              {story.location && story.kind !== "comic" && <EditableText as="span" value={story.location} finalized={finalized} onChange={(value) => onStoryChange(story.id, "location", value.toUpperCase())} className="story-location" />}
              <StoryBody story={story} columns={settings.columns} finalized={finalized} onChange={(value) => onStoryChange(story.id, "body", value)} />
              {story.kind === "lead" && <div className="continued-mark">Continued inside</div>}
            </article>
          );
        })}
      </main>

      <footer className="newspaper-footer">
        <span>Printed under charter of the Free Press Guild</span>
        <span>Late notices accepted until third bell</span>
      </footer>
      <InlineTextFormattingController
        issue={issue}
        editable={!finalized}
        onStoryChange={onStoryChange}
        onSettingsChange={onSettingsChange}
      />
      <PaperWeatheringOverlay paperAge={settings.paperTone} enabled={settings.paperWeathering !== false} seed={issue.seed} />
    </div>
  );
}
