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

const mastheadFonts = {
  blackletter: "Georgia, 'Times New Roman', serif",
  roman: "'Palatino Linotype', Palatino, Georgia, serif",
  modern: "'Arial Narrow', Arial, sans-serif",
};

const headlineFonts = {
  classic: "Georgia, 'Times New Roman', serif",
  condensed: "'Arial Narrow', 'Roboto Condensed', Arial, sans-serif",
  elegant: "'Palatino Linotype', Palatino, Georgia, serif",
};

const bodyFonts = {
  news: "Georgia, 'Times New Roman', serif",
  book: "'Palatino Linotype', Palatino, Georgia, serif",
  clean: "Arial, Helvetica, sans-serif",
};

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
    "--news-accent": colorThemes[settings.colorTheme],
    "--news-paper": `hsl(43 38% ${paperLightness}%)`,
    "--masthead-font": mastheadFonts[settings.mastheadFont as keyof typeof mastheadFonts],
    "--headline-font": headlineFonts[settings.headlineFont as keyof typeof headlineFonts],
    "--body-font": bodyFonts[settings.bodyFont as keyof typeof bodyFonts],
    "--body-size": `${settings.bodySize}px`,
    "--body-leading": settings.lineHeight,
    "--headline-scale": settings.headlineScale,
    "--story-columns": settings.columns,
  } as CSSProperties;

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
    <div className={`newspaper-page page-${settings.pageSize} ${settings.showRules ? "with-rules" : ""} ${settings.justifyText ? "is-justified" : ""} ${settings.showDropCaps ? "with-dropcaps" : ""} ${finalized ? "is-finalized" : "is-editing"}`} style={style}>
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

      <main className="newspaper-grid" style={{ gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))` }}>
        {issue.stories.map((story, index) => {
          const span = storyColumnSpan(story, settings.columns);
          const illustration = story.illustrationId ? illustrationById.get(story.illustrationId) : undefined;
          const illustrationAlign = story.kind === "comic" ? "center" : story.illustrationAlign ?? "right";
          const storyStyle = {
            gridColumn: `span ${span}`,
            gridRowEnd: storyRows[story.id] ? `span ${storyRows[story.id]}` : undefined,
            minHeight: story.minHeight ? `${story.minHeight}px` : undefined,
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
              onDragOver={(event) => { if (!finalized) event.preventDefault(); }}
              onDrop={() => {
                if (!finalized && draggedIndex !== null && draggedIndex !== index) onMove(draggedIndex, index);
                setDraggedIndex(null);
              }}
              tabIndex={finalized ? undefined : 0}
              onKeyDown={(event) => {
                if (!finalized && (event.key === "Enter" || event.key === " ")) onSelect(story.id);
              }}
              aria-label={finalized ? undefined : `Edit story: ${story.title}`}
            >
              {!finalized && (
                <>
                  <span
                    className="story-drag-handle"
                    role="button"
                    tabIndex={0}
                    draggable
                    title="Drag to reorder story"
                    aria-label={`Drag to reorder ${story.title}`}
                    onClick={(event) => event.stopPropagation()}
                    onDragStart={(event) => {
                      setDraggedIndex(index);
                      event.dataTransfer.effectAllowed = "move";
                      event.stopPropagation();
                    }}
                    onDragEnd={() => setDraggedIndex(null)}
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
    </div>
  );
}
