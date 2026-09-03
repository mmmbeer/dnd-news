"use client";

import { CalendarDays, ImageIcon, ImageOff, MapPin, MessageSquareQuote, Newspaper, RefreshCw, Sparkles, UserRound } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { categoryLabels } from "@/lib/news/generator";
import { illustrationById, storyIllustrations, type IllustrationKind } from "@/lib/news/illustrations";
import { newspaperPresets } from "@/lib/news/presets";
import type {
  GeneratorOptions,
  IssueSettings,
  NewsStory,
  StoryCategory,
  StoryKind,
  StoryLength,
  StoryTone,
  StoryWidth,
  NewspaperPresetId,
} from "@/lib/news/types";

interface InspectorProps {
  settings: IssueSettings;
  story?: NewsStory;
  seed: string;
  generator: GeneratorOptions;
  generatorCount: number;
  onSettingsChange: <K extends keyof IssueSettings>(key: K, value: IssueSettings[K]) => void;
  onApplyPreset: (presetId: NewspaperPresetId) => void;
  onStoryChange: <K extends keyof NewsStory>(key: K, value: NewsStory[K]) => void;
  onSeedChange: (value: string) => void;
  onGeneratorChange: <K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => void;
  onCountChange: (count: number) => void;
  onAddGenerated: () => void;
  onRandomizeStory: () => void;
  onRandomizeFillers: () => void;
  onRollName: () => void;
  onRollDate: () => void;
  onRollDateline: () => void;
  onRollByline: () => void;
  onRollIllustration: (kind?: IllustrationKind) => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="field-stack">
      <Label>{label}</Label>
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

export function Inspector(props: InspectorProps) {
  const {
    settings,
    story,
    seed,
    generator,
    generatorCount,
    onSettingsChange,
    onApplyPreset,
    onStoryChange,
    onSeedChange,
    onGeneratorChange,
    onCountChange,
    onAddGenerated,
    onRandomizeStory,
    onRandomizeFillers,
    onRollName,
    onRollDate,
    onRollDateline,
    onRollByline,
    onRollIllustration,
  } = props;
  const selectedIllustration = illustrationById.get(story?.illustrationId ?? "");

  return (
    <aside className="inspector" aria-label="Newspaper controls">
      <Tabs defaultValue="story" className="inspector-tabs">
        <TabsList variant="line" className="inspector-tab-list">
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="layout">Design</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="inspector-content">
          {story ? (
            <>
              <div className="section-heading">
                <div><span className="eyebrow">Selected {story.kind === "comic" ? "comic" : "story"}</span><h2>{story.kind === "comic" ? "Comic desk" : "Story desk"}</h2></div>
                {story.generated && <span className="status-chip">Generated</span>}
              </div>

              <Field label="Headline">
                <Textarea value={story.title} rows={2} onChange={(event) => onStoryChange("title", event.target.value)} />
              </Field>
              <div className="two-fields">
                <Field label="Kicker">
                  <Input value={story.kicker} onChange={(event) => onStoryChange("kicker", event.target.value)} />
                </Field>
                <Field label="Dateline">
                  <Input value={story.location} onChange={(event) => onStoryChange("location", event.target.value.toUpperCase())} />
                </Field>
              </div>
              <Field label={story.kind === "comic" ? "Caption" : "Deck / summary"}>
                <Textarea value={story.dek} rows={3} onChange={(event) => onStoryChange("dek", event.target.value)} />
              </Field>
              <Field label={story.kind === "comic" ? "Artist credit" : "Byline"}>
                <div className="inline-field">
                  <Input value={story.byline} onChange={(event) => onStoryChange("byline", event.target.value)} />
                  <Button variant="outline" size="icon" onClick={onRollByline} aria-label="Randomize byline"><UserRound /></Button>
                </div>
              </Field>

              <Field label="Featured art" hint={`${storyIllustrations.length} available images, including 74 provenance-tracked public-domain engravings and cartoons.`}>
                <div className="illustration-picker">
                  <div className="inline-field">
                    <NativeSelect value={story.illustrationId ?? ""} onChange={(event) => onStoryChange("illustrationId", event.target.value || null)}>
                      <NativeSelectOption value="">No featured art</NativeSelectOption>
                      <NativeSelectOptGroup label="Generated story illustrations">
                        {storyIllustrations.filter((illustration) => illustration.kind === "generated").map((illustration) => (
                          <NativeSelectOption key={illustration.id} value={illustration.id}>{categoryLabels[illustration.category]} · {illustration.label}</NativeSelectOption>
                        ))}
                      </NativeSelectOptGroup>
                      <NativeSelectOptGroup label="Public-domain historical engravings">
                        {storyIllustrations.filter((illustration) => illustration.kind === "historical").map((illustration) => (
                          <NativeSelectOption key={illustration.id} value={illustration.id}>{illustration.label} · {categoryLabels[illustration.category]}</NativeSelectOption>
                        ))}
                      </NativeSelectOptGroup>
                      <NativeSelectOptGroup label="Public-domain editorial cartoons">
                        {storyIllustrations.filter((illustration) => illustration.kind === "cartoon").map((illustration) => (
                          <NativeSelectOption key={illustration.id} value={illustration.id}>{illustration.label} · {categoryLabels[illustration.category]}</NativeSelectOption>
                        ))}
                      </NativeSelectOptGroup>
                    </NativeSelect>
                    <Button variant="outline" size="icon" onClick={() => onRollIllustration()} aria-label="Choose matching art"><ImageIcon /></Button>
                  </div>
                  {selectedIllustration && (
                    <div className="art-control-preview">
                      <Image src={selectedIllustration.src} alt="" width={116} height={116} />
                      <span>
                        <strong>{selectedIllustration.label}</strong>
                        <small>{selectedIllustration.creator ? `${selectedIllustration.creator} · ${selectedIllustration.license}` : categoryLabels[selectedIllustration.category]}</small>
                      </span>
                    </div>
                  )}
                  <div className="art-action-row">
                    <Button type="button" size="sm" variant="outline" onClick={() => onRollIllustration("historical")}><ImageIcon /> Historical</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => onRollIllustration("cartoon")}><MessageSquareQuote /> Cartoon</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => onStoryChange("illustrationId", null)} disabled={!story.illustrationId}><ImageOff /> Remove</Button>
                  </div>
                </div>
              </Field>

              <div className="three-fields">
                <Field label="Format">
                  <NativeSelect value={story.kind} onChange={(event) => onStoryChange("kind", event.target.value as StoryKind)}>
                    <NativeSelectOption value="lead">Lead</NativeSelectOption>
                    <NativeSelectOption value="news">News</NativeSelectOption>
                    <NativeSelectOption value="brief">Brief</NativeSelectOption>
                    <NativeSelectOption value="notice">Notice</NativeSelectOption>
                    <NativeSelectOption value="advert">Advert</NativeSelectOption>
                    <NativeSelectOption value="obituary">Obituary</NativeSelectOption>
                    <NativeSelectOption value="comic">Comic column</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field label="Width">
                  <NativeSelect value={story.width} onChange={(event) => onStoryChange("width", event.target.value as StoryWidth)}>
                    <NativeSelectOption value="standard">1 column</NativeSelectOption>
                    <NativeSelectOption value="wide">2 columns</NativeSelectOption>
                    <NativeSelectOption value="full">Full width</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field label="Section">
                  <NativeSelect value={story.category} onChange={(event) => onStoryChange("category", event.target.value as Exclude<StoryCategory, "any">)}>
                    {Object.entries(categoryLabels).filter(([key]) => key !== "any").map(([key, label]) => (
                      <NativeSelectOption key={key} value={key}>{label}</NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              </div>

              <Field label={story.kind === "comic" ? "Additional copy" : "Story body"} hint={`${story.body.trim().split(/\s+/).filter(Boolean).length} words · Blank lines create paragraphs`}>
                <Textarea className="story-body-input" value={story.body} rows={13} onChange={(event) => onStoryChange("body", event.target.value)} />
              </Field>
              <div className="switch-row compact">
                <span><strong>Lock this story</strong><small>Keep it when filler is rerolled</small></span>
                <Switch checked={story.locked} onCheckedChange={(value) => onStoryChange("locked", value)} aria-label="Lock this story" />
              </div>
              <Button variant="outline" className="full-button" onClick={onRandomizeStory} disabled={!story.generated && story.locked}>
                <RefreshCw /> {story.kind === "comic" ? "Reroll comic" : "Rewrite from generator"}
              </Button>
            </>
          ) : <p className="empty-message">Select a story to edit it.</p>}
        </TabsContent>

        <TabsContent value="layout" className="inspector-content">
          <div className="section-heading">
            <div><span className="eyebrow">Issue identity</span><h2>Design desk</h2></div>
          </div>

          <div className="inspector-divider"><span>Newspaper templates</span></div>
          <div className="preset-grid" role="list" aria-label="Newspaper template defaults">
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

          <Field label="Newspaper name">
            <div className="inline-field">
              <Input value={settings.newspaperName} onChange={(event) => onSettingsChange("newspaperName", event.target.value)} />
              <Button variant="outline" size="icon" onClick={onRollName} aria-label="Randomize newspaper name"><Newspaper /></Button>
            </div>
          </Field>
          <Field label="Motto">
            <Input value={settings.motto} onChange={(event) => onSettingsChange("motto", event.target.value)} />
          </Field>
          <div className="two-fields">
            <Field label="Publication date">
              <div className="inline-field">
                <Input value={settings.publicationDate} onChange={(event) => onSettingsChange("publicationDate", event.target.value)} />
                <Button variant="outline" size="icon" onClick={onRollDate} aria-label="Randomize date"><CalendarDays /></Button>
              </div>
            </Field>
            <Field label="Circulation area">
              <div className="inline-field">
                <Input value={settings.dateline} onChange={(event) => onSettingsChange("dateline", event.target.value)} />
                <Button variant="outline" size="icon" onClick={onRollDateline} aria-label="Randomize location"><MapPin /></Button>
              </div>
            </Field>
          </div>
          <div className="four-fields">
            <Field label="Edition"><Input value={settings.edition} onChange={(event) => onSettingsChange("edition", event.target.value)} /></Field>
            <Field label="Price"><Input value={settings.price} onChange={(event) => onSettingsChange("price", event.target.value)} /></Field>
            <Field label="Volume"><Input value={settings.volume} onChange={(event) => onSettingsChange("volume", event.target.value)} /></Field>
            <Field label="Issue"><Input value={settings.issueNumber} onChange={(event) => onSettingsChange("issueNumber", event.target.value)} /></Field>
          </div>

          <div className="inspector-divider"><span>Page & columns</span></div>
          <div className="two-fields">
            <Field label="Page size">
              <NativeSelect value={settings.pageSize} onChange={(event) => onSettingsChange("pageSize", event.target.value as IssueSettings["pageSize"])}>
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

          <div className="inspector-divider"><span>Typography</span></div>
          <div className="three-fields">
            <Field label="Masthead">
              <NativeSelect value={settings.mastheadFont} onChange={(event) => onSettingsChange("mastheadFont", event.target.value)}>
                <NativeSelectOption value="blackletter">Old World</NativeSelectOption>
                <NativeSelectOption value="roman">Roman</NativeSelectOption>
                <NativeSelectOption value="modern">Modern</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field label="Headlines">
              <NativeSelect value={settings.headlineFont} onChange={(event) => onSettingsChange("headlineFont", event.target.value)}>
                <NativeSelectOption value="classic">Classic</NativeSelectOption>
                <NativeSelectOption value="condensed">Condensed</NativeSelectOption>
                <NativeSelectOption value="elegant">Elegant</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field label="Body">
              <NativeSelect value={settings.bodyFont} onChange={(event) => onSettingsChange("bodyFont", event.target.value)}>
                <NativeSelectOption value="news">News serif</NativeSelectOption>
                <NativeSelectOption value="book">Book serif</NativeSelectOption>
                <NativeSelectOption value="clean">Clean sans</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>
          <RangeField label="Body size" value={settings.bodySize} display={`${settings.bodySize}px`} min={8} max={14} step={0.5} onChange={(value) => onSettingsChange("bodySize", value)} />
          <RangeField label="Line spacing" value={settings.lineHeight} display={settings.lineHeight.toFixed(2)} min={1.1} max={1.7} step={0.02} onChange={(value) => onSettingsChange("lineHeight", value)} />
          <RangeField label="Headline scale" value={settings.headlineScale} display={`${Math.round(settings.headlineScale * 100)}%`} min={0.8} max={1.35} step={0.05} onChange={(value) => onSettingsChange("headlineScale", value)} />

          <div className="inspector-divider"><span>Ink & paper</span></div>
          <Field label="Accent ink">
            <div className="swatch-row">
              {(["charcoal", "oxblood", "navy", "forest"] as const).map((theme) => (
                <button key={theme} className={`color-swatch swatch-${theme} ${settings.colorTheme === theme ? "is-active" : ""}`} onClick={() => onSettingsChange("colorTheme", theme)} aria-label={`${theme} ink`} />
              ))}
            </div>
          </Field>
          <RangeField label="Paper age" value={settings.paperTone} display={`${settings.paperTone}%`} min={0} max={100} step={1} onChange={(value) => onSettingsChange("paperTone", value)} />
          <SettingSwitch label="Column rules" hint="Separate stories with hairline rules" checked={settings.showRules} onCheckedChange={(value) => onSettingsChange("showRules", value)} />
          <SettingSwitch label="Justified copy" hint="Square off story columns" checked={settings.justifyText} onCheckedChange={(value) => onSettingsChange("justifyText", value)} />
          <SettingSwitch label="Drop caps" hint="Enlarge the first story letter" checked={settings.showDropCaps} onCheckedChange={(value) => onSettingsChange("showDropCaps", value)} />
        </TabsContent>

        <TabsContent value="generate" className="inspector-content">
          <div className="section-heading">
            <div><span className="eyebrow">Procedural library</span><h2>Filler desk</h2></div>
          </div>
          <p className="section-intro">Create printable local color around your campaign story. Generated pieces remain fully editable.</p>
          <Field label="Section">
            <NativeSelect value={generator.category} onChange={(event) => onGeneratorChange("category", event.target.value as StoryCategory)}>
              {Object.entries(categoryLabels).map(([key, label]) => <NativeSelectOption key={key} value={key}>{label}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
          <div className="three-fields">
            <Field label="Tone">
              <NativeSelect value={generator.tone} onChange={(event) => onGeneratorChange("tone", event.target.value as StoryTone)}>
                <NativeSelectOption value="straight">Straight</NativeSelectOption>
                <NativeSelectOption value="sensational">Sensational</NativeSelectOption>
                <NativeSelectOption value="gossipy">Gossipy</NativeSelectOption>
                <NativeSelectOption value="ominous">Ominous</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field label="Length">
              <NativeSelect value={generator.length} onChange={(event) => onGeneratorChange("length", event.target.value as StoryLength)}>
                <NativeSelectOption value="brief">Brief</NativeSelectOption>
                <NativeSelectOption value="standard">Standard</NativeSelectOption>
                <NativeSelectOption value="long">Long</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field label="Stories">
              <NativeSelect value={generatorCount} onChange={(event) => onCountChange(Number(event.target.value))}>
                {[1, 2, 3, 4, 6, 8].map((count) => <NativeSelectOption key={count} value={count}>{count}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
          </div>
          <Field label="Random seed" hint="Reuse a seed to reproduce the same kinds of details.">
            <Input value={seed} onChange={(event) => onSeedChange(event.target.value)} />
          </Field>
          <Button className="full-button" onClick={onAddGenerated}><Sparkles /> Add {generatorCount} to issue</Button>
          <Button variant="outline" className="full-button" onClick={onRandomizeFillers}><RefreshCw /> Reroll unlocked filler</Button>

          <div className="generator-notes">
            <strong>Story library</strong>
            <p>110 distinct templates across eleven sections combine civic disputes, guild news, crimes, magical events, markets, travel hazards, weather, gossip, culture, adventure hooks and public notices.</p>
            <span>61 public-domain engravings can appear as story art. Editorial cartoons are generated as their own columns.</span>
            <span>DM-written and locked stories are never replaced.</span>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
