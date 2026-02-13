import React, { useEffect, useRef, useState } from 'react';
import { LiaTreeSolid, } from "react-icons/lia";
import { LuTruck } from "react-icons/lu";
import { CiCloudOff } from "react-icons/ci";

// Generic animated counter hook (extracted so cards stay clean)
const useCounter = (endValue, duration = 1600, decimals = 0) => {
  const [val, setVal] = useState(0);
  const rafRef = useRef();
  const startRef = useRef();

  useEffect(() => {
    const animate = (t) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setVal(endValue * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [endValue, duration]);

  if (decimals > 0) return (Math.round(val * 10 ** decimals) / 10 ** decimals).toFixed(decimals);
  return Math.round(val).toLocaleString('en-IN');
};

// Inline SVG icon helpers (kept minimal for now)
const RoadIcon = ({ className }) => (
  <LuTruck className={className} />
);
const CloudCO2Icon = ({ className }) => (
  <CiCloudOff className={className} />
);
const TreeIcon = ({ className }) => (
  <LiaTreeSolid className={className} />
);

export default function Impact() {
  const targets = { kms: 1567, co2: 47.8, trees: 2847 };
  const kms = useCounter(targets.kms, 1600, 0);
  const co2 = useCounter(targets.co2, 1600, 1);
  const trees = useCounter(targets.trees, 1600, 0);

  const cards = [
    {
      key: 'kms',
      title: 'Green Kms',
      subtitle: 'Total distance driven on EVs',
      value: kms,
      unit: 'km',
      accent: '#FFB347',
      soft: '#FFF4E0',
      Icon: RoadIcon,
    },
    {
      key: 'co2',
      title: 'CO₂ Saved',
      subtitle: 'Estimated emissions avoided',
      value: co2,
      unit: 'tons',
      accent: '#FF7A59',
      soft: '#FFE9E6',
      Icon: CloudCO2Icon,
    },
    {
      key: 'trees',
      title: 'Trees Planted',
      subtitle: 'Equivalent offset planting',
      value: trees,
      unit: '',
      accent: '#10B981',
      soft: '#E6FBF4',
      Icon: TreeIcon,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(({ key, title, subtitle, value, unit, accent, soft, Icon }) => (
          <div
            key={key}
            className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start gap-4 flex-col">
              <div
                className="flex h-14 w-14 items-center justify-center align-center rounded-full"
                style={{ backgroundColor: soft, color: accent }}
              >
                <Icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-800 leading-snug">{title}</div>
                {/* <div className="mt-0.5 text-xs font-medium text-gray-500 tracking-wide">
                  {subtitle}
                </div> */}
              </div>
            </div>
            <div className="mt-6 flex items-end gap-1">
              <div
                className="tabular-nums font-bold tracking-tight"
                style={{ color: accent, fontSize: 'clamp(1.6rem,2.2vw,2.15rem)' }}
                aria-label={`${title} ${value}${unit ? ' ' + unit : ''}`}
              >
                {value}
              </div>
              {unit && (
                <span className="pb-1 text-sm font-medium text-gray-500">{unit}</span>
              )}
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1 rounded-b-2xl  "
              style={{ background: accent, opacity: 0.15,width:'90%',marginLeft:'5%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
