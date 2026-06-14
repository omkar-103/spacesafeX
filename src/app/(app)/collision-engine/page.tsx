'use client';

// ============================================================
// SpaceSafe X — Collision Prediction Engine Page
// ============================================================
// Full collision analysis interface with sortable prediction
// table, detailed conjunction cards, avoidance maneuver
// details, and risk distribution charts.
// ============================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Crosshair,
  Zap,
  Clock,
  Route,
  Fuel,
  Gauge,
  Filter,
  Info,
  ArrowRight,
  X,
  BarChart3,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getRiskLevel, formatCountdown, formatNumber } from '@/lib/utils';
import { getDemoCollisionPredictions, getDemoSatellites, getDemoDebris } from '@/lib/demo-data';
import type { CollisionPrediction, AvoidanceManeuver } from '@/types';

// --- Sort Options ---
type SortField = 'riskScore' | 'probability' | 'timeToImpact' | 'missDistance';

function sortPredictions(predictions: CollisionPrediction[], field: SortField, asc: boolean): CollisionPrediction[] {
  return [...predictions].sort((a, b) => {
    const diff = a[field] - b[field];
    return asc ? diff : -diff;
  });
}

// --- Prediction Detail Drawer ---
function PredictionDetail({
  prediction,
  onClose,
}: {
  prediction: CollisionPrediction;
  onClose: () => void;
}) {
  const riskLevel = getRiskLevel(prediction.riskScore);
  const maneuver = prediction.avoidanceManeuver;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            prediction.status === 'critical' ? 'bg-red-500/10' : 'bg-amber-500/10'
          }`}>
            <ShieldAlert className={`w-5 h-5 ${
              prediction.status === 'critical' ? 'text-red-400' : 'text-amber-400'
            }`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{prediction.predictionId}</h3>
            <p className="text-[10px] text-white/30">Conjunction Analysis Detail</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={riskLevel}>{prediction.status}</Badge>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Objects */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-3">
            <p className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1">Primary Object</p>
            <p className="text-sm font-medium text-white">{prediction.satelliteName}</p>
            <p className="text-[10px] text-white/30 font-mono">{prediction.satelliteId}</p>
          </div>
          <div className="rounded-lg border border-orange-500/10 bg-orange-500/5 p-3">
            <p className="text-[10px] text-orange-400/60 uppercase tracking-wider mb-1">Secondary Object</p>
            <p className="text-sm font-medium text-white">{prediction.debrisName}</p>
            <p className="text-[10px] text-white/30 font-mono">{prediction.debrisId}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Probability', value: `${(prediction.probability * 100).toFixed(4)}%`, icon: <Gauge className="w-3.5 h-3.5 text-red-400" /> },
            { label: 'Miss Distance', value: `${prediction.missDistance} km`, icon: <Crosshair className="w-3.5 h-3.5 text-amber-400" /> },
            { label: 'Relative Velocity', value: `${prediction.relativeVelocity} km/s`, icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> },
            { label: 'Risk Score', value: `${prediction.riskScore}/100`, icon: <AlertTriangle className="w-3.5 h-3.5 text-purple-400" /> },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                {m.icon}
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{m.label}</p>
              </div>
              <p className="text-sm font-bold text-white font-mono">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Risk Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/40">Risk Level</span>
            <span className="text-white/70 font-mono">{prediction.riskScore}/100</span>
          </div>
          <Progress value={prediction.riskScore} size="md" />
        </div>

        {/* Avoidance Maneuver */}
        {maneuver && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Route className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-emerald-400">AI Avoidance Maneuver</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total ΔV', value: `${(maneuver.totalDeltaV * 1000).toFixed(1)} m/s` },
                { label: 'Fuel Cost', value: `${maneuver.fuelCost} kg (${maneuver.fuelPercentage.toFixed(2)}%)` },
                { label: 'Burn Duration', value: `${maneuver.burnDuration}s` },
                { label: 'New Miss Distance', value: `${maneuver.safetyMargin} km` },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[10px] text-emerald-400/50 uppercase tracking-wider">{m.label}</p>
                  <p className="text-sm font-medium text-white font-mono">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/10">
              <p className="text-[10px] text-emerald-400/40 uppercase tracking-wider mb-1">ΔV Vector (km/s)</p>
              <div className="flex gap-4 text-xs font-mono text-emerald-400/80">
                <span>Vx: {maneuver.deltaV.vx.toFixed(4)}</span>
                <span>Vy: {maneuver.deltaV.vy.toFixed(4)}</span>
                <span>Vz: {maneuver.deltaV.vz.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Prediction Row ---
function PredictionRow({
  prediction,
  isSelected,
  onClick,
  index,
}: {
  prediction: CollisionPrediction;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const riskLevel = getRiskLevel(prediction.riskScore);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-200 border-b border-white/[0.03]
        ${isSelected
          ? 'bg-cyan-500/5'
          : 'hover:bg-white/[0.02]'
        }
      `}
    >
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-white/40">{prediction.predictionId}</span>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm text-white font-medium">{prediction.satelliteName}</p>
          <p className="text-xs text-white/30">{prediction.satelliteId}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm text-white/70">{prediction.debrisName}</p>
          <p className="text-xs text-white/20">{prediction.debrisId}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs font-mono text-white/60">{(prediction.probability * 100).toFixed(4)}%</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs font-mono text-white/60">{prediction.missDistance} km</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs font-mono text-white/60">{prediction.relativeVelocity} km/s</span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className={`text-sm font-bold ${
            prediction.riskScore >= 80 ? 'text-red-400' :
            prediction.riskScore >= 60 ? 'text-amber-400' :
            prediction.riskScore >= 30 ? 'text-yellow-400' : 'text-emerald-400'
          }`}>
            {prediction.riskScore}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <Badge variant={riskLevel}>{prediction.status}</Badge>
      </td>
      <td className="px-4 py-3 text-center">
        {prediction.avoidanceManeuver ? (
          <Badge variant="info">Available</Badge>
        ) : (
          <span className="text-xs text-white/20">—</span>
        )}
      </td>
    </motion.tr>
  );
}

// ============================================================
// Collision Engine Page
// ============================================================

export default function CollisionEnginePage() {
  const predictions = getDemoCollisionPredictions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = predictions;
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }
    return sortPredictions(result, sortField, sortAsc);
  }, [predictions, sortField, sortAsc, statusFilter]);

  const selectedPrediction = predictions.find(p => p.predictionId === selectedId) || null;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
    >
      {label}
      {sortField === field ? (
        sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-30" />
      )}
    </button>
  );

  // Stats
  const stats = {
    critical: predictions.filter(p => p.status === 'critical').length,
    warning: predictions.filter(p => p.status === 'warning').length,
    monitoring: predictions.filter(p => p.status === 'monitoring').length,
    withManeuver: predictions.filter(p => p.avoidanceManeuver).length,
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ================================ */}
      {/* Header                           */}
      {/* ================================ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
            Collision Prediction Engine
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Advanced conjunction analysis with AI-generated avoidance maneuvers
          </p>
        </div>
      </motion.div>

      {/* ================================ */}
      {/* Summary Stats                    */}
      {/* ================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Critical Threats', value: stats.critical, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Warnings', value: stats.warning, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Monitoring', value: stats.monitoring, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'AI Maneuvers', value: stats.withManeuver, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border ${stat.bg} p-4`}
          >
            <p className="text-xs text-white/40 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ================================ */}
      {/* Filter Bar                       */}
      {/* ================================ */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-white/30" />
        {['all', 'critical', 'warning', 'monitoring'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-white/20 font-mono">{filtered.length} predictions</span>
      </div>

      {/* ================================ */}
      {/* Main Content                     */}
      {/* ================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Predictions Table */}
        <div className={`${selectedPrediction ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
          <Card variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/30 font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/30 font-medium">Satellite</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/30 font-medium">Debris</th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider font-medium">
                      <SortHeader field="probability" label="Probability" />
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider font-medium">
                      <SortHeader field="missDistance" label="Miss Dist" />
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/30 font-medium">Vel</th>
                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider font-medium">
                      <SortHeader field="riskScore" label="Risk" />
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider text-white/30 font-medium">Status</th>
                    <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider text-white/30 font-medium">Maneuver</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <PredictionRow
                      key={p.predictionId}
                      prediction={p}
                      isSelected={selectedId === p.predictionId}
                      onClick={() => setSelectedId(selectedId === p.predictionId ? null : p.predictionId)}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedPrediction && (
            <div className="lg:col-span-2">
              <PredictionDetail
                prediction={selectedPrediction}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
