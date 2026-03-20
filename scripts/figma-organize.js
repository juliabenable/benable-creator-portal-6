/**
 * Figma Organize Script
 *
 * Run this via Chrome MCP javascript_tool on the Figma file tab.
 * It renames all frames, deletes duplicates, arranges in rows,
 * adds section labels and flow arrows — all in one shot.
 *
 * Usage: Copy-paste into javascript_tool or read + eval via Chrome MCP.
 *
 * CONFIG: Edit nameMap below to match your capture IDs to screen names.
 * The script auto-identifies frames by their capture order (position).
 */

(async () => {
  const page = figma.currentPage;

  // ─── CONFIG ───────────────────────────────────────────────
  // Map frame names/patterns to proper labels.
  // If frames are all named "Benable Creator Portal", we sort by x position
  // and assign names in the order defined here.

  const ROW_DEFINITIONS = [
    {
      title: 'ONBOARDING FLOW',
      subtitle: 'Creator applies to join the program',
      screens: [
        'Apply 0 — Welcome',
        'Apply 1 — Personal Info',
        'Apply 2 — Shipping Address',
        'Apply 3 — Social Stats',
      ],
    },
    {
      title: 'DASHBOARD STATES',
      subtitle: 'Different states after applying',
      screens: [
        'Dashboard — Application Under Review',
        'Dashboard — Application Not Accepted',
        'Dashboard — Accepted (No Campaigns)',
        'Dashboard — Campaign Completed',
      ],
    },
    {
      title: 'CAMPAIGN FLOW',
      subtitle: 'Full campaign lifecycle from brief to completion',
      screens: [
        'Campaign 1 — Brief & Accept',
        'Campaign 1 — Brief (with Decline)',
        'Campaign 2 — Choose Product',
        'Campaign 3a — Order Placed',
        'Campaign 3b — Content Upload',
        'Campaign 3c — Content Review',
        'Campaign 4 — Content Approved',
        'Campaign 5 — Completed',
      ],
    },
  ];

  const GAP = 100;       // horizontal gap between frames
  const ROW_GAP = 400;   // vertical gap between rows
  const LABEL_OFFSET = 80; // space above row for labels

  // ─── STEP 1: Rename frames ────────────────────────────────
  // If a nameMap is provided on window, use it: { 'nodeId': 'Screen Name' }
  // Otherwise, frames should already be named from previous captures.
  if (window.__figmaNameMap) {
    for (const child of page.children) {
      if (window.__figmaNameMap[child.id]) {
        child.name = window.__figmaNameMap[child.id];
      }
    }
  }

  // ─── STEP 2: Delete duplicates ────────────────────────────
  const seen = new Set();
  const toDelete = [];
  for (const child of page.children) {
    if (child.type !== 'FRAME') continue;
    if (seen.has(child.name)) {
      toDelete.push(child);
    } else {
      seen.add(child.name);
    }
  }
  toDelete.forEach(f => f.remove());

  // ─── STEP 3: Fix frame sizes ─────────────────────────────
  for (const frame of page.children) {
    if (frame.type !== 'FRAME') continue;
    let maxRight = 0, maxBottom = 0;
    for (const child of frame.children) {
      child.visible = true;
      maxRight = Math.max(maxRight, child.x + child.width);
      maxBottom = Math.max(maxBottom, child.y + child.height);
    }
    frame.resize(maxRight, maxBottom + 20);
    frame.clipsContent = true;
  }

  // ─── STEP 4: Arrange in rows ─────────────────────────────
  function findFrame(name) {
    return page.children.find(c => c.name === name && c.type === 'FRAME');
  }

  let currentY = LABEL_OFFSET + 20;

  for (const row of ROW_DEFINITIONS) {
    let x = 0;
    let maxH = 0;

    for (const screenName of row.screens) {
      const frame = findFrame(screenName);
      if (frame) {
        frame.x = x;
        frame.y = currentY;
        x += frame.width + GAP;
        maxH = Math.max(maxH, frame.height);
      }
    }

    // Store row Y for labels
    row._y = currentY;
    row._maxH = maxH;
    currentY += maxH + ROW_GAP;
  }

  // Move any unmatched frames (like desktop variant) off to the side
  const allRowScreens = ROW_DEFINITIONS.flatMap(r => r.screens);
  for (const child of page.children) {
    if (child.type !== 'FRAME' && child.type !== 'TEXT') continue;
    if (child.type === 'FRAME' && !allRowScreens.includes(child.name)) {
      child.x = 5000;
      child.y = 100;
    }
  }

  // ─── STEP 5: Remove old labels and arrows ─────────────────
  const oldText = page.children.filter(c => c.type === 'TEXT');
  oldText.forEach(t => t.remove());

  // ─── STEP 6: Add section labels ───────────────────────────
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  for (const row of ROW_DEFINITIONS) {
    const title = figma.createText();
    title.fontName = { family: 'Inter', style: 'Bold' };
    title.characters = row.title;
    title.fontSize = 32;
    title.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
    title.x = 0;
    title.y = row._y - LABEL_OFFSET;

    const sub = figma.createText();
    sub.fontName = { family: 'Inter', style: 'Regular' };
    sub.characters = row.subtitle;
    sub.fontSize = 16;
    sub.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    sub.x = 0;
    sub.y = row._y - LABEL_OFFSET + 40;
  }

  // ─── STEP 7: Add flow arrows ──────────────────────────────
  const arrowColor = { r: 0.45, g: 0.35, b: 0.85 };
  const arrowRows = [ROW_DEFINITIONS[0], ROW_DEFINITIONS[2]]; // Apply + Campaign

  for (const row of arrowRows) {
    for (let i = 0; i < row.screens.length - 1; i++) {
      const from = findFrame(row.screens[i]);
      const to = findFrame(row.screens[i + 1]);
      if (from && to) {
        const arrow = figma.createText();
        arrow.fontName = { family: 'Inter', style: 'Bold' };
        arrow.characters = '→';
        arrow.fontSize = 48;
        arrow.fills = [{ type: 'SOLID', color: arrowColor }];
        const midX = from.x + from.width + (to.x - from.x - from.width) / 2;
        arrow.x = midX - 15;
        arrow.y = from.y + Math.min(from.height, 600) / 2 - 24;
      }
    }
  }

  // ─── STEP 8: Rename page ──────────────────────────────────
  page.name = 'Creator Portal — All Screens';

  return `Done! Organized ${page.children.filter(c => c.type === 'FRAME').length} frames into ${ROW_DEFINITIONS.length} rows.`;
})();
