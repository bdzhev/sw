/**
 * Rejects C0/C1 control characters — newlines and tabs in practice. Only
 * `\p{Cc}`, not `\p{C}`: `\p{Cf}` would take ZWNJ (U+200C) with it, which
 * Persian and Arabic need.
 */
export const NO_CONTROL_CHARS = /^\P{Cc}+$/u;
