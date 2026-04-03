"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  name: string;
  category: string;
  unit: string;
  defaultPrice?: number;
  source: "history" | "suggested";
}

interface ItemAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: {
    name: string;
    category: string;
    unit: string;
    price?: number;
  }) => void;
  placeholder?: string;
}

const unitLabels: Record<string, string> = {
  pcs: "Pieces",
  pack: "Pack",
  dozen: "Dozen",
  kg: "Kg",
  g: "Grams",
  L: "Litres",
  ml: "ml",
};

export function ItemAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing to search items...",
}: ItemAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/suggestions?q=${encodeURIComponent(query)}`
      );
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200);
  };

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.name);
    onSelect({
      name: suggestion.name,
      category: suggestion.category,
      unit: suggestion.unit,
      price: suggestion.defaultPrice,
    });
    setOpen(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className="input pl-10"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          autoComplete="off"
          required
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-sand-300 border-t-haveli-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-sand-200 shadow-lg overflow-hidden max-h-60 sm:max-h-72 overflow-y-auto">
          {suggestions.map((item, index) => (
            <button
              key={`${item.name}-${item.source}`}
              type="button"
              onClick={() => handleSelect(item)}
              className={cn(
                "w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 text-left transition-colors border-b border-sand-50 last:border-0",
                index === activeIndex ? "bg-haveli-50" : "hover:bg-sand-50"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                  item.source === "history"
                    ? "bg-blue-50 text-blue-500"
                    : "bg-haveli-50 text-haveli-500"
                )}
              >
                {item.source === "history" ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sand-900 truncate">
                  {item.name}
                </p>
                <p className="text-[10px] sm:text-xs text-sand-500">
                  {item.category}
                </p>
              </div>
              <span className="text-[10px] font-medium text-sand-500 bg-sand-100 px-1.5 sm:px-2 py-0.5 rounded-md flex-shrink-0">
                {unitLabels[item.unit] || item.unit}
              </span>
            </button>
          ))}
          <div className="px-3 sm:px-4 py-2 bg-sand-50 border-t border-sand-100">
            <p className="text-[10px] text-sand-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Your history
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Suggestions
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
