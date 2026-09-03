"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { NewsStory, NewspaperIssue } from "@/lib/news/types";
import { illustrationById } from "@/lib/news/illustrations";

interface NewspaperPageProps {
  issue: NewspaperIssue;
  selectedId: string;
  onSelect: (id: string) => void;
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

function storySpan(story: NewsStory, columns: number) {
  if (story.kind === "lead" || story.width === "full") return columns;
  if (story.width === "wide") return Math.min(2, columns);
  return 1;
}

function StoryBody({ story, columns }: { story: NewsStory; columns: number }) {
  const bodyColumns = story.kind === "lead" ? Math.min(columns, 3) : 1;
  return (
    <div className="newspaper-copy" style={{ columnCount: bodyColumns }}>
      {story.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
        <p key={`${story.id}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}

export function NewspaperPage({ issue, selectedId, onSelect }: NewspaperPageProps) {
  const { settings } = issue;
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

  return (
    <div className={`newspaper-page page-${settings.pageSize} ${settings.showRules ? "with-rules" : ""} ${settings.justifyText ? "is-justified" : ""} ${settings.showDropCaps ? "with-dropcaps" : ""}`} style={style}>
      <header className="newspaper-header">
        <div className="newspaper-motto">{settings.motto}</div>
        <h1>{settings.newspaperName}</h1>
        <div className="newspaper-folio">
          <span>Vol. {settings.volume} · No. {settings.issueNumber}</span>
          <span>{settings.publicationDate}</span>
          <span>{settings.price}</span>
        </div>
        <div className="newspaper-edition">
          <span>{settings.dateline}</span>
          <strong>{settings.edition}</strong>
        </div>
      </header>

      <main className="newspaper-grid" style={{ gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))` }}>
        {issue.stories.map((story) => {
          const span = storySpan(story, settings.columns);
          const illustration = story.illustrationId ? illustrationById.get(story.illustrationId) : undefined;
          return (
            <article
              key={story.id}
              className={`newspaper-story story-${story.kind} ${selectedId === story.id ? "is-selected" : ""}`}
              style={{ gridColumn: `span ${span}` }}
              onClick={() => onSelect(story.id)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(story.id);
              }}
              aria-label={`Edit story: ${story.title}`}
            >
              {story.kicker && <div className="story-kicker">{story.kicker}</div>}
              <h2>{story.title}</h2>
              {story.dek && <p className="story-dek">{story.dek}</p>}
              <div className="story-byline">By {story.byline}</div>
              {illustration && (
                <figure className="story-illustration">
                  <Image src={illustration.src} alt={illustration.alt} width={320} height={240} />
                </figure>
              )}
              <StoryBody story={story} columns={settings.columns} />
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
