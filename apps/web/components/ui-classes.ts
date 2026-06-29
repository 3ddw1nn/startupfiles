export const ui = {
  surface:
    "rounded-[22px] border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] backdrop-blur-[22px] backdrop-saturate-[140%] [html[data-theme='dark']_&]:shadow-[0_18px_50px_rgba(2,6,23,0.28)]",
  eyebrow:
    "inline-flex items-center gap-[10px] rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel-strong)_78%,transparent)] px-[14px] py-2 text-[0.88rem] tracking-[0.02em] text-[var(--muted)] before:h-2 before:w-2 before:rounded-full before:bg-[var(--accent)] before:content-['']",
  buttonPrimary:
    "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[14px] border border-transparent bg-[linear-gradient(180deg,var(--accent),var(--accent-strong))] px-[18px] text-[#f8fbff] shadow-[0_12px_26px_rgba(185,106,42,0.26)] transition-all duration-200 hover:-translate-y-px",
  buttonSecondary:
    "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[14px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel-strong)_68%,transparent)] px-[18px] text-[var(--text)] transition-all duration-200 hover:-translate-y-px",
  kicker:
    "font-mono text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent-strong)]",
  factsTableWrap:
    "overflow-x-auto rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_82%,transparent)]",
  factsTable: "w-full min-w-[1080px] border-collapse",
  factsCell: "border-b border-[var(--border)] px-[18px] py-4 text-left align-top",
  factsHead:
    "sticky top-0 z-[1] bg-[color-mix(in_srgb,var(--panel)_94%,var(--bg))] text-[0.86rem] uppercase tracking-[0.08em]",
  factsRowHeader: "w-[180px] text-[0.9rem] leading-[1.4]",
  factsBodyCell: "leading-[1.65] text-[var(--muted)]",
  factsColumnHeader: "grid gap-1.5",
  factsColumnTitle: "text-[0.92rem] normal-case tracking-normal text-[var(--text)]",
  factsColumnBadge:
    "inline-flex min-h-6 w-fit items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-2.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-[var(--text)]",
  documentCard:
    "grid items-start gap-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel-strong)_80%,transparent)] px-5 py-[18px] md:grid-cols-[minmax(0,1fr)_auto]",
  infoCard:
    "grid items-start gap-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel-strong)_80%,transparent)] px-5 py-[18px]"
} as const;

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
