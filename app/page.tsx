"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FilePlus2,
  Printer,
  RefreshCw,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inspector } from "@/components/studio/Inspector";
import { NewspaperPage } from "@/components/studio/NewspaperPage";
import { StoryRail } from "@/components/studio/StoryRail";
import {
  createBlankStory,
  createInitialIssue,
  generateStories,
  generateStory,
  makeId,
  randomByline,
  randomDate,
  randomIllustrationForCategory,
  randomLocation,
  randomMotto,
  randomNewspaperName,
  seededRandom,
} from "@/lib/news/generator";
import { applyNewspaperPreset } from "@/lib/news/presets";
import type { GeneratorOptions, IssueSettings, NewsStory, NewspaperIssue, NewspaperPresetId } from "@/lib/news/types";

const STORAGE_KEY = "broadsheet:issue:v1";

function nextSeed(seed: string) {
  return `${seed.replace(/-\w{4}$/, "")}-${Math.random().toString(36).slice(2, 6)}`;
}

function isIssue(value: unknown): value is NewspaperIssue {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NewspaperIssue>;
  return candidate.version === 1 && !!candidate.settings && Array.isArray(candidate.stories);
}

function normalizeIssue(issue: NewspaperIssue): NewspaperIssue {
  const defaults = createInitialIssue();
  return {
    ...issue,
    settings: {
      ...defaults.settings,
      ...issue.settings,
      presetId: issue.settings.presetId ?? "blackwater",
    },
    stories: issue.stories.map((story) => ({ ...story, illustrationId: story.illustrationId ?? null })),
  };
}

export default function Home() {
  const [issue, setIssue] = useState<NewspaperIssue>(() => createInitialIssue());
  const [selectedId, setSelectedId] = useState("custom-lead");
  const [generator, setGenerator] = useState<GeneratorOptions>({ category: "any", tone: "straight", length: "standard" });
  const [generatorCount, setGeneratorCount] = useState(3);
  const [zoom, setZoom] = useState(85);
  const [hydrated, setHydrated] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Opening issue…");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (isIssue(parsed)) {
            const restored = normalizeIssue(parsed);
            setIssue(restored);
            setSelectedId(restored.stories[0]?.id ?? "");
            setSaveLabel("Saved on this device");
          }
        }
      } catch {
        setSaveLabel("Sample issue loaded");
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issue));
      setSaveLabel(`Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [issue, hydrated]);

  const selectedStory = useMemo(
    () => issue.stories.find((story) => story.id === selectedId),
    [issue.stories, selectedId],
  );

  function updateSettings<K extends keyof IssueSettings>(key: K, value: IssueSettings[K]) {
    setIssue((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  }

  function updateStory<K extends keyof NewsStory>(key: K, value: NewsStory[K]) {
    setIssue((current) => ({
      ...current,
      stories: current.stories.map((story) => story.id === selectedId ? { ...story, [key]: value } : story),
    }));
  }

  function applyPreset(presetId: NewspaperPresetId) {
    setIssue((current) => ({ ...current, settings: applyNewspaperPreset(current.settings, presetId) }));
  }

  function updateGenerator<K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) {
    setGenerator((current) => ({ ...current, [key]: value }));
  }

  function addStory() {
    const story = createBlankStory();
    setIssue((current) => ({ ...current, stories: [...current.stories, story] }));
    setSelectedId(story.id);
  }

  function addGenerated(count = generatorCount) {
    const seed = nextSeed(issue.seed);
    const stories = generateStories(seed, count, generator);
    setIssue((current) => ({ ...current, seed, stories: [...current.stories, ...stories] }));
    setSelectedId(stories[0]?.id ?? selectedId);
  }

  function deleteStory(id: string) {
    setIssue((current) => {
      const remaining = current.stories.filter((story) => story.id !== id);
      if (remaining.length) {
        if (selectedId === id) setSelectedId(remaining[0].id);
        return { ...current, stories: remaining };
      }
      const replacement = createBlankStory();
      setSelectedId(replacement.id);
      return { ...current, stories: [replacement] };
    });
  }

  function duplicateStory(id: string) {
    const source = issue.stories.find((story) => story.id === id);
    if (!source) return;
    const duplicate = { ...source, id: makeId("copy"), title: `${source.title} — Copy`, generated: false };
    const index = issue.stories.findIndex((story) => story.id === id);
    const stories = [...issue.stories];
    stories.splice(index + 1, 0, duplicate);
    setIssue((current) => ({ ...current, stories }));
    setSelectedId(duplicate.id);
  }

  function moveStory(from: number, to: number) {
    if (to < 0 || to >= issue.stories.length) return;
    setIssue((current) => {
      const stories = [...current.stories];
      const [moved] = stories.splice(from, 1);
      stories.splice(to, 0, moved);
      return { ...current, stories };
    });
  }

  function rerollSelectedStory() {
    if (!selectedStory) return;
    const seed = nextSeed(issue.seed);
    const next = generateStory(seed, {
      ...generator,
      category: selectedStory.category,
      length: selectedStory.kind === "brief" ? "brief" : generator.length,
    });
    setIssue((current) => ({
      ...current,
      seed,
      stories: current.stories.map((story) => story.id === selectedId ? { ...next, id: story.id } : story),
    }));
  }

  function rerollFillers() {
    const seed = nextSeed(issue.seed);
    let generatedIndex = 0;
    setIssue((current) => ({
      ...current,
      seed,
      stories: current.stories.map((story) => {
        if (!story.generated || story.locked) return story;
        const replacement = generateStory(seed, {
          ...generator,
          category: generator.category === "any" ? story.category : generator.category,
          length: story.kind === "brief" ? "brief" : generator.length,
        }, generatedIndex++);
        return { ...replacement, id: story.id };
      }),
    }));
  }

  function rollWholeIssue() {
    const seed = nextSeed(issue.seed);
    const rng = seededRandom(seed);
    setIssue((current) => ({
      ...current,
      seed,
      settings: {
        ...current.settings,
        newspaperName: randomNewspaperName(rng),
        motto: randomMotto(rng),
        publicationDate: randomDate(rng),
        dateline: `${randomLocation(rng)} & the surrounding provinces`,
        issueNumber: String(1 + Math.floor(rng() * 250)),
      },
      stories: current.stories.map((story, index) => {
        if (!story.generated || story.locked) return story;
        const replacement = generateStory(seed, { category: "any", tone: generator.tone, length: generator.length }, index);
        return { ...replacement, id: story.id };
      }),
    }));
  }

  function createFreshIssue() {
    const fresh = createInitialIssue();
    fresh.seed = nextSeed(fresh.seed);
    fresh.settings.newspaperName = randomNewspaperName(seededRandom(fresh.seed));
    setIssue(fresh);
    setSelectedId(fresh.stories[0].id);
  }

  function exportIssue() {
    const blob = new Blob([JSON.stringify(issue, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${issue.settings.newspaperName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "newspaper"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importIssue(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!isIssue(parsed)) throw new Error("Invalid issue");
      const restored = normalizeIssue(parsed);
      setIssue(restored);
      setSelectedId(restored.stories[0]?.id ?? "");
      setSaveLabel("Issue imported");
    } catch {
      setSaveLabel("Could not import that file");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const rng = () => seededRandom(`${issue.seed}:${Date.now()}`);

  return (
    <TooltipProvider>
      <div className="studio-shell">
        <header className="studio-toolbar">
          <div className="brand-lockup">
            <div className="brand-mark">B</div>
            <div><strong>Broadsheet</strong><span>Fantasy newspaper studio</span></div>
          </div>

          <div className="toolbar-center">
            <Button variant="ghost" size="sm" onClick={createFreshIssue}><FilePlus2 /> New issue</Button>
            <Button variant="ghost" size="sm" onClick={rollWholeIssue}><Sparkles /> Roll issue</Button>
            <span className="toolbar-divider" />
            <Button variant="ghost" size="sm" onClick={() => fileInput.current?.click()}><Upload /> Import</Button>
            <Button variant="ghost" size="sm" onClick={exportIssue}><Download /> Export</Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}><Printer /> Print / PDF</Button>
            <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(event) => event.target.files?.[0] && importIssue(event.target.files[0])} />
          </div>

          <div className="toolbar-meta">
            <span className="save-state"><Save /> {saveLabel}</span>
            <NativeSelect size="sm" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Preview zoom">
              {[60, 70, 85, 100, 115].map((value) => <NativeSelectOption key={value} value={value}>{value}%</NativeSelectOption>)}
            </NativeSelect>
          </div>
        </header>

        <div className="studio-workspace">
          <StoryRail
            stories={issue.stories}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={addStory}
            onGenerate={() => addGenerated(1)}
            onDelete={deleteStory}
            onDuplicate={duplicateStory}
            onMove={moveStory}
          />

          <section className="preview-stage" aria-label="Newspaper preview">
            <div className="preview-stage-header">
              <div><span className="preview-dot" /> Live front page</div>
              <span>{issue.settings.columns} columns · {issue.stories.length} stories</span>
            </div>
            <div className="page-scroll">
              <div className="page-zoom" style={{ zoom: `${zoom}%` }}>
                <NewspaperPage issue={issue} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </div>
          </section>

          <Inspector
            settings={issue.settings}
            story={selectedStory}
            seed={issue.seed}
            generator={generator}
            generatorCount={generatorCount}
            onSettingsChange={updateSettings}
            onApplyPreset={applyPreset}
            onStoryChange={updateStory}
            onSeedChange={(seed) => setIssue((current) => ({ ...current, seed }))}
            onGeneratorChange={updateGenerator}
            onCountChange={setGeneratorCount}
            onAddGenerated={() => addGenerated()}
            onRandomizeStory={rerollSelectedStory}
            onRandomizeFillers={rerollFillers}
            onRollName={() => updateSettings("newspaperName", randomNewspaperName(rng()))}
            onRollDate={() => updateSettings("publicationDate", randomDate(rng()))}
            onRollDateline={() => updateSettings("dateline", `${randomLocation(rng())} & the surrounding provinces`)}
            onRollByline={() => updateStory("byline", randomByline(generator.tone, rng()))}
            onRollIllustration={() => selectedStory && updateStory("illustrationId", randomIllustrationForCategory(selectedStory.category, rng()))}
          />
        </div>

        <div className="mobile-note"><RefreshCw /> For the full layout desk, use a tablet or larger screen.</div>
      </div>
    </TooltipProvider>
  );
}
