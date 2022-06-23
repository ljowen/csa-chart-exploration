const _fromAlpha =
  ([r, g, b]) =>
  (alpha) =>
    `rgba(${r},${g},${b},${alpha})`;

export const PALETTE = {
  red: _fromAlpha([255, 0, 41]),
  orange: _fromAlpha([255, 127, 0]),
  blue: _fromAlpha([55, 126, 184]),
};
