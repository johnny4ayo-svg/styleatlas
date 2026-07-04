"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NIGERIAN_STATES, PRICE_RANGES } from "@/lib/constants";

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleBoolean = (key: string) => {
    const isActive = searchParams.get(key) === "true";
    setParam(key, isActive ? null : "true");
  };

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 font-serif text-base font-semibold text-charcoal-900">State</h3>
        <Select value={searchParams.get("state") ?? undefined} onValueChange={(v) => setParam("state", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any state" />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-serif text-base font-semibold text-charcoal-900">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.value} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                checked={searchParams.get("price") === range.value}
                onCheckedChange={() => setParam("price", searchParams.get("price") === range.value ? null : range.value)}
              />
              <span className="text-sm text-charcoal-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-serif text-base font-semibold text-charcoal-900">Rating</h3>
        <Select value={searchParams.get("minRating") ?? undefined} onValueChange={(v) => setParam("minRating", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4.5">4.5 &amp; up</SelectItem>
            <SelectItem value="4">4.0 &amp; up</SelectItem>
            <SelectItem value="3">3.0 &amp; up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox checked={searchParams.get("verified") === "true"} onCheckedChange={() => toggleBoolean("verified")} />
          <Label className="cursor-pointer font-normal">Verified only</Label>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox
            checked={searchParams.get("availability") === "available"}
            onCheckedChange={() =>
              setParam("availability", searchParams.get("availability") === "available" ? null : "available")
            }
          />
          <Label className="cursor-pointer font-normal">Available now</Label>
        </label>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={() => router.push(pathname)}>
        Clear all filters
      </Button>
    </aside>
  );
}
