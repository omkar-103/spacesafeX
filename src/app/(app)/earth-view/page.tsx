'use client';

// ============================================================
// SpaceSafe X — 3D Earth Visualization Page
// ============================================================
// Interactive Earth view with satellite tracking, orbital paths,
// debris visualization, and satellite detail panel.
// Uses CSS-only fallback in demo mode (no Cesium token).
// ============================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe2,
  Satellite as SatelliteIcon,
  Eye,
  EyeOff,
  Orbit,
  Trash2,
  AlertTriangle,
  X,
  Gauge,
  Fuel,
  Radio,
  Heart,
  ChevronRight,
  Layers,
  Filter,
  Info,
} from 'lucide-react';
import EarthFallback from '@/components/earth/earth-fallback';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getRiskLevel, formatNumber } from '@/lib/utils';
import { getDemoSatellites, getDemoDebris } from '@/lib/demo-data';
import type { Satellite } from '@/types';

// ============================================================
// Satellite Detail Panel
// ============================================================

function SatelliteDetailPanel({
  satellite,
  onClose,
}: {
  satellite: Satellite;
  onClose: () => void;
}) {
  const riskLevel = getRiskLevel(satellite.riskScore);

  const healthColor: Record<string, string> = {
    nominal: 'text-emerald-400',
    degraded: 'text-amber-400',
    critical: 'text-red-400',
    offline: 'text-white/30',
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 bottom-0 w-96 max-w-full z-30 glass-lg overflow-y-auto no-scrollbar"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10">
              <SatelliteIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{satellite.satelliteName}</h3>
              <p className="text-[10px] text-white/30 font-mono">{satellite.satelliteId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status Row */}
        <div className="flex items-center gap-2">
          <Badge variant={satellite.status === 'active' ? 'low' : satellite.status === 'inactive' ? 'high' : 'moderate'}>
            {satellite.status}
          </Badge>
          <Badge variant={riskLevel}>Risk: {satellite.riskScore}</Badge>
          <span className={`text-xs font-medium ${healthColor[satellite.healthStatus]}`}>
            ● {satellite.healthStatus}
          </span>
        </div>

        {/* Orbital Info */}
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Orbital Parameters</p>
          {[
            { label: 'Orbit Type', value: satellite.orbitType },
            { label: 'Semi-Major Axis', value: `${formatNumber(satellite.orbitData.semiMajorAxis, { decimals: 1 })} km` },
            { label: 'Eccentricity', value: satellite.orbitData.eccentricity.toFixed(4) },
            { label: 'Inclination', value: `${satellite.orbitData.inclination.toFixed(1)}°` },
            { label: 'RAAN', value: `${satellite.orbitData.raan.toFixed(1)}°` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs">
              <span className="text-white/40">{row.label}</span>
              <span className="text-white/80 font-mono">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Velocity */}
        {satellite.velocity && (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Velocity Vector</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Vx', val: satellite.velocity.vx },
                { label: 'Vy', val: satellite.velocity.vy },
                { label: 'Vz', val: satellite.velocity.vz },
              ].map((v) => (
                <div key={v.label}>
                  <p className="text-xs text-white/30">{v.label}</p>
                  <p className="text-sm font-mono text-white/80">{v.val.toFixed(2)}</p>
                  <p className="text-[10px] text-white/20">km/s</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Gauges */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-white/30">System Health</p>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/40 flex items-center gap-1"><Fuel className="w-3 h-3" /> Fuel</span>
              <span className="text-white/70">{satellite.fuelRemaining}%</span>
            </div>
            <Progress value={satellite.fuelRemaining} size="sm" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/40 flex items-center gap-1"><Gauge className="w-3 h-3" /> Power</span>
              <span className="text-white/70">{formatNumber(satellite.power)} W</span>
            </div>
            <Progress value={Math.min(100, (satellite.power / 5000) * 100)} size="sm" color="purple" />
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Details</p>
          {[
            { label: 'Operator', value: satellite.operator },
            { label: 'Mission Type', value: satellite.missionType },
            { label: 'NORAD ID', value: satellite.noradId },
            { label: 'Mass', value: `${formatNumber(satellite.mass)} kg` },
            { label: 'Size', value: `${satellite.size} m` },
            { label: 'Launch Date', value: new Date(satellite.launchDate).toLocaleDateString() },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs">
              <span className="text-white/40">{row.label}</span>
              <span className="text-white/80">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Satellite List Sidebar
// ============================================================

function SatelliteListItem({
  satellite,
  isSelected,
  onClick,
}: {
  satellite: Satellite;
  isSelected: boolean;
  onClick: () => void;
}) {
  const riskLevel = getRiskLevel(satellite.riskScore);
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-2.5 rounded-lg border transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'bg-cyan-500/10 border-cyan-500/30'
          : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">{satellite.satelliteName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-white/30 font-mono">{satellite.orbitType}</span>
            <Badge variant={riskLevel} className="!text-[9px] !px-1.5 !py-0">
              {satellite.riskScore}
            </Badge>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          satellite.status === 'active' ? 'bg-emerald-400' :
          satellite.status === 'inactive' ? 'bg-red-400' : 'bg-amber-400'
        }`} />
      </div>
    </button>
  );
}

// ============================================================
// Earth View Page
// ============================================================

export default function EarthViewPage() {
  const satellites = getDemoSatellites();
  const debris = getDemoDebris();

  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [showSatellites, setShowSatellites] = useState(true);
  const [showDebris, setShowDebris] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showList, setShowList] = useState(true);
  const [filterOrbit, setFilterOrbit] = useState<string>('all');

  const filteredSatellites = useMemo(() => {
    if (filterOrbit === 'all') return satellites;
    return satellites.filter(s => s.orbitType === filterOrbit);
  }, [satellites, filterOrbit]);

  const orbitTypes = ['all', 'LEO', 'MEO', 'GEO', 'SSO', 'polar'];

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* ================================ */}
      {/* Earth Visualization (full area)  */}
      {/* ================================ */}
      <EarthFallback
        satellites={filteredSatellites}
        debris={debris}
        showSatellites={showSatellites}
        showDebris={showDebris}
        showOrbits={showOrbits}
        showRiskZones={showRiskZones}
        onSelectSatellite={setSelectedSatellite}
        selectedSatelliteId={selectedSatellite?.satelliteId ?? null}
      />

      {/* ================================ */}
      {/* Top Overlay Controls             */}
      {/* ================================ */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass"
        >
          <Globe2 className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Earth Visualization</span>
          <span className="text-[10px] text-white/30 font-mono ml-2">
            {satellites.length} SAT • {debris.length} DEB
          </span>
        </motion.div>

        {/* Visibility Toggles */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-1.5"
        >
          {[
            { label: 'Satellites', state: showSatellites, toggle: () => setShowSatellites(!showSatellites), icon: <SatelliteIcon className="w-3.5 h-3.5" /> },
            { label: 'Debris', state: showDebris, toggle: () => setShowDebris(!showDebris), icon: <Trash2 className="w-3.5 h-3.5" /> },
            { label: 'Orbits', state: showOrbits, toggle: () => setShowOrbits(!showOrbits), icon: <Orbit className="w-3.5 h-3.5" /> },
            { label: 'Risk Zones', state: showRiskZones, toggle: () => setShowRiskZones(!showRiskZones), icon: <AlertTriangle className="w-3.5 h-3.5" /> },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.toggle}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                transition-all duration-200 cursor-pointer
                ${btn.state
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                  : 'glass text-white/40 hover:text-white/60'
                }
              `}
            >
              {btn.state ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ================================ */}
      {/* Satellite List (Left Sidebar)    */}
      {/* ================================ */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-28 left-4 bottom-4 w-72 z-20 glass-lg rounded-xl overflow-hidden flex flex-col"
          >
            {/* List Header */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Tracked Objects
                </h3>
                <span className="text-[10px] text-white/30 font-mono">{filteredSatellites.length}</span>
              </div>
              {/* Orbit Filter */}
              <div className="flex flex-wrap gap-1">
                {orbitTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterOrbit(type)}
                    className={`
                      px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer
                      ${filterOrbit === type
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-white/30 hover:text-white/50 border border-transparent'
                      }
                    `}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Satellite list */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
              {filteredSatellites.map((sat) => (
                <SatelliteListItem
                  key={sat.satelliteId}
                  satellite={sat}
                  isSelected={selectedSatellite?.satelliteId === sat.satelliteId}
                  onClick={() => setSelectedSatellite(sat)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle List Button */}
      <button
        onClick={() => setShowList(!showList)}
        className="absolute bottom-4 left-4 z-20 p-2 rounded-lg glass hover:bg-white/10 transition-all cursor-pointer"
        title={showList ? 'Hide list' : 'Show list'}
      >
        <Layers className="w-4 h-4 text-white/50" />
      </button>

      {/* ================================ */}
      {/* Satellite Detail Panel (Right)   */}
      {/* ================================ */}
      <AnimatePresence>
        {selectedSatellite && (
          <SatelliteDetailPanel
            satellite={selectedSatellite}
            onClose={() => setSelectedSatellite(null)}
          />
        )}
      </AnimatePresence>

      {/* ================================ */}
      {/* Stats Bar (Bottom)               */}
      {/* ================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-4 py-2 rounded-lg glass"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-white/40">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-white/40">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-[10px] text-white/40">Critical</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-400 opacity-60" />
          <span className="text-[10px] text-white/40">Debris</span>
        </div>
      </motion.div>
    </div>
  );
}
