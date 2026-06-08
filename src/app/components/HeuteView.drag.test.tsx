import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { render } from '@testing-library/react';
import HeuteView from './HeuteView';

// ── Handle geometry ───────────────────────────────────────────────────────────
//
// workStart='09:00' → wStartH=9.  We fix the clock to 08:00 (pre-shift) so
// scrubbingHour=9 and currentHour=9, giving a deterministic handle position.
//
// hourToAngle(9) = (9 % 12) * 30 = 270°
// polar(R=120, 270°): rad = (270-90)*π/180 = π
//   x = 170 + 120·cos(π) = 170 − 120 = 50
//   y = 170 + 120·sin(π) = 170 + 0   = 170
//
// Handle SVG coordinates: (50, 170).
// Mock renders SVG at 340×340 → scale 1:1 → clientX/Y === SVG coords.
//
// Useful test points (distance from (50, 170)):
//   (85,  170) →  35 px  — inside mouse threshold (50)     ✓ drag starts
//   (120, 170) →  70 px  — outside mouse (50), on touch boundary → borderline; use 60 to be safe
//   (110, 170) →  60 px  — outside mouse (50), inside touch (70) ✓ touch drag starts
//   (125, 170) →  75 px  — outside both thresholds           ✗ drag blocked
//   (170, 170) → 120 px  — dead center                       ✗ drag blocked

const HANDLE = { x: 50, y: 170 } as const;

function pt(x: number, y: number, type = 'pointer', eventType = 'pointerdown') {
  return new PointerEvent(eventType, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: type,
  });
}

const defaultProps = {
  onNavigate: vi.fn(),
  activeLocation: 'Berlin',
  workStart: '09:00',
  workEnd: '18:00',
  schwere: 'mittel',
  bekleidung: 'leicht',
  onOpenSettings: vi.fn(),
};

/**
 * jsdom has no real SVG geometry. Patch getBoundingClientRect and viewBox so
 * the coordinate-space math in HeuteView produces predictable results.
 * Scale 1:1 (340px SVG rendered at 340px) means clientX/Y === SVG coords.
 */
function mockSvgGeometry(svg: SVGSVGElement) {
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0, top: 0, width: 340, height: 340,
    right: 340, bottom: 340, x: 0, y: 0,
    toJSON: () => ({}),
  } as DOMRect);

  Object.defineProperty(svg, 'viewBox', {
    configurable: true,
    value: { baseVal: { x: 0, y: 0, width: 340, height: 340 } },
  });

  svg.setPointerCapture = vi.fn();
  svg.releasePointerCapture = vi.fn();
}

// ── Suite 1: touch-action: none ───────────────────────────────────────────────
// Without this the browser claims the touch as pull-to-refresh before JS runs.

describe('HeuteView clock SVG — touch-action', () => {
  it('has touch-action: none to prevent pull-to-refresh on drag', () => {
    render(<HeuteView {...defaultProps} />);
    const svgs = document.querySelectorAll('svg.select-none');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach(svg => {
      expect((svg as HTMLElement).style.touchAction).toBe('none');
    });
  });
});

// ── Suite 2: hit-test radius ──────────────────────────────────────────────────

describe('HeuteView clock SVG — hit-test radius', () => {
  let svg: SVGSVGElement;

  beforeAll(() => {
    // Fix real time to 08:00 so handle is deterministically at 09:00 position (50, 170)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-08T08:00:00'));
  });

  afterAll(() => vi.useRealTimers());

  beforeEach(() => {
    render(<HeuteView {...defaultProps} />);
    svg = document.querySelector('svg.select-none') as SVGSVGElement;
    mockSvgGeometry(svg);
  });

  afterEach(() => vi.restoreAllMocks());

  it('starts drag when mouse is within 50 SVG units of handle', () => {
    // (85, 170) → 35 px from handle (50, 170) — inside mouse threshold
    svg.dispatchEvent(pt(HANDLE.x + 35, HANDLE.y, 'mouse'));
    expect(svg.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('does NOT start drag when mouse is >50 SVG units away', () => {
    // (170, 170) → 120 px — well outside mouse threshold
    svg.dispatchEvent(pt(170, 170, 'mouse'));
    expect(svg.setPointerCapture).not.toHaveBeenCalled();
  });

  it('starts drag for touch within 70 SVG units (wider finger target)', () => {
    // (110, 170) → 60 px — outside mouse (50), inside touch (70)
    svg.dispatchEvent(pt(HANDLE.x + 60, HANDLE.y, 'touch'));
    expect(svg.setPointerCapture).toHaveBeenCalledWith(1);
  });

  it('does NOT start drag for touch >70 SVG units away', () => {
    // (125, 170) → 75 px — outside both thresholds
    svg.dispatchEvent(pt(HANDLE.x + 75, HANDLE.y, 'touch'));
    expect(svg.setPointerCapture).not.toHaveBeenCalled();
  });
});

// ── Suite 3: pointer lifecycle ────────────────────────────────────────────────

describe('HeuteView clock SVG — pointer lifecycle', () => {
  let svg: SVGSVGElement;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-08T08:00:00'));
  });

  afterAll(() => vi.useRealTimers());

  beforeEach(() => {
    render(<HeuteView {...defaultProps} />);
    svg = document.querySelector('svg.select-none') as SVGSVGElement;
    mockSvgGeometry(svg);
  });

  afterEach(() => vi.restoreAllMocks());

  it('releases pointer capture on pointerup', () => {
    svg.dispatchEvent(pt(HANDLE.x + 35, HANDLE.y, 'mouse', 'pointerdown'));
    svg.dispatchEvent(pt(HANDLE.x + 35, HANDLE.y, 'mouse', 'pointerup'));
    expect(svg.releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('releases pointer capture on pointercancel (iOS scroll interruption)', () => {
    svg.dispatchEvent(pt(HANDLE.x + 35, HANDLE.y, 'mouse', 'pointerdown'));
    svg.dispatchEvent(pt(HANDLE.x + 35, HANDLE.y, 'mouse', 'pointercancel'));
    expect(svg.releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('does not throw on pointermove before drag starts', () => {
    expect(() => {
      svg.dispatchEvent(pt(200, 100, 'mouse', 'pointermove'));
    }).not.toThrow();
    expect(svg.setPointerCapture).not.toHaveBeenCalled();
  });
});
