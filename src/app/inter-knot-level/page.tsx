'use client';

import React, { JSX, useState } from "react";
import { INTER_KNOT_LEVEL_DATA } from "./inter-knot-level-data";
import { formatNumber } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import LocalStorageService from "@/services/LocalStorageService";
import { InterKnotLevelPageData } from "@/types/interKnotLevelDataTypes";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const storageService = new LocalStorageService("union_levels");

const MAX_IKL_LEVEL = 60;

export default function UnionLevelPage() {
  const [interKnotLevelData, setinterKnotLevelData] = useState<InterKnotLevelPageData | null>(null);
  const [displayedRows, setDisplayedRows] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const data = storageService.load() as InterKnotLevelPageData || {
      currentExp: 0,
      currentLevel: 1,
      desiredLevel: MAX_IKL_LEVEL,
      refreshCount: 0,
      tableSteps: 1,
    };
    setinterKnotLevelData(data);
  }, []);

  useEffect(() => {
    if (!interKnotLevelData) return;
    storageService.save(interKnotLevelData);
  }, [interKnotLevelData]);

  if (!interKnotLevelData) return (<div>Loading...</div>);

  const updateField = (field: keyof InterKnotLevelPageData, value: number) => {
    setinterKnotLevelData(prev => (prev ? { ...prev, [field]: value } : prev));
  }
  const updateCurrentExp = (value: number) => {
    updateField("currentExp", Math.min(Math.max(value, 0), 1e9));
  }
  const updateCurrentLevel = (value: number) => {
    updateField("currentLevel", Math.min(Math.max(value, 1), MAX_IKL_LEVEL));
  }
  const updateDesiredLevel = (value: number) => {
    updateField("desiredLevel", Math.min(Math.max(value, 2), MAX_IKL_LEVEL));
  }
  const updateRefreshCount = (value: number) => {
    updateField("refreshCount", Math.min(Math.max(value, 0), 6));
  }
  const updateTableSteps = (value: number) => {
    updateField("tableSteps", Math.min(Math.max(value, 1), MAX_IKL_LEVEL));
  }

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rows = [];
    const {
      currentExp,
      currentLevel,
      desiredLevel,
      refreshCount,
      tableSteps,
    } = interKnotLevelData;

    const genRow = (i: number): JSX.Element => {
      const expDiff = INTER_KNOT_LEVEL_DATA[i][1] - INTER_KNOT_LEVEL_DATA[currentLevel][1] - currentExp;
      const batteryIKExp = 10 * (240 + refreshCount * 60);
      const errandsIKExp = 600;
      // TODO: include Ridu Weekly
      const daysNeeded = expDiff / (batteryIKExp + errandsIKExp);
      const batteryNeeded = (expDiff * 240) / batteryIKExp;
      const etherBatteryNeeded = batteryNeeded / 60;

      return (
        <TableRow key={i}>
          <TableCell className="text-center">{i}</TableCell>
          <TableCell className="text-right">{formatNumber(expDiff)}</TableCell>
          <TableCell className="text-right">{formatNumber(daysNeeded.toFixed(2))}</TableCell>
          <TableCell className="text-right">{formatNumber(batteryNeeded.toFixed(2))}</TableCell>
          <TableCell className="text-center">{formatNumber(etherBatteryNeeded.toFixed(2))}</TableCell>
        </TableRow>
      )
    }
    const inc = Math.min(MAX_IKL_LEVEL, Math.max(tableSteps, 1));

    for (let i = currentLevel + inc; i < desiredLevel; i += inc) {
      rows.push(genRow(i));
    }
    rows.push(genRow(desiredLevel));
    setDisplayedRows(rows);
  };

  return (
    <div className="bg-base-200 rounded-md flex flex-col gap-2 w-fit m-auto p-2">
      <h1 className="text-center">Union Level Page</h1>
      <div className="bg-base-200 flex flex-col gap-2">
        <form className="flex flex-col gap-2">
          {[
            ["Current Exp", "currentExp", interKnotLevelData.currentExp, updateCurrentExp],
            ["Current Level", "currentLevel", interKnotLevelData.currentLevel, updateCurrentLevel],
            ["Desired Level", "desiredLevel", interKnotLevelData.desiredLevel, updateDesiredLevel],
            ["Refresh Count", "refreshCount", interKnotLevelData.refreshCount, updateRefreshCount],
            ["Table Steps", "tableSteps", interKnotLevelData.tableSteps, updateTableSteps],
          ].map(([label, field, value, onChange]) => (
            <div key={field as string} className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[200px]" htmlFor={field as string}>{label as string}</label>
              <Input
                type="number"
                id={field as string}
                value={value as number}
                onChange={(e) => (onChange as (value: number) => void)(parseInt(e.target.value))}
              />
            </div>
          ))}
          <Button onClick={calculate}>Calculate</Button>
        </form>
      </div>
      <div className="flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Lvl</TableHead>
              <TableHead className="text-center">Exp Diff</TableHead>
              <TableHead className="text-center">Days</TableHead>
              <TableHead className="text-center">Battery</TableHead>
              <TableHead className="text-center">Ether Battery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRows}
          </TableBody>
        </Table>
      </div>
    </div >
  );
}