/**
 * Figma Prototype Capture Script
 *
 * Run this via preview_eval to capture ALL screens automatically.
 * Prerequisites:
 *   1. Dev server running (preview_start)
 *   2. Capture script in index.html (already there)
 *   3. Generate capture IDs via generate_figma_design MCP tool
 *   4. window.__setCampaignStep and window.__setCreatorStatus exposed (already in CreatorContext)
 *
 * Usage in preview_eval:
 *   Pass an array of { captureId, screen } objects.
 *   The script navigates to each screen, waits, then fires the capture.
 */

// Screen definitions - each has a setup function and a name
const SCREENS = {
  // === ONBOARDING FLOW ===
  'apply-welcome': {
    label: 'Apply 0 — Welcome',
    setup: () => {
      window.__setCreatorStatus('not_applied');
      window.location.hash = '#/apply';
    },
  },
  'apply-personal-info': {
    label: 'Apply 1 — Personal Info',
    setup: () => {
      // Must be on apply page, click "Let's Get Started"
      window.__setCreatorStatus('not_applied');
      window.location.hash = '#/apply';
      return new Promise(r => setTimeout(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes("Let's Get Started"));
        if (btn) btn.click();
        r();
      }, 500));
    },
  },
  'apply-shipping': {
    label: 'Apply 2 — Shipping Address',
    setup: () => {
      window.__setCreatorStatus('not_applied');
      window.location.hash = '#/apply';
      return new Promise(r => setTimeout(() => {
        // Click through: Welcome → Personal Info → Shipping
        const click = (text) => {
          const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text);
          if (btn) btn.click();
        };
        click("Let's Get Started");
        setTimeout(() => { click('Next'); r(); }, 300);
      }, 500));
    },
  },
  'apply-social-stats': {
    label: 'Apply 3 — Social Stats',
    setup: () => {
      window.__setCreatorStatus('not_applied');
      window.location.hash = '#/apply';
      return new Promise(r => setTimeout(() => {
        const click = (text) => {
          const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text);
          if (btn) btn.click();
        };
        click("Let's Get Started");
        setTimeout(() => { click('Next'); setTimeout(() => { click('Next'); r(); }, 300); }, 300);
      }, 500));
    },
  },

  // === DASHBOARD STATES ===
  'dashboard-pending': {
    label: 'Dashboard — Application Under Review',
    setup: () => {
      window.__setCreatorStatus('pending');
      window.location.hash = '#/';
    },
  },
  'dashboard-not-accepted': {
    label: 'Dashboard — Application Not Accepted',
    setup: () => {
      window.__setCreatorStatus('not_accepted');
      window.location.hash = '#/';
    },
  },
  'dashboard-accepted': {
    label: 'Dashboard — Accepted (No Campaigns)',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'completed');
      window.location.hash = '#/';
    },
  },
  'dashboard-completed': {
    label: 'Dashboard — Campaign Completed',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'completed');
      window.location.hash = '#/';
    },
  },

  // === CAMPAIGN FLOW ===
  'campaign-interest-check': {
    label: 'Campaign 1 — Brief & Accept',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'interest_check');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
  'campaign-product-phase': {
    label: 'Campaign 2 — Choose Product',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'product_phase');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
  'campaign-order-placed': {
    label: 'Campaign 3a — Order Placed',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'order_placed');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
  'campaign-content-upload': {
    label: 'Campaign 3b — Content Upload',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'content_upload');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
  'campaign-content-review': {
    label: 'Campaign 3c — Content Review',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'content_review');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
  'campaign-content-approved': {
    label: 'Campaign 4 — Content Approved',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'content_approved');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
  'campaign-completed': {
    label: 'Campaign 5 — Completed',
    setup: () => {
      window.__setCreatorStatus('accepted');
      window.__setCampaignStep('campaign-1', 'completed');
      window.location.hash = '#/campaign/campaign-1';
    },
  },
};

/**
 * Capture a single screen.
 * Call via preview_eval:
 *   window.__captureScreen('campaign-interest-check', 'CAPTURE_ID_HERE')
 */
window.__captureScreen = async function(screenKey, captureId) {
  const screen = SCREENS[screenKey];
  if (!screen) return `Unknown screen: ${screenKey}`;

  await screen.setup();

  // Wait for React to render
  await new Promise(r => setTimeout(r, 1500));

  // Fire capture (don't await - it takes too long)
  setTimeout(() => {
    window.figma.captureForDesign({
      captureId,
      endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
      selector: 'body',
    });
  }, 0);

  return `Capturing ${screen.label}...`;
};

/**
 * Capture ALL screens sequentially.
 * Call via preview_eval:
 *   window.__captureAll({ 'campaign-interest-check': 'ID1', 'apply-welcome': 'ID2', ... })
 */
window.__captureAll = async function(captureMap) {
  const results = [];
  for (const [screenKey, captureId] of Object.entries(captureMap)) {
    const screen = SCREENS[screenKey];
    if (!screen) { results.push(`SKIP: ${screenKey}`); continue; }

    await screen.setup();
    await new Promise(r => setTimeout(r, 2000));

    window.figma.captureForDesign({
      captureId,
      endpoint: `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
      selector: 'body',
    });

    // Wait for capture to submit before moving to next
    await new Promise(r => setTimeout(r, 8000));
    results.push(`OK: ${screen.label}`);
  }
  return results;
};

// Export screen list for reference
window.__screenList = Object.entries(SCREENS).map(([key, s]) => `${key}: ${s.label}`);

console.log('[Figma Capture] Ready. Screens:', Object.keys(SCREENS).length);
console.log('[Figma Capture] Use window.__captureScreen(key, captureId) or window.__captureAll(map)');
console.log('[Figma Capture] Available screens:', window.__screenList);
