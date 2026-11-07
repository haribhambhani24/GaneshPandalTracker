import L from 'leaflet';
import type { Pandal } from '../../types/pandal';

/**
 * Returns an SVG string representing Lord Ganesha silhouette with crown and tilak.
 */
export function getGaneshaSvg(color: string = '#FFFFFF'): string {
  return `
    <svg viewBox="0 0 64 64" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Mukut (Crown) -->
      <path d="M32 6L37 16H27L32 6Z" fill="#FDE047" stroke="#B45309" stroke-width="1.2"/>
      <circle cx="32" cy="7" r="2" fill="#DC2626"/>
      <path d="M26 16C26 16 29 19 32 19C35 19 38 16 38 16" stroke="#FDE047" stroke-width="1.5" stroke-linecap="round"/>
      
      <!-- Ganesha Head & Trunk -->
      <path d="M23 20C16 20 13 25 15 32C17 38 23 37 23 37" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M41 20C48 20 51 25 49 32C47 38 41 37 41 37" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Forehead & Tilak -->
      <path d="M32 18V25" stroke="#DC2626" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="27" r="1.5" fill="#DC2626"/>
      <path d="M24 23C27 20 37 20 40 23" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Trunk sweeping down and curling to viewer's left -->
      <path d="M32 28C32 34 33 40 29 44C26 47 21 46 22 42C23 39 27 41 27 41" 
            stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Modak -->
      <circle cx="21" cy="42" r="2.5" fill="#F59E0B" stroke="#92400E" stroke-width="0.8"/>
      
      <!-- Tusk -->
      <path d="M35 34L38 36" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

/**
 * Creates a custom Ganesha-themed Leaflet DivIcon for a pandal.
 * Supports optional circuit stop number badge (#1, #2, #3...)
 */
export function createGaneshaIcon(
  pandal: Pandal,
  isSelected: boolean = false,
  circuitStopNumber?: number
): L.DivIcon {
  const ganeshaSvg = getGaneshaSvg('#FFFBEB');
  const crowdBorder =
    pandal.crowdLevel === 'High'
      ? 'border-red-500 ring-2 ring-red-400'
      : pandal.crowdLevel === 'Medium'
      ? 'border-amber-500 ring-1 ring-amber-300'
      : 'border-emerald-500 ring-1 ring-emerald-300';

  const scaleClass = isSelected
    ? 'scale-125 z-[1000] ring-4 ring-amber-400 drop-shadow-[0_10px_15px_rgba(234,88,12,0.6)]'
    : 'hover:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]';

  const html = `
    <div class="relative group cursor-pointer transition-transform duration-200 ${scaleClass}">
      <!-- Marker Pin Body -->
      <div class="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 p-0.5 shadow-xl flex items-center justify-center border-2 ${crowdBorder}">
        <div class="w-full h-full rounded-full bg-gradient-to-t from-red-900/40 via-transparent to-amber-400/20 flex items-center justify-center overflow-hidden">
          ${ganeshaSvg}
        </div>
      </div>
      <!-- Pin Pointer triangle -->
      <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-700 mx-auto -mt-0.5 filter drop-shadow(0 2px 2px rgba(0,0,0,0.3))"></div>
      
      <!-- Circuit Stop Number Badge -->
      ${
        circuitStopNumber !== undefined
          ? `<div class="absolute -top-2 -left-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-full font-black text-[11px] w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-bounce" title="Stop #${circuitStopNumber}">
              ${circuitStopNumber}
            </div>`
          : ''
      }

      <!-- Eco Friendly Leaf Badge -->
      ${
        pandal.ecoFriendly && circuitStopNumber === undefined
          ? `<div class="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white shadow text-[10px] w-4 h-4 flex items-center justify-center" title="Eco-Friendly Idol">🌱</div>`
          : ''
      }
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-ganesha-marker-wrapper',
    iconSize: [44, 48],
    iconAnchor: [22, 46],
    popupAnchor: [0, -42],
  });
}

/**
 * Creates custom styled cluster icons using festival theme (saffron / deep red).
 */
export function createClusterIcon(cluster: { getChildCount: () => number }): L.DivIcon {
  const count = cluster.getChildCount();
  let size = 44;
  let bgGradient = 'from-amber-500 via-orange-600 to-red-700';

  if (count > 8) {
    size = 52;
    bgGradient = 'from-orange-600 via-red-600 to-rose-800';
  } else if (count > 4) {
    size = 48;
    bgGradient = 'from-amber-500 via-orange-600 to-red-600';
  }

  const html = `
    <div class="w-[${size}px] h-[${size}px] rounded-full bg-gradient-to-br ${bgGradient} p-1 shadow-2xl flex items-center justify-center border-2 border-amber-300 ring-2 ring-orange-500/50 cursor-pointer transition-transform hover:scale-110">
      <div class="w-full h-full rounded-full bg-black/25 flex flex-col items-center justify-center text-white font-bold leading-none">
        <span class="text-xs">🕉️</span>
        <span class="text-xs tracking-wider">${count}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cluster-marker-wrapper',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
