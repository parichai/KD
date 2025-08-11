import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Download, Info, SquareChartGantt, Copy, Square } from "lucide-react";

type RiskKey = "1" | "2" | "3.1" | "3.2" | "4.1" | "4.2" | "4.3" | "5.1" | "5.2" | "5.3" | "5.4";

type Plan = {
  key: RiskKey;
  label: string;
  color: string;
  zScore: string;
  description: string;
  followUp: string;
  stressTest: string;
  advancedImaging: string;
  antiplatelet: string;
  anticoag?: string;
  activity: string;
  notes?: string[];
};

const PLANS: Record<RiskKey, Plan> = {
  "1": { key: "1", label: "Risk 1", color: "bg-emerald-100", zScore: "< 2", description: "No coronary involvement at any point", followUp: "1–2 wk (consider 4–6 wk if suboptimal imaging or labs abnormal) → may discharge between 4 wk and 1 yr", stressTest: "None", advancedImaging: "None", antiplatelet: "Low‑dose aspirin for 6 wk, then discontinue", anticoag: "Not indicated", activity: "Promotion counseling at every visit" },
  "2": { key: "2", label: "Risk 2", color: "bg-green-200", zScore: "2 – 2.5", description: "Dilation only; resolves within 6 wk to 1 yr", followUp: "1–2 wk (consider 6 wk if abnormal at 1–2 wk) → 1 yr → may discharge if normal; if persisting, assess q2–5 yr", stressTest: "None", advancedImaging: "None", antiplatelet: "Low‑dose aspirin for 6 wk; discontinue if coronaries normal at 6 wk", anticoag: "Not indicated", activity: "Promotion counseling at every visit" },
  "3.1": { key: "3.1", label: "Risk 3.1", color: "bg-yellow-200", zScore: "2.5 – <5", description: "Small aneurysm – current/persistent", followUp: "Within 1 wk (closer if enlarging) → 6 wk → 6 mo → 12 mo → yearly", stressTest: "Assess every 3–5 yr", advancedImaging: "Coronary CTA at 1 yr as baseline; consider q3–5 yr", antiplatelet: "Low‑dose aspirin", anticoag: "Not indicated", activity: "Promotion counseling at every visit" },
  "3.2": { key: "3.2", label: "Risk 3.2", color: "bg-yellow-200", zScore: "Regressed", description: "Small aneurysm – regressed to dilation only or normal", followUp: "Within 1 wk → 6 wk → 1 yr → 5 yr (may discharge if CTA + stress test normal)", stressTest: "Assess every 5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider if inducible ischemia", antiplatelet: "Continue low‑dose aspirin until dimensions normal", anticoag: "Not indicated", activity: "Promotion counseling at every visit" },
  "4.1": { key: "4.1", label: "Risk 4.1", color: "bg-orange-300", zScore: "5 – <10 and <8 mm", description: "Medium aneurysm – current/persistent", followUp: "Within 1 wk (closer if enlarging) → 6 wk → 3 mo → 6 mo → 12 mo → yearly", stressTest: "Assess every 2–5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider q2–5 yr", antiplatelet: "Low‑dose aspirin + clopidogrel", anticoag: "Not indicated", activity: "Promotion counseling; consider restricting contact; self‑limit", notes: ["β‑blockers and statins may be considered"] },
  "4.2": { key: "4.2", label: "Risk 4.2", color: "bg-orange-300", zScore: "Regressed", description: "Medium aneurysm – regressed to small aneurysm", followUp: "Within 1 wk → 6 wk → 6 mo → 12 mo → yearly", stressTest: "Assess every 3–5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider q3–5 yr", antiplatelet: "Low‑dose aspirin", anticoag: "Not indicated", activity: "Promotion counseling at every visit", notes: ["β‑blockers and statins may be considered"] },
  "4.3": { key: "4.3", label: "Risk 4.3", color: "bg-orange-300", zScore: "Regressed", description: "Medium aneurysm – regressed to normal or dilation only", followUp: "Within 1 wk → 6 wk → 6 mo → 12 mo → every 2 yr", stressTest: "Assess every 4–5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider if inducible ischemia", antiplatelet: "Low‑dose aspirin", anticoag: "Not indicated", activity: "Promotion counseling at every visit", notes: ["β‑blockers and statins may be considered"] },
  "5.1": { key: "5.1", label: "Risk 5.1", color: "bg-red-400", zScore: "≥10 or ≥8 mm", description: "Large/giant aneurysm – current/persistent", followUp: "Within 1 wk (closer if enlarging) → 6 wk → 3 mo → 6 mo → 9 mo → 12 mo → q6–12 mo", stressTest: "Assess every 6–12 mo", advancedImaging: "Baseline coronary CTA within 2–6 mo; consider q1–5 yr or invasive angiography", antiplatelet: "Low‑dose aspirin; dual antiplatelet with clopidogrel may be considered", anticoag: "Warfarin, LMWH, or DOAC", activity: "Promotion counseling; restrict contact; self‑limit", notes: ["β‑blockers and statins may be considered"] },
  "5.2": { key: "5.2", label: "Risk 5.2", color: "bg-red-400", zScore: "Regressed", description: "Large/giant aneurysm – regressed to medium aneurysm", followUp: "Within 1 wk (closer if enlarging) → 6 wk → 3 mo → 6 mo → 9 mo → 12 mo → q6–12 mo", stressTest: "Assess every 2–5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider q2–5 yr", antiplatelet: "Low‑dose aspirin; dual antiplatelet may be considered", anticoag: "Warfarin, LMWH, or DOAC may be considered (thrombosis risk dependent)", activity: "Promotion counseling; restrict contact; self‑limit", notes: ["β‑blockers and statins may be considered"] },
  "5.3": { key: "5.3", label: "Risk 5.3", color: "bg-red-400", zScore: "Regressed", description: "Large/giant aneurysm – regressed to small aneurysm", followUp: "Within 1 wk (closer if enlarging) → 6 wk → 3 mo → 6 mo → 9 mo → 12 mo → yearly", stressTest: "Assess every 3–5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider q3–5 yr", antiplatelet: "Low‑dose aspirin; dual antiplatelet may be considered", anticoag: "Not indicated", activity: "Promotion counseling; restrict contact; self‑limit", notes: ["β‑blockers and statins may be considered"] },
  "5.4": { key: "5.4", label: "Risk 5.4", color: "bg-red-400", zScore: "Regressed", description: "Large/giant aneurysm – regressed to normal or dilation only", followUp: "Within 1 wk (closer if enlarging) → 6 wk → 3 mo → 6 mo → 9 mo → 12 mo → q1–2 yr", stressTest: "Assess every 3–5 yr", advancedImaging: "Coronary CTA at 1 yr baseline; consider q3–5 yr", antiplatelet: "Low‑dose aspirin", anticoag: "Not indicated", activity: "Promotion counseling; restrict contact; self‑limit", notes: ["β‑blockers and statins may be considered"] },
};

const RISK_LIST: { key: RiskKey; title: string }[] = [
  { key: "1", title: "1 – No involvement" },
  { key: "2", title: "2 – Dilation only" },
  { key: "3.1", title: "3.1 – Small aneurysm (current)" },
  { key: "3.2", title: "3.2 – Small → regressed" },
  { key: "4.1", title: "4.1 – Medium (current)" },
  { key: "4.2", title: "4.2 – Medium → small" },
  { key: "4.3", title: "4.3 – Medium → normal/dilation" },
  { key: "5.1", title: "5.1 – Giant (current)" },
  { key: "5.2", title: "5.2 – Giant → medium" },
  { key: "5.3", title: "5.3 – Giant → small" },
  { key: "5.4", title: "5.4 – Giant → normal/dilation" },
];

function useSuggestedRisk(z: number | null, state: "current" | "regressed" | "none", regressedTo?: "dilation" | "small" | "medium" | "normal") {
  return useMemo<RiskKey | null>(() => {
    if (z == null || Number.isNaN(z)) return null;
    const effectiveState: "current" | "regressed" | "none" = state === "none" && z >= 2.5 ? "current" : state;
    if (z < 2) return "1";
    if (z >= 2 && z < 2.5) return "2";
    if (effectiveState === "current") {
      if (z >= 2.5 && z < 5) return "3.1";
      if (z >= 5 && z < 10) return "4.1";
      if (z >= 10) return "5.1";
    }
    if (effectiveState === "regressed") {
      if (z >= 2.5 && z < 5) return "3.2";
      if (z >= 5 && z < 10) {
        if (regressedTo === "small") return "4.2";
        return "4.3";
      }
      if (z >= 10) {
        if (regressedTo === "medium") return "5.2";
        if (regressedTo === "small") return "5.3";
        return "5.4";
      }
    }
    return null;
  }, [z, state, regressedTo]);
}

export default function App() {
  const [z, setZ] = useState<string>("");
  const [state, setState] = useState<"none" | "current" | "regressed">("none");
  const [regressedTo, setRegressedTo] = useState<"dilation" | "small" | "medium" | "normal" | "">("");
  const suggested = useSuggestedRisk(z === "" ? null : parseFloat(z), state, (regressedTo || undefined) as any);
  const [risk, setRisk] = useState<RiskKey>("1");
  useEffect(() => {
    if (suggested) setRisk(suggested);
  }, [suggested]);
  const active = risk;
  const plan = PLANS[active];
  const copyPlan = async () => {
    const text = `Kawasaki Disease Plan (Risk ${plan.key})\n\n` +
      `Z score: ${plan.zScore}\n` +
      `Description: ${plan.description}\n\n` +
      `Follow-up: ${plan.followUp}\n` +
      `Stress testing: ${plan.stressTest}\n` +
      `Advanced imaging: ${plan.advancedImaging}\n` +
      `Antiplatelet: ${plan.antiplatelet}\n` +
      `Anticoagulation: ${plan.anticoag ?? "—"}\n` +
      `Activity: ${plan.activity}\n` +
      `${plan.notes?.length ? `\nNotes: ${plan.notes.join("; ")}` : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Plan copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };
  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Kawasaki Disease – Visual Algorithm</h1>
            <p className="text-sm md:text-base text-neutral-600 mt-1 flex items-center gap-1"><Info className="h-4 w-4"/>Educational use only</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}><Download className="h-4 w-4 mr-2"/>Print/Save PDF</Button>
            <Button onClick={copyPlan}><Copy className="h-4 w-4 mr-2"/>Copy Plan</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <Card className="md:col-span-1 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">1) Enter patient state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Z score (max during illness)</Label>
                <Input inputMode="decimal" placeholder="e.g., 3.2" value={z} onChange={(e) => setZ(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Current coronary status</Label>
                <Select value={state} onValueChange={(v: any) => { setState(v); if (v !== "regressed") setRegressedTo(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No aneurysm (none/dilation)</SelectItem>
                    <SelectItem value="current">Aneurysm – current</SelectItem>
                    <SelectItem value="regressed">Aneurysm – regressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {state === "regressed" && (
                <div className="space-y-2">
                  <Label>Regressed to</Label>
                  <Select value={regressedTo} onValueChange={(v: any) => setRegressedTo(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose where it regressed to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="dilation">Dilation only</SelectItem>
                      <SelectItem value="small">Small aneurysm</SelectItem>
                      <SelectItem value="medium">Medium aneurysm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="pt-2">
                <div className="text-xs text-neutral-600 mb-2">Suggested risk level</div>
                <div className="flex gap-2 items-center">
                  <div className={`h-4 w-4 rounded ${active ? PLANS[active].color : "bg-neutral-200"}`} />
                  <Select value={active} onValueChange={(v: any) => setRisk(v)}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {RISK_LIST.map((r) => (
                        <SelectItem key={r.key} value={r.key}>{r.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">The dropdown auto‑updates from your inputs. You can still override it manually to match clinical context.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">2) Visual algorithm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border">
                  <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Step A</div>
                  <div className="font-semibold">Determine maximal Z score</div>
                  <p className="text-sm text-neutral-600 mt-2">Use consistent Z equation and accurate height/weight</p>
                  <div className="flex items-center gap-2 mt-3 text-sm"><Square className="h-3 w-3"/> {z || "—"}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border">
                  <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Step B</div>
                  <div className="font-semibold">Classify coronary status</div>
                  <p className="text-sm text-neutral-600 mt-2">None/dilation, current aneurysm, or regressed</p>
                  <div className="text-sm mt-2">Status: <span className="font-medium">{state}</span>{state === "regressed" && regressedTo ? ` → ${regressedTo}` : ""}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border">
                  <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Step C</div>
                  <div className="font-semibold flex items-center gap-2">Map to risk <ArrowRight className="h-4 w-4"/> <span className={`px-2 py-0.5 rounded ${PLANS[active].color}`}> {active} </span></div>
                  <p className="text-sm text-neutral-600 mt-2">Use the plan panel to follow through on visits, testing, and therapy</p>
                </div>
              </div>
              <div className={`mt-5 border rounded-2xl p-4 ${PLANS[active].color}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-lg font-semibold">Management plan – Risk {plan.key}</div>
                  <div className="text-sm text-neutral-700">Z score: {plan.zScore} · {plan.description}</div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/70 border rounded-xl p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Follow-up</div>
                    <div className="mt-1 text-sm">{plan.followUp}</div>
                  </div>
                  <div className="bg-white/70 border rounded-xl p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Stress testing</div>
                    <div className="mt-1 text-sm">{plan.stressTest}</div>
                  </div>
                  <div className="bg-white/70 border rounded-xl p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Advanced coronary imaging</div>
                    <div className="mt-1 text-sm">{plan.advancedImaging}</div>
                  </div>
                  <div className="bg-white/70 border rounded-xl p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Antiplatelet therapy</div>
                    <div className="mt-1 text-sm">{plan.antiplatelet}</div>
                  </div>
                  <div className="bg-white/70 border rounded-xl p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Anticoagulation</div>
                    <div className="mt-1 text-sm">{plan.anticoag ?? "Not indicated"}</div>
                  </div>
                  <div className="bg-white/70 border rounded-xl p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Activity counseling</div>
                    <div className="mt-1 text-sm">{plan.activity}</div>
                  </div>
                </div>
                {plan.notes?.length ? (
                  <div className="mt-3 text-sm text-neutral-800">
                    <span className="font-medium">Notes: </span>
                    {plan.notes.join(" · ")}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><SquareChartGantt className="h-5 w-5"/> 3) Color‑coded matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-neutral-200 text-neutral-800">
                    <th className="p-2 text-left">Risk</th>
                    <th className="p-2 text-left">Z score / status</th>
                    <th className="p-2 text-left">Follow‑up</th>
                    <th className="p-2 text-left">Stress test</th>
                    <th className="p-2 text-left">Advanced imaging</th>
                    <th className="p-2 text-left">Antiplatelet</th>
                    <th className="p-2 text-left">Anticoagulation</th>
                    <th className="p-2 text-left">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {RISK_LIST.map(({ key }) => {
                    const p = PLANS[key];
                    return (
                      <tr key={key} className="align-top">
                        <td className={`p-2 font-semibold ${p.color}`}>{key}</td>
                        <td className="p-2">{p.zScore}<div className="text-neutral-500">{p.description}</div></td>
                        <td className="p-2">{p.followUp}</td>
                        <td className="p-2">{p.stressTest}</td>
                        <td className="p-2">{p.advancedImaging}</td>
                        <td className="p-2">{p.antiplatelet}</td>
                        <td className="p-2">{p.anticoag ?? "Not indicated"}</td>
                        <td className="p-2">{p.activity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-600 mt-3">Adapted from AHA Kawasaki Disease long‑term management guidance (Table 2). Use clinical judgment and patient‑specific factors.</p>
          </CardContent>
        </Card>
        <div className="text-[11px] text-neutral-500 mt-6">This tool is for education and quick reference. It does not replace guidelines or individualized care.</div>
      </div>
    </div>
  );
}
