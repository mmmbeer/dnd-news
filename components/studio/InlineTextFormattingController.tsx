"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  bodyFontOptions,
  headlineFontOptions,
  mastheadFontOptions,
  type NewspaperFontRole,
} from "@/lib/news/fonts";
import type {
  IssueSettings,
  NewsStory,
  NewspaperIssue,
  TextRegionStyle,
  TextRegionStyles,
} from "@/lib/news/types";

interface InlineTextFormattingControllerProps {
  issue: NewspaperIssue;
  editable: boolean;
  onStoryChange: <K extends keyof NewsStory>(id: string, key: K, value: NewsStory[K]) => void;
  onSettingsChange: <K extends keyof IssueSettings>(key: K, value: IssueSettings[K]) => void;
}

type RegionScope = "settings" | "story";

type TextAlignment = NonNullable<TextRegionStyle["textAlign"]>;

interface TextRegion {
  element: HTMLElement;
  scope: RegionScope;
  key: string;
  role: NewspaperFontRole;
  storyId?: string;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

interface ComputedFormat {
  fontSize: number;
  bold: boolean;
  italic: boolean;
  textAlign: string;
}

const FONT_OPTIONS: Record<NewspaperFontRole, typeof bodyFontOptions> = {
  masthead: mastheadFontOptions,
  headline: headlineFontOptions,
  body: bodyFontOptions,
};

const toolbarStyle: CSSProperties = {
  position: "fixed",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: 1,
  height: 20,
  padding: "1px 2px",
  border: "1px solid rgba(32, 31, 27, 0.52)",
  borderRadius: 2,
  background: "rgba(247, 242, 228, 0.98)",
  color: "#292824",
  boxShadow: "0 2px 7px rgba(25, 22, 17, 0.2)",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontSize: 9,
  lineHeight: 1,
};

const buttonBaseStyle: CSSProperties = {
  display: "grid",
  width: 17,
  height: 16,
  padding: 0,
  placeItems: "center",
  border: 0,
  borderRadius: 1,
  background: "transparent",
  color: "inherit",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontSize: 9,
  fontWeight: 700,
  lineHeight: 1,
};

function toolbarButtonStyle(active = false): CSSProperties {
  return active
    ? { ...buttonBaseStyle, background: "rgba(85, 54, 47, 0.16)", color: "#6d2f28" }
    : buttonBaseStyle;
}

function pushRegion(
  regions: TextRegion[],
  element: Element | null | undefined,
  scope: RegionScope,
  key: string,
  role: NewspaperFontRole,
  storyId?: string,
) {
  if (element instanceof HTMLElement) regions.push({ element, scope, key, role, storyId });
}

function collectRegions(page: HTMLElement, issue: NewspaperIssue) {
  const regions: TextRegion[] = [];

  pushRegion(regions, page.querySelector(".newspaper-motto"), "settings", "motto", "body");
  pushRegion(regions, page.querySelector(".newspaper-header h1"), "settings", "newspaperName", "masthead");

  const folio = page.querySelector<HTMLElement>(".newspaper-folio");
  if (folio) {
    const volumeIssue = folio.children.item(0);
    const volumeIssueValues = volumeIssue?.querySelectorAll(":scope > span");
    pushRegion(regions, volumeIssueValues?.item(0), "settings", "volume", "body");
    pushRegion(regions, volumeIssueValues?.item(1), "settings", "issueNumber", "body");
    pushRegion(regions, folio.children.item(1), "settings", "publicationDate", "body");
    pushRegion(regions, folio.children.item(2), "settings", "price", "body");
  }

  const edition = page.querySelector<HTMLElement>(".newspaper-edition");
  if (edition) {
    pushRegion(regions, edition.children.item(0), "settings", "dateline", "body");
    pushRegion(regions, edition.children.item(1), "settings", "edition", "body");
  }

  const articles = [...page.querySelectorAll<HTMLElement>(".newspaper-story")];
  articles.forEach((article, index) => {
    const story = issue.stories[index];
    if (!story) return;
    pushRegion(regions, article.querySelector(".story-kicker"), "story", "kicker", "body", story.id);
    pushRegion(regions, article.querySelector("h2"), "story", "title", "headline", story.id);
    pushRegion(regions, article.querySelector(".story-dek"), "story", "dek", "headline", story.id);
    const byline = article.querySelector<HTMLElement>(".story-byline");
    pushRegion(regions, byline?.querySelector(":scope > span"), "story", "byline", "body", story.id);
    pushRegion(regions, article.querySelector(".story-location"), "story", "location", "body", story.id);
    pushRegion(regions, article.querySelector(".newspaper-copy"), "story", "body", "body", story.id);
  });

  return regions;
}

function styleForRegion(issue: NewspaperIssue, region: TextRegion) {
  if (region.scope === "settings") return issue.settings.textStyles?.[region.key];
  return issue.stories.find((story) => story.id === region.storyId)?.textStyles?.[region.key];
}

function applyTextStyle(element: HTMLElement, style?: TextRegionStyle) {
  element.style.fontFamily = style?.fontFamily ?? "";
  element.style.fontSize = style?.fontSize ? `${style.fontSize}px` : "";
  element.style.fontWeight = style?.fontWeight ? String(style.fontWeight) : "";
  element.style.fontStyle = style?.fontStyle ?? "";
  element.style.textAlign = style?.textAlign ?? "";
}

function cleanStyle(style: TextRegionStyle) {
  return Object.fromEntries(
    Object.entries(style).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ) as TextRegionStyle;
}

function updateStyleMap(styles: TextRegionStyles | undefined, key: string, style: TextRegionStyle) {
  const next = { ...(styles ?? {}) };
  const cleaned = cleanStyle(style);
  if (Object.keys(cleaned).length) next[key] = cleaned;
  else delete next[key];
  return next;
}

export function InlineTextFormattingController({
  issue,
  editable,
  onStoryChange,
  onSettingsChange,
}: InlineTextFormattingControllerProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<TextRegion | null>(null);
  const [position, setPosition] = useState<ToolbarPosition | null>(null);
  const [computedFormat, setComputedFormat] = useState<ComputedFormat | null>(null);

  const pageElement = useCallback(() => hostRef.current?.closest<HTMLElement>(".newspaper-page") ?? null, []);

  const refreshToolbar = useCallback(() => {
    if (!active?.element.isConnected) {
      setActive(null);
      setPosition(null);
      return;
    }

    const rect = active.element.getBoundingClientRect();
    const toolbarWidth = 282;
    const left = Math.max(4, Math.min(rect.left, window.innerWidth - toolbarWidth - 4));
    let top = rect.top - 21;
    if (top < 4) top = Math.min(window.innerHeight - 22, rect.bottom + 1);
    const computed = window.getComputedStyle(active.element);
    const numericWeight = Number.parseInt(computed.fontWeight, 10);

    setPosition({ top, left });
    setComputedFormat({
      fontSize: Number.parseFloat(computed.fontSize) || 10,
      bold: Number.isFinite(numericWeight) ? numericWeight >= 600 : computed.fontWeight === "bold",
      italic: computed.fontStyle === "italic" || computed.fontStyle === "oblique",
      textAlign: computed.textAlign,
    });
  }, [active]);

  useEffect(() => {
    const page = pageElement();
    if (!page) return;
    const frame = window.requestAnimationFrame(() => {
      collectRegions(page, issue).forEach((region) => applyTextStyle(region.element, styleForRegion(issue, region)));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [issue, pageElement]);

  useEffect(() => {
    if (!editable) {
      setActive(null);
      setPosition(null);
      return;
    }

    const page = pageElement();
    if (!page) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (toolbarRef.current?.contains(target)) return;
      if (!page.contains(target)) {
        setActive(null);
        return;
      }

      const editableElement = target.closest<HTMLElement>(".preview-editable");
      if (!editableElement || !page.contains(editableElement)) {
        setActive(null);
        return;
      }

      const region = collectRegions(page, issue).find((candidate) => candidate.element === editableElement) ?? null;
      setActive(region);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (toolbarRef.current?.contains(target)) return;
      if (!target.closest(".preview-editable")) setActive(null);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [editable, issue, pageElement]);

  useLayoutEffect(() => {
    if (!active || !editable) return;
    refreshToolbar();
    window.addEventListener("resize", refreshToolbar);
    window.addEventListener("scroll", refreshToolbar, true);
    return () => {
      window.removeEventListener("resize", refreshToolbar);
      window.removeEventListener("scroll", refreshToolbar, true);
    };
  }, [active, editable, refreshToolbar]);

  const currentStyle = active ? styleForRegion(issue, active) ?? {} : {};

  function replaceStyle(style: TextRegionStyle) {
    if (!active) return;
    const cleaned = cleanStyle(style);
    applyTextStyle(active.element, cleaned);

    if (active.scope === "settings") {
      onSettingsChange("textStyles", updateStyleMap(issue.settings.textStyles, active.key, cleaned));
    } else if (active.storyId) {
      const story = issue.stories.find((candidate) => candidate.id === active.storyId);
      if (story) onStoryChange(story.id, "textStyles", updateStyleMap(story.textStyles, active.key, cleaned));
    }

    window.requestAnimationFrame(refreshToolbar);
  }

  function patchStyle(patch: Partial<TextRegionStyle>) {
    replaceStyle({ ...currentStyle, ...patch });
  }

  function changeFontSize(delta: number) {
    const base = currentStyle.fontSize ?? computedFormat?.fontSize ?? 10;
    patchStyle({ fontSize: Math.max(6, Math.min(96, Math.round(base + delta))) });
  }

  function setAlignment(textAlign: TextAlignment) {
    patchStyle({ textAlign });
  }

  const toolbar = editable && active && position && computedFormat && typeof document !== "undefined"
    ? createPortal(
      <div
        ref={toolbarRef}
        className="inline-text-toolbar"
        role="toolbar"
        aria-label={`Formatting for ${active.key}`}
        style={{ ...toolbarStyle, top: position.top, left: position.left }}
        onClick={(event) => event.stopPropagation()}
      >
        <select
          aria-label="Font family"
          title="Font family"
          value={currentStyle.fontFamily ?? ""}
          onChange={(event) => patchStyle({ fontFamily: event.target.value || undefined })}
          style={{
            width: 84,
            height: 16,
            padding: "0 2px",
            border: "1px solid rgba(32, 31, 27, 0.28)",
            borderRadius: 1,
            background: "#fffdf7",
            color: "#292824",
            fontSize: 8,
          }}
        >
          <option value="">Default font</option>
          {FONT_OPTIONS[active.role].map((option) => (
            <option key={option.id} value={option.family}>{option.label}</option>
          ))}
        </select>
        <span aria-hidden="true" style={{ width: 1, height: 12, margin: "0 1px", background: "rgba(32,31,27,0.18)" }} />
        <button type="button" title="Decrease font size" aria-label="Decrease font size" style={toolbarButtonStyle()} onMouseDown={(event) => event.preventDefault()} onClick={() => changeFontSize(-1)}>−</button>
        <span title="Font size" style={{ minWidth: 20, textAlign: "center", fontVariantNumeric: "tabular-nums", fontSize: 8 }}>{Math.round(computedFormat.fontSize)}</span>
        <button type="button" title="Increase font size" aria-label="Increase font size" style={toolbarButtonStyle()} onMouseDown={(event) => event.preventDefault()} onClick={() => changeFontSize(1)}>+</button>
        <span aria-hidden="true" style={{ width: 1, height: 12, margin: "0 1px", background: "rgba(32,31,27,0.18)" }} />
        <button type="button" title="Bold" aria-label="Bold" aria-pressed={computedFormat.bold} style={toolbarButtonStyle(computedFormat.bold)} onMouseDown={(event) => event.preventDefault()} onClick={() => patchStyle({ fontWeight: computedFormat.bold ? 400 : 700 })}>B</button>
        <button type="button" title="Italic" aria-label="Italic" aria-pressed={computedFormat.italic} style={{ ...toolbarButtonStyle(computedFormat.italic), fontStyle: "italic" }} onMouseDown={(event) => event.preventDefault()} onClick={() => patchStyle({ fontStyle: computedFormat.italic ? "normal" : "italic" })}>I</button>
        <span aria-hidden="true" style={{ width: 1, height: 12, margin: "0 1px", background: "rgba(32,31,27,0.18)" }} />
        {(["left", "center", "right", "justify"] as TextAlignment[]).map((alignment) => (
          <button
            key={alignment}
            type="button"
            title={`${alignment[0].toUpperCase()}${alignment.slice(1)} align`}
            aria-label={`${alignment} align`}
            aria-pressed={computedFormat.textAlign === alignment}
            style={toolbarButtonStyle(computedFormat.textAlign === alignment)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setAlignment(alignment)}
          >
            {alignment === "justify" ? "J" : alignment[0].toUpperCase()}
          </button>
        ))}
        <span aria-hidden="true" style={{ width: 1, height: 12, margin: "0 1px", background: "rgba(32,31,27,0.18)" }} />
        <button type="button" title="Reset formatting" aria-label="Reset formatting" style={toolbarButtonStyle()} onMouseDown={(event) => event.preventDefault()} onClick={() => replaceStyle({})}>×</button>
      </div>,
      document.body,
    )
    : null;

  return (
    <>
      <span ref={hostRef} hidden aria-hidden="true" />
      <style>{`@media print { .inline-text-toolbar { display: none !important; } }`}</style>
      {toolbar}
    </>
  );
}
