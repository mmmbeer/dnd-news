"use client";

import { useState } from "react";
import {
  AlignJustify,
  CalendarDays,
  Copy,
  Download,
  Edit3,
  GripVertical,
  MapPin,
  MessageSquareQuote,
  Newspaper,
  Plus,
  Printer,
  RefreshCw,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bodyFontOptions, headlineFontOptions, mastheadFontOptions } from "@/lib/news/fonts";
import { categoryLabels } from "@/lib/news/generator";
import { newspaperPresets } from "@/lib/news/presets";
import { weatheringLabelForAge } from "@/lib/news/weathering";
import type {
  GeneratorOptions,
  IssueSettings,
  NewsStory,
  NewspaperPresetId,
  StoryCategory,
  StoryLength,
  StoryTone,
} from "@/lib/news/types";

export type StudioTab = "layout" | "stories" | "finalize";

interface StudioSidebarProps {
  activeTab: StudioTab;
  settings: IssueSettings;
  stories: NewsStory[];
  selectedId: string;
  generator: GeneratorOptions;
  generatorCount: number;
  seed: string;
  onTabChange: (tab: StudioTab) => void;
  onSettingsChange: <K extends keyof IssueSettings>(key: K, value: IssueSettings[K]) => void;
  onApplyPreset: (presetId: NewspaperPresetId) => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
  onAddComic: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onGeneratorChange: <K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => void;
  onGeneratorCountChange: (count: number) => void;
  onSeedChange: (seed: string) => void;
  onGenerate: () => void;
  onRerollFillers: () => void;
  onToggleFittedFillers: () => void;
  onRollName: () => void;
  onRollDate: () => void;
  onRollDateline: () => void;
  onPrint: () => void;
  onExport: () => void;
  onShare: () => void;
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

function RangeField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="range-field">
      <div className="range-label"><Label>{label}</Label><span>{display}</span></div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(next) => onChange(next[0])} />
    </div>
  );
}

function SettingSwitch({ label, hint, checked, onCheckedChange }: { label: string; hint: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="switch-row">
      <span><strong>{label}</strong><small>{hint}</small></span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}

export function StudioSidebar(props: StudioSidebarProps) {
  const {
    activeTab,
    settings,
    stories,
    selectedId,
    generator,
    generatorCount,
    seed,
    onTabChange,
    onSettingsChange,
    onApplyPreset,
    onEdit,
    onAdd,
    onAddComic,
    onDelete,
    onDuplicate,
    onMove,
    onGeneratorChange,
    onGeneratorCountChange,
    onSeedChange,
    onGenerate,
    onRerollFillers,
    onToggleFittedFillers,
    onRollName,
    onRollDate,
    onRollDateline,
    onPrint,
    onExport,
    onShare,
  } = props;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const weatheringLabel = weatheringLabelForAge(settings.paperTone);
  const generatedStories = stories.filter((story) => story.generated && story.kind !== "comic");
  const allGeneratedBodiesFitted = generatedStories.length > 0
    && generatedStories.every((story) => story.bodyMode === "fit-lorem");

  return (
    <aside className="studio-sidebar" aria-label="Newspaper controls">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as StudioTab)} className="sidebar-tabs">
        <TabsList variant="line" className="sidebar-tab-list">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="finalize">Finalize</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="sidebar-tab-content">
          <section className="sidebar-section">
            <div className="sidebar-section-heading"><span className="eyebrow">Masthead</span><h2>Paper identity</h2></div>
            <Field id="paper-name" label="Paper name">
              <div className="inline-field">
                <Input id="paper-name" value={settings.newspaperName} onChange={(event) => onSettingsChange("newspaperName", event.target.value)} />
                <Button variant="outline" size="icon" onClick={onRollName} aria-label="Randomize paper name"><Newspaper /></Button>
              </div>
            </Field>
            <Field id="paper-motto" label="Motto">
              <Input id="paper-motto" value={settings.motto} onChange={(event) => onSettingsChange("motto", event.target.value)} />
            </Field>
            <div className="two-fields">
              <Field id="paper-date" label="Publication date">
                <div className="inline-field">
                  <Input id="paper-date" value={settings.publicationDate} onChange={(event) => onSettingsChange("publicationDate", event.target.value)} />
                  <Button variant="outline" size="icon" onClick={onRollDate} aria-label="Randomize date"><CalendarDays /></Button>
                </div>
              </Field>
              <Field id="paper-edition" label="Edition">
                <Input id="paper-edition" value={settings.edition} onChange={(event) => onSettingsChange("edition", event.target.value)} />
              </Field>
            </div>
            <Field id="paper-area" label="Circulation area">
              <div className="inline-field">
                <Input id="paper-area" value={settings.dateline} onChange={(event) => onSettingsChange("dateline", event.target.value)} />
                <Button variant="outline" size="icon" onClick={onRollDateline} aria-label="Randomize location"><MapPin /></Button>
              </div>
            </Field>
            <div className="three-fields compact-fields">
              <Field id="paper-volume" label="Volume"><Input id="paper-volume" value={settings.volume} onChange={(event) => onSettingsChange("volume", event.target.value)} /></Field>
              <Field id="paper-issue" label="Issue"><Input id="paper-issue" value={settings.issueNumber} onChange={(event) => onSettingsChange("issueNumber", event.target.value)} /></Field>
              <Field id="paper-price" label="Price"><Input id="paper-price" value={settings.price} onChange={(event) => onSettingsChange("price", event.target.value)} /></Field>
            </div>
          </section>

          <section className="sidebar-section">
            <div className="sidebar-section-heading"><span className="eyebrow">Starting point</span><h2>Template</h2></div>
            <div className="preset-grid" role="list" aria-label="Newspaper templates">
              {newspaperPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="listitem"
                  className={`preset-card preset-${preset.settings.colorTheme} ${settings.presetId === preset.id ? "is-active" : ""}`}
                  onClick={() => onApplyPreset(preset.id)}
                >
                  <span className="preset-card-mark">Aa</span>
                  <span><strong>{preset.name}</strong><small>{preset.description}</small></span>
                </button>
              ))}
            </div>
          </section>

          <section className="sidebar-section">
            <div className="sidebar-section-heading"><span className="eyebrow">Structure</span><h2>Page and columns</h2></div>
            <div className="two-fields">
              <Field id="page-size" label="Page size">
                <NativeSelect id="page-size" value={settings.pageSize} onChange={(event) => onSettingsChange("pageSize", event.target.value as IssueSettings["pageSize"])}>
                  <NativeSelectOption value="broadsheet">Broadsheet</NativeSelectOption>
                  <NativeSelectOption value="tabloid">Tabloid</NativeSelectOption>
                  <NativeSelectOption value="letter">Letter</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field label="Columns">
                <div className="segmented-control">
                  {[2, 3, 4, 5].map((column) => (
                    <Button key={column} size="sm" variant={settings.columns === column ? "default" : "outline"} onClick={() => onSettingsChange("columns", column)}>{column}</Button>
                  ))}
                </div>
              </Field>
            </div>
          </section>

          <section className="sidebar-section">
            <div className="sidebar-section-heading"><span className="eyebrow">Typesetting</span><h2>Typography</h2></div>
            <div className="three-fields compact-fields">
              <Field id="masthead-font" label="Masthead">
                <NativeSelect id="masthead-font" value={settings.mastheadFont} onChange={(event) => onSettingsChange("mastheadFont", event.target.value)}>
                  {mastheadFontOptions.map((font) => <NativeSelectOption key={font.id} value={font.id}>{font.label}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
              <Field id="headline-font" label="Headlines">
                <NativeSelect id="headline-font" value={settings.headlineFont} onChange={(event) => onSettingsChange("headlineFont", event.target.value)}>
                  {headlineFontOptions.map((font) => <NativeSelectOption key={font.id} value={font.id}>{font.label}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
              <Field id="body-font" label="Body">
                <NativeSelect id="body-font" value={settings.bodyFont} onChange={(event) => onSettingsChange("bodyFont", event.target.value)}>
                  {bodyFontOptions.map((font) => <NativeSelectOption key={font.id} value={font.id}>{font.label}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
            <RangeField label="Body size" value={settings.bodySize} display={`${settings.bodySize}px`} min={8} max={14} step={0.5} onChange={(value) => onSettingsChange("bodySize", value)} />
            <RangeField label="Line spacing" value={settings.lineHeight} display={settings.lineHeight.toFixed(2)} min={1.1} max={1.7} step={0.02} onChange={(value) => onSettingsChange("lineHeight", value)} />
            <RangeField label="Headline scale" value={settings.headlineScale} display={`${Math.round(settings.headlineScale * 100)}%`} min={0.8} max={1.35} step={0.05} onChange={(value) => onSettingsChange("headlineScale", value)} />
          </section>

          <section className="sidebar-section">
            <div className="sidebar-section-heading"><span className="eyebrow">Finish</span><h2>Ink and paper</h2></div>
            <Field label="Accent ink">
              <div className="swatch-row">
                {(["charcoal", "oxblood", "navy", "forest"] as const).map((theme) => (
                  <button key={theme} className={`color-swatch swatch-${theme} ${settings.colorTheme === theme ? "is-active" : ""}`} onClick={() => onSettingsChange("colorTheme", theme)} aria-label={`${theme} ink`} />
                ))}
              </div>
            </Field>
            <RangeField label="Paper age" value={settings.paperTone} display={`${settings.paperTone}%`} min={0} max={100} step={1} onChange={(value) => onSettingsChange("paperTone", value)} />
            <SettingSwitch label="Paper weathering" hint={`${weatheringLabel} · stains, creases and wrinkles follow paper age`} checked={settings.paperWeathering} onCheckedChange={(value) => onSettingsChange("paperWeathering", value)} />
            <SettingSwitch label="Column rules" hint="Separate blocks with hairline rules" checked={settings.showRules} onCheckedChange={(value) => onSettingsChange("showRules", value)} />
            <SettingSwitch label="Justified copy" hint="Square off story columns" checked={settings.justifyText} onCheckedChange={(value) => onSettingsChange("justifyText", value)} />
            <SettingSwitch label="Drop caps" hint="Enlarge the first story letter" checked={settings.showDropCaps} onCheckedChange={(value) => onSettingsChange("showDropCaps", value)} />
          </section>
        </TabsContent>

        <TabsContent value="stories" className="sidebar-tab-content">
          <section className="sidebar-section story-table-section">
            <div className="sidebar-section-heading story-section-heading">
              <div><span className="eyebrow">Current page</span><h2>Stories <span>{stories.length}</span></h2></div>
              <div className="story-add-buttons">
                <Button size="sm" onClick={onAdd}><Plus /> Story</Button>
                <Button size="sm" variant="outline" onClick={onAddComic}><MessageSquareQuote /> Comic</Button>
              </div>
            </div>
            <Table className="stories-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="drag-column"><span className="sr-only">Reorder</span></TableHead>
                  <TableHead>Story</TableHead>
                  <TableHead className="type-column">Type</TableHead>
                  <TableHead className="actions-column"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.map((story, index) => (
                  <TableRow
                    key={story.id}
                    data-state={selectedId === story.id ? "selected" : undefined}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedIndex !== null && draggedIndex !== index) onMove(draggedIndex, index);
                      setDraggedIndex(null);
                    }}
                  >
                    <TableCell className="drag-column">
                      <button
                        type="button"
                        draggable
                        aria-label={`Drag to reorder ${story.title}`}
                        title="Drag to reorder"
                        onDragStart={() => setDraggedIndex(index)}
                        onDragEnd={() => setDraggedIndex(null)}
                      ><GripVertical aria-hidden="true" /></button>
                    </TableCell>
                    <TableCell className="story-title-cell">
                      <button type="button" onClick={() => onEdit(story.id)}>
                        <strong>{story.title || "Untitled story"}</strong>
                        <small>{story.generated ? "Generated" : "Written"}{story.locked ? " · Locked" : ""}</small>
                      </button>
                    </TableCell>
                    <TableCell className="type-column">{story.kind === "comic" ? "Comic" : story.kind}</TableCell>
                    <TableCell className="actions-column">
                      <div className="table-row-actions">
                        <Button variant="ghost" size="icon-xs" onClick={() => onEdit(story.id)} aria-label={`Edit ${story.title}`} title="Edit"><Edit3 /></Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => onDuplicate(story.id)} aria-label={`Duplicate ${story.title}`} title="Duplicate"><Copy /></Button>
                        <Button variant="ghost" size="icon-xs" className="danger-action" onClick={() => onDelete(story.id)} aria-label={`Remove ${story.title}`} title="Remove"><Trash2 /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          <section className="sidebar-section">
            <div className="sidebar-section-heading"><span className="eyebrow">Procedural library</span><h2>Add generated stories</h2></div>
            <Field id="generator-section" label="Section">
              <NativeSelect id="generator-section" value={generator.category} onChange={(event) => onGeneratorChange("category", event.target.value as StoryCategory)}>
                {Object.entries(categoryLabels).map(([key, label]) => <NativeSelectOption key={key} value={key}>{label}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
            <div className="three-fields compact-fields">
              <Field id="generator-tone" label="Tone">
                <NativeSelect id="generator-tone" value={generator.tone} onChange={(event) => onGeneratorChange("tone", event.target.value as StoryTone)}>
                  <NativeSelectOption value="straight">Straight</NativeSelectOption>
                  <NativeSelectOption value="sensational">Sensational</NativeSelectOption>
                  <NativeSelectOption value="gossipy">Gossipy</NativeSelectOption>
                  <NativeSelectOption value="ominous">Ominous</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field id="generator-length" label="Length">
                <NativeSelect id="generator-length" value={generator.length} onChange={(event) => onGeneratorChange("length", event.target.value as StoryLength)}>
                  <NativeSelectOption value="brief">Brief</NativeSelectOption>
                  <NativeSelectOption value="standard">Standard</NativeSelectOption>
                  <NativeSelectOption value="long">Long</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field id="generator-count" label="Count">
                <NativeSelect id="generator-count" value={generatorCount} onChange={(event) => onGeneratorCountChange(Number(event.target.value))}>
                  {[1, 2, 3, 4, 6, 8].map((count) => <NativeSelectOption key={count} value={count}>{count}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
            <Field id="generator-seed" label="Random seed" hint="Reuse a seed to reproduce similar details.">
              <Input id="generator-seed" value={seed} onChange={(event) => onSeedChange(event.target.value)} />
            </Field>
            <div className="generator-actions">
              <Button onClick={onGenerate}><Sparkles /> Add {generatorCount}</Button>
              <Button variant="outline" onClick={onRerollFillers}><RefreshCw /> Reroll filler</Button>
            </div>
            <Button
              variant="outline"
              className="full-button"
              disabled={!generatedStories.length}
              onClick={onToggleFittedFillers}
            >
              <AlignJustify />
              {allGeneratedBodiesFitted ? "Restore generated story copy" : "Fit generated bodies with lorem"}
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="finalize" className="sidebar-tab-content finalize-tab-content">
          <section className="sidebar-section finalize-panel">
            <div className="sidebar-section-heading"><span className="eyebrow">Clean proof</span><h2>Finalize issue</h2></div>
            <p>The preview now hides editing outlines, controls, grab handles, and resize anchors. This is the layout used for print and PDF output.</p>
            <dl className="issue-summary">
              <div><dt>Paper</dt><dd>{settings.newspaperName}</dd></div>
              <div><dt>Page</dt><dd>{settings.pageSize} · {settings.columns} columns</dd></div>
              <div><dt>Content</dt><dd>{stories.filter((story) => story.kind !== "comic").length} stories · {stories.filter((story) => story.kind === "comic").length} comics</dd></div>
              <div><dt>Images</dt><dd>{stories.filter((story) => story.illustrationId).length} placed</dd></div>
            </dl>
            <Button className="full-button" onClick={onPrint}><Printer /> Print or save PDF</Button>
            <Button className="full-button" onClick={onShare}><Share2 /> Save and share</Button>
            <Button variant="outline" className="full-button" onClick={onExport}><Download /> Export editable issue</Button>
            <p className="finalize-note">Return to Layout or Stories to resume editing.</p>
          </section>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
