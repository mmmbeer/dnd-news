"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Lock,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NewsStory } from "@/lib/news/types";

interface StoryRailProps {
  stories: NewsStory[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onGenerate: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (from: number, to: number) => void;
}

export function StoryRail({
  stories,
  selectedId,
  onSelect,
  onAdd,
  onGenerate,
  onDelete,
  onDuplicate,
  onMove,
}: StoryRailProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  return (
    <aside className="story-rail" aria-label="Issue stories">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Issue lineup</span>
          <h2>Stories <span>{stories.length}</span></h2>
        </div>
      </div>

      <div className="story-actions">
        <Button size="sm" onClick={onAdd}><Plus /> New story</Button>
        <Button size="sm" variant="outline" onClick={onGenerate}><Sparkles /> Add filler</Button>
      </div>

      <div className="story-list">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={`story-list-item ${selectedId === story.id ? "is-active" : ""}`}
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedIndex !== null && draggedIndex !== index) onMove(draggedIndex, index);
              setDraggedIndex(null);
            }}
          >
            <button className="story-select" onClick={() => onSelect(story.id)}>
              <GripVertical className="drag-grip" aria-hidden="true" />
              <span className="story-list-copy">
                <span className="story-list-kicker">
                  {story.generated ? "Filler" : "DM story"} · {story.kind}
                  {story.locked && <Lock className="inline-lock" aria-label="Locked" />}
                </span>
                <strong>{story.title}</strong>
              </span>
            </button>

            <div className="story-row-tools">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={index === 0}
                    onClick={() => onMove(index, index - 1)}
                    aria-label="Move story up"
                  ><ChevronUp /></Button>
                </TooltipTrigger>
                <TooltipContent>Move up</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={index === stories.length - 1}
                    onClick={() => onMove(index, index + 1)}
                    aria-label="Move story down"
                  ><ChevronDown /></Button>
                </TooltipTrigger>
                <TooltipContent>Move down</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-xs" onClick={() => onDuplicate(story.id)} aria-label="Duplicate story"><Copy /></Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-xs" onClick={() => onDelete(story.id)} aria-label="Delete story"><Trash2 /></Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
