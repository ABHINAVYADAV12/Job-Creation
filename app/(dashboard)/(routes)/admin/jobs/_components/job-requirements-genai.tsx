"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function JobRequirementsGenAI({ jobId, onTagsChange }: { jobId?: string; onTagsChange?: (tags: string[]) => void }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSave, setShowSave] = useState(true);

  // Fetch tags from the job when the component mounts or jobId changes
  useEffect(() => {
    const fetchTags = async () => {
      if (!jobId) return;
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Could not fetch job tags");
        const job = await res.json();
        setSelectedTags(job.tags || []);
      } catch {
        setSelectedTags([]);
      }
    };
    fetchTags();
  }, [jobId]);

  const handleGenerateTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/genai/job-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Failed to generate tags");
      const data = await res.json();
      setSuggestedTags(data.tags || []);
      toast.success("Tags generated!");
    } catch {
      toast.error("Could not generate tags");
    } finally {
      setLoading(false);
    }
  };

  const selectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onTagsChange?.(newTags);
      setShowSave(true);
    }
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    onTagsChange?.(newTags);
    setShowSave(true);
  };

  const saveTags = async () => {
    if (!selectedTags.length) {
      toast.error("No tags selected to save");
      return;
    }
    try {
      if (!jobId) {
        toast.error("Job ID is required to save tags");
        return;
      }
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: selectedTags }),
      });
      if (!res.ok) throw new Error("Failed to save tags");
      toast.success("Tags saved to job!");
      setShowSave(false);
    } catch {
      toast.error("Could not save tags");
    }
  };

  return (
    <div className="bg-white/90 rounded-xl shadow p-6 mt-8">
      <h3 className="text-xl font-semibold mb-2 text-purple-800">Generate Job Tags with AI</h3>
      <Input
        className="mb-2"
        placeholder="Describe the job requirements or responsibilities..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={loading}
      />
      <Button className="mb-4" onClick={handleGenerateTags} disabled={loading || !description}>
        {loading ? "Generating..." : "Generate Tags"}
      </Button>
      {/* Suggested tags section */}
      {suggestedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => selectTag(tag)}
              disabled={selectedTags.includes(tag)}
              className={`inline-flex items-center px-2 py-1 rounded text-xs border border-blue-200 transition-all duration-150 focus:outline-none ${
                selectedTags.includes(tag)
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-200 text-blue-800 hover:bg-blue-300"
              }`}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <span className="ml-1 text-white">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
      {/* Selected tags section */}
      {selectedTags.length > 0 && (
        <div className="mt-4">
          <span className="font-semibold text-sm text-gray-700">Selected Tags: </span>
          {selectedTags.map((tag) => (
            <span key={tag} className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
              {tag}
              <span
                onClick={() => removeTag(tag)}
                className="ml-1 cursor-pointer text-green-900 hover:text-red-600 font-bold"
                title="Remove tag"
              >
                ×
              </span>
            </span>
          ))}
          {showSave && (
            <Button
              className="ml-4 px-4 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600"
              onClick={saveTags}
              disabled={!selectedTags.length}
            >
              Save Tags
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
