import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Clock3,
  Copy,
  Crown,
  ExternalLink,
  Flag,
  Info,
  Menu,
  MessageSquare,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  SlidersHorizontal,
  UserCheck,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import {
  ALLOWED_MODS,
  BANNED_MODS,
  RULES_DATA,
  SERVER_IP,
  SERVER_MODE,
  SERVER_VERSION,
  SERVER_NAME,
  STORE_URL,
  TOTAL_ALLOWED_MODS,
  TOTAL_BANNED_MODS,
  TOTAL_RULES,
  VK_URL,
  type Rule,
  type Section as RuleSectionType,
} from "./data";

type ServerStatus = {
  state: "loading" | "online" | "offline" | "error";
  players: number;
  maxPlayers: number;
  version: string;
  checkedAt?: Date;
};

const sectionIcons: Record<string, React.ReactNode> = {
  "Правила Чата": <MessageSquare className="h-5 w-5" />,
  "Блокировка Аккаунта": <Ban className="h-5 w-5" />,
  "Правила Донатеров": <Crown className="h-5 w-5" />,
  "Администрация и Модерация": <UserCheck className="h-5 w-5" />,
};



function sectionAnchor(title: string) {
  return "rule-section-" + title.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "");
}

function GettingStarted({ onNavigate }: { onNavigate: (id: string) => void }) {
  const steps = [
    ["01", "Скопируй IP", "Нажми «Копировать IP» и вставь адрес в список серверов."],
    ["02", "Выбери версию", "Используй Minecraft Java Edition 1.21.4."],
    ["03", "Зайди на сервер", "Добавь сервер и подключайся к HardlyWorld."],
    ["04", "Проверь правила", "Перед игрой быстро сверяй моды и регламент проекта."],
  ] as const;

  return (
    <section id="start" className="scroll-mt-28">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-300">Быстрый старт</div>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">Как начать играть</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Четыре шага от установки клиента до первого входа на сервер.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-400">
          <Server className="h-3.5 w-3.5" /> {SERVER_VERSION} · {SERVER_MODE}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([num, title, text], index) => (
          <div key={num} className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            {index < steps.length - 1 && (
              <div className="absolute right-[-13px] top-1/2 z-10 hidden h-px w-6 bg-white/[0.08] lg:block" aria-hidden="true" />
            )}
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-orange-300">{num}</span>
              <span className="h-2 w-2 rounded-full bg-orange-300/70" />
            </div>
            <h3 className="font-black text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">Адрес сервера</div>
          <div className="mt-1 break-all font-mono text-sm font-bold text-white">{SERVER_IP}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={SERVER_IP} label="Скопировать IP" />
          <button onClick={() => onNavigate("rules")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
            Правила <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => onNavigate("mods")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
            Моды <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

const modIcons: Record<string, React.ReactNode> = {
  "Кликеры, макросы и другие моды": <Zap className="h-4 w-4" />,
  "Визуальные эффекты и клиенты": <Wifi className="h-4 w-4" />,
  "Иные разрешённые моды": <Check className="h-4 w-4" />,
  "Моды для записи игры": <Flag className="h-4 w-4" />,
  "Автодобыча и использование ресурсов": <Zap className="h-4 w-4" />,
  "Подсветка игроков / мобов / блоков": <ShieldAlert className="h-4 w-4" />,
  "Автоматизация функционала сервера": <RefreshCw className="h-4 w-4" />,
  "Автоматизация ПВП и инвентаря": <Crown className="h-4 w-4" />,
  "Изменение условий PvP": <Ban className="h-4 w-4" />,
  "Иные запрещённые моды": <X className="h-4 w-4" />,
};

function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus>({
    state: "loading",
    players: 0,
    maxPlayers: 0,
    version: "—",
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(
          "https://api.mcsrvstat.us/3/" + encodeURIComponent(SERVER_IP),
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "User-Agent": "HardlyWorld/1.0",
            },
          },
        );

        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();

        setStatus({
          state: data.online ? "online" : "offline",
          players: data.players?.online ?? 0,
          maxPlayers: data.players?.max ?? 0,
          version: data.version ?? data.protocol?.name ?? "неизвестно",
          checkedAt: new Date(),
        });
      } catch {
        if (!controller.signal.aborted) {
          setStatus((current) => ({
            ...current,
            state: "error",
            checkedAt: new Date(),
          }));
        }
      }
    };

    load();
    return () => controller.abort();
  }, [tick]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 300000);
    return () => window.clearInterval(timer);
  }, []);

  return {
    ...status,
    refresh: () => setTick((value) => value + 1),
  };
}

function CopyButton({
  value,
  label = "Копировать IP",
  icon = <Clipboard className="h-4 w-4" />,
}: {
  value: string;
  label?: string;
  icon?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={copy}
      title={label}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-300" /> : icon}
      {copied ? "Скопировано" : label}
    </button>
  );
}

function ServerStatusCard() {
  const { state, players, maxPlayers, checkedAt, refresh } = useServerStatus();
  const label =
    state === "loading"
      ? "Проверяем…"
      : state === "online"
        ? "Онлайн"
        : state === "offline"
          ? "Оффлайн"
          : "Нет ответа";

  const tone =
    state === "online"
      ? "border-emerald-400/10 bg-emerald-500/[0.07] text-emerald-300"
      : state === "offline"
        ? "border-red-400/10 bg-red-500/[0.07] text-red-300"
        : "border-white/10 bg-white/[0.05] text-slate-300";

  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-3.5 shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Статус сервера
          </span>
          <span className={"inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold " + tone}>
            <span
              className={
                "h-1.5 w-1.5 rounded-full " +
                (state === "online"
                  ? "bg-emerald-400 animate-pulse"
                  : state === "offline"
                    ? "bg-red-400"
                    : "bg-slate-400")
              }
            />
            {label}
          </span>
        </div>

        <div className="mb-1 break-all font-mono text-2xl font-black tracking-tight text-white md:text-3xl">
          {SERVER_IP}
        </div>
        <div className="mb-5 text-sm text-slate-500">
          Minecraft Java · {SERVER_MODE}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              <Users className="h-3.5 w-3.5" /> Онлайн
            </div>
            <div className="text-lg font-black text-white">
              {state === "online" ? players + "/" + (maxPlayers || "∞") : "—"}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              <Server className="h-3.5 w-3.5" /> Версия
            </div>
            <div className="truncate text-lg font-black text-white">
              {SERVER_VERSION}
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 sm:col-span-1">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              <Clock3 className="h-3.5 w-3.5" /> Проверка
            </div>
            <div className="text-lg font-black text-white">
              {checkedAt
                ? checkedAt.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </div>
          </div>
        </div>

        {state === "error" && (
          <div className="mt-3 rounded-xl border border-amber-400/10 bg-amber-500/[0.035] p-3 text-xs leading-5 text-amber-100/70">
            Не удалось получить статус. Нажмите «Обновить» и повторите проверку.
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton value={SERVER_IP} />
          <button
            onClick={refresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
          >
            <RefreshCw className={"h-4 w-4 " + (state === "loading" ? "animate-spin" : "")} />
            Обновить
          </button>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Магазин
          </a>
        </div>

        <div className="mt-3 text-[10px] leading-4 text-slate-700">
          Данные могут отображаться с задержкой: внешний сервис кэширует результаты.
        </div>
      </div>
    </div>
  );
}

function RuleHighlight({ text, query }: { text: string; query: string }) {
  const clean = query.trim();
  if (!clean) return <>{text}</>;

  const escaped = clean.replace(/[.*+?^|(){}[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp("(" + escaped + ")", "ig"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === clean.toLowerCase() ? (
          <mark key={index} className="rounded bg-amber-300/25 px-0.5 text-amber-100">
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function RuleCard({
  rule,
  openCommand,
  query,
}: {
  rule: Rule;
  openCommand: "open" | "closed" | "none";
  query: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openCommand === "open") setOpen(true);
    if (openCommand === "closed") setOpen(false);
  }, [openCommand]);

  return (
    <motion.article
      id={"rule-" + rule.id.replaceAll(".", "-")}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.28 }}
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.045]"
    >
      <div className="flex gap-3.5">
        <span className="mt-0.5 inline-flex h-8 min-w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20 px-2 font-mono text-xs font-bold text-slate-500">
          {rule.id}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-7 text-slate-100 md:text-[17px]">
            <RuleHighlight text={rule.text} query={query} />
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <Clock3 className="h-3.5 w-3.5" /> Наказание
            </span>
            <span className="rounded-full border border-red-400/15 bg-red-500/[0.07] px-2.5 py-1 text-sm font-bold text-red-300">
              <RuleHighlight text={rule.punishment} query={query} />
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {rule.note && (
              <button
                onClick={() => setOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <Info className="h-4 w-4" />
                {open ? "Скрыть примечание" : "Показать примечание"}
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}

          </div>

          {rule.note && (
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-6 text-slate-400">
                    <RuleHighlight text={rule.note} query={query} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function RuleSection({
  section,
  rules,
  openCommand,
  query,
}: {
  section: RuleSectionType;
  rules: Rule[];
  openCommand: "open" | "closed" | "none";
  query: string;
}) {
  if (!rules.length) return null;

  return (
    <section id={sectionAnchor(section.title)} className="scroll-mt-28">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Раздел
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-500/[0.08] text-red-300">
              {sectionIcons[section.title]}
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              {section.title}
            </h3>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-500">
          {rules.length} из {section.rules.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} openCommand={openCommand} query={query} />
        ))}
      </div>
    </section>
  );
}

function RulesExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "mute" | "ban" | "forever">("all");
  const [openCommand, setOpenCommand] = useState<"open" | "closed" | "none">("none");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      RULES_DATA.map((section) => ({
        section,
        rules: section.rules.filter((rule) => {
          const haystack = (
            rule.id +
            " " +
            rule.text +
            " " +
            rule.punishment +
            " " +
            (rule.note ?? "")
          ).toLowerCase();

          const queryMatch = !normalized || haystack.includes(normalized);
          const punishment = rule.punishment.toLowerCase();
          const punishmentMatch =
            filter === "all" ||
            (filter === "mute" && punishment.includes("мут")) ||
            (filter === "ban" && punishment.includes("бан") && !punishment.includes("навсегда")) ||
            (filter === "forever" && punishment.includes("навсегда"));

          return queryMatch && punishmentMatch;
        }),
      })).filter((entry) => entry.rules.length),
    [normalized, filter],
  );

  const visibleCount = filtered.reduce((sum, entry) => sum + entry.rules.length, 0);

  useEffect(() => {
    const hash = window.location.hash.match(/^#rule-(.+)$/);
    if (!hash) return;
    window.setTimeout(() => {
      document.getElementById("rule-" + hash[1])?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  }, []);

  return (
    <section id="rules" className="scroll-mt-28">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-red-300">
          <BookOpen className="h-3.5 w-3.5" /> Регламент проекта
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">Правила сервера</h2>
        <p className="mt-3 text-slate-400">
          Поиск по номеру и тексту, фильтр по наказанию и персональная ссылка на каждый пункт.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 backdrop-blur-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              aria-label="Поиск по правилам"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти правило: чит, бан, реклама, 3.5…"
              className="w-full rounded-xl border border-white/[0.06] bg-black/20 py-3 pl-11 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/20 focus:ring-2 focus:ring-white/[0.05]"
            />
            {query && (
              <button
                aria-label="Очистить поиск"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-600 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {(
              [
                ["all", "Все"],
                ["mute", "Муты"],
                ["ban", "Баны"],
                ["forever", "Навсегда"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={
                  "whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-sm font-bold transition " +
                  (filter === value
                    ? "border-white/15 bg-white/[0.08] text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] pt-3 text-xs text-slate-600">
          <span>
            <strong className="text-slate-300">{visibleCount}</strong> из {TOTAL_RULES} пунктов
          </span>
          <button
            onClick={() => setOpenCommand((value) => (value === "open" ? "closed" : "open"))}
            className="inline-flex items-center gap-2 font-semibold text-slate-400 hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {openCommand === "open" ? "Свернуть примечания" : "Открыть примечания"}
          </button>
        </div>
      </div>

      <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-red-400/10 bg-red-500/[0.035] p-5 text-sm leading-6 text-red-100/75 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 font-black text-red-200">
            <AlertTriangle className="h-4 w-4" /> Важно
          </div>
          Данный свод правил может быть изменён в любой момент, и администрация оставляет за собой право не оповещать игроков об изменениях.
        </div>
        <button
          onClick={() => setOpenCommand("open")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white"
        >
          Открыть примечания
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
          <BookOpen className="h-3.5 w-3.5" /> Оглавление
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {RULES_DATA.map((section) => (
            <button
              key={section.title}
              onClick={() =>
                document
                  .getElementById(sectionAnchor(section.title))
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-400/10 bg-red-500/[0.06] text-red-300">
                {sectionIcons[section.title]}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-200">{section.title}</span>
                <span className="block text-[11px] text-slate-600">{section.rules.length} пунктов</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-orange-400/10 bg-orange-500/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
          <div>
            <div className="text-sm font-black text-orange-100">Сайт обновлён 7 октября 2026</div>
            <div className="mt-0.5 text-xs leading-5 text-slate-500">
              Интерфейс, навигация и проверка сервера обновлены. Сам регламент может меняться администрацией.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">Разделы</div>
            <div className="space-y-1">
              {RULES_DATA.map((section) => (
                <button
                  key={section.title}
                  onClick={() =>
                    document
                      .getElementById(sectionAnchor(section.title))
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                  <span className="min-w-0 truncate">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {filtered.length ? (
            <div className="space-y-16">
              {filtered.map(({ section, rules }) => (
                <RuleSection
                  key={section.title}
                  section={section}
                  rules={rules}
                  openCommand={openCommand}
                  query={query}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <Search className="mx-auto mb-3 h-7 w-7 text-slate-700" />
              <div className="font-black text-white">Ничего не найдено</div>
              <p className="mt-1 text-sm text-slate-600">
                Попробуйте другой запрос или снимите фильтр наказания.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ModsExplorer() {
  const [tab, setTab] = useState<"all" | "allowed" | "banned">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const normalized = query.trim().toLowerCase();

  const entries = [
    ...Object.entries(ALLOWED_MODS).map(([category, mods]) => ({
      category,
      mods,
      type: "allowed" as const,
    })),
    ...Object.entries(BANNED_MODS).map(([category, mods]) => ({
      category,
      mods,
      type: "banned" as const,
    })),
  ];

  const filtered = entries
    .filter((item) => tab === "all" || item.type === tab)
    .map((item) => ({
      ...item,
      mods: item.mods.filter((mod) => mod.toLowerCase().includes(normalized)),
    }))
    .filter((item) => item.mods.length);

  const exact = useMemo(() => {
    if (!normalized) return null;

    const allowed = Object.values(ALLOWED_MODS)
      .flat()
      .find((mod) => mod.toLowerCase() === normalized);

    if (allowed) return { name: allowed, allowed: true };

    const banned = Object.values(BANNED_MODS)
      .flat()
      .find((mod) => mod.toLowerCase() === normalized);

    return banned ? { name: banned, allowed: false } : null;
  }, [normalized]);

  const copyList = async () => {
    const lines = filtered.flatMap((item) =>
      item.mods.map((mod) => (item.type === "allowed" ? "✅ " : "❌ ") + mod),
    );
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {}
  };

  const renderColumn = (
    title: string,
    items: typeof filtered,
    good: boolean,
  ) => {
    const categories = items.map((item) => item.category);

    return (
      <div
        className={
          "rounded-2xl border p-4 " +
          (good
            ? "border-emerald-400/10 bg-emerald-500/[0.025]"
            : "border-red-400/10 bg-red-500/[0.025]")
        }
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/[0.06] px-2 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={
                "flex h-10 w-10 items-center justify-center rounded-xl " +
                (good
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-red-500/10 text-red-300")
              }
            >
              {good ? <Check className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
            </span>
            <div>
              <h3 className="font-black text-white">{title}</h3>
              <p className="text-xs text-slate-600">
                {good ? TOTAL_ALLOWED_MODS : TOTAL_BANNED_MODS} в списке
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {items.length ? (
            items.map(({ category, mods }) => {
              const isOpen = open[category] ?? true;

              return (
                <div
                  key={category}
                  className={
                    "rounded-xl border " +
                    (good
                      ? "border-emerald-400/10 bg-emerald-500/[0.025]"
                      : "border-red-400/10 bg-red-500/[0.025]")
                  }
                >
                  <button
                    onClick={() =>
                      setOpen((current) => ({
                        ...current,
                        [category]: !isOpen,
                      }))
                    }
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                          (good
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-red-500/10 text-red-300")
                        }
                      >
                        {modIcons[category]}
                      </span>
                      <span className="truncate text-sm font-bold text-slate-200">
                        {category}
                      </span>
                      <span
                        className={
                          "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black " +
                          (good
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-red-500/10 text-red-300")
                        }
                      >
                        {mods.length}
                      </span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-600" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 border-t border-white/[0.05] px-4 py-4">
                          {mods.map((mod) => (
                            <span
                              key={mod}
                              className={
                                "rounded-lg border px-2.5 py-1.5 text-xs font-semibold " +
                                (good
                                  ? "border-emerald-400/10 bg-emerald-500/[0.05] text-emerald-200"
                                  : "border-red-400/10 bg-red-500/[0.05] text-red-200")
                              }
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-600">
              Ничего не найдено
            </div>
          )}
        </div>

        {categories.length > 0 && (
          <button
            onClick={() => {
              const shouldOpen = categories.some((category) => !(open[category] ?? true));
              setOpen((current) => ({
                ...current,
                ...Object.fromEntries(categories.map((category) => [category, shouldOpen])),
              }));
            }}
            className="mt-4 text-xs font-bold text-slate-500 hover:text-white"
          >
            {categories.some((category) => !(open[category] ?? true))
              ? "Раскрыть категории"
              : "Свернуть категории"}
          </button>
        )}
      </div>
    );
  };

  return (
    <section id="mods" className="scroll-mt-28">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
          <Zap className="h-3.5 w-3.5" /> Проверка модификаций
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
          Какие моды разрешены?
        </h2>
        <p className="mt-3 text-slate-400">
          Ищите мод по названию и сразу увидите его статус. Список можно скопировать целиком.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти мод: XRay, Baritone, Jade…"
              className="w-full rounded-xl border border-white/[0.06] bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {(
              [
                ["all", "Все · " + (TOTAL_ALLOWED_MODS + TOTAL_BANNED_MODS)],
                ["allowed", "Разрешённые · " + TOTAL_ALLOWED_MODS],
                ["banned", "Запрещённые · " + TOTAL_BANNED_MODS],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={
                  "whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-bold transition " +
                  (tab === value
                    ? "border-white/15 bg-white/[0.09] text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] pt-3 text-xs text-slate-600">
          <span>
            <strong className="text-slate-300">
              {filtered.reduce((sum, item) => sum + item.mods.length, 0)}
            </strong>{" "}
            совпадений
          </span>
          <button
            onClick={copyList}
            className="inline-flex items-center gap-2 font-semibold text-slate-400 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" /> Копировать список
          </button>
        </div>
      </div>

      {exact && (
        <div
          className={
            "mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 " +
            (exact.allowed
              ? "border-emerald-400/10 bg-emerald-500/[0.04]"
              : "border-red-400/10 bg-red-500/[0.04]")
          }
        >
          <div className="flex items-center gap-3">
            <div
              className={
                "flex h-10 w-10 items-center justify-center rounded-xl " +
                (exact.allowed
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-red-500/10 text-red-300")
              }
            >
              {exact.allowed ? (
                <Check className="h-5 w-5" />
              ) : (
                <Ban className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Точный результат
              </div>
              <div className="font-black text-white">{exact.name}</div>
            </div>
          </div>

          <div
            className={
              "rounded-full px-3 py-1 text-xs font-black " +
              (exact.allowed
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-red-500/10 text-red-300")
            }
          >
            {exact.allowed ? "✅ Разрешён" : "❌ Запрещён"}
          </div>
        </div>
      )}


      {query.trim() && !exact && filtered.length === 0 && (
        <div className="mb-5 rounded-2xl border border-amber-400/10 bg-amber-500/[0.04] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-white">Мод не найден в официальном списке</div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                «{query}» не найден среди разрешённых или запрещённых модов. Это не означает, что он разрешён — уточни статус у администрации проекта.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {(tab === "all" || tab === "allowed") &&
          renderColumn(
            "Разрешённые моды",
            filtered.filter((item) => item.type === "allowed"),
            true,
          )}
        {(tab === "all" || tab === "banned") &&
          renderColumn(
            "Запрещённые моды",
            filtered.filter((item) => item.type === "banned"),
            false,
          )}
      </div>

      <div className="mt-4 rounded-xl border border-amber-400/10 bg-amber-500/[0.035] p-4 text-xs leading-5 text-amber-100/65">
        <span className="font-bold text-amber-200">Важно:</span> перед игрой сверяйтесь с актуальным списком. Наличие похожего мода не означает автоматически, что разрешены все его версии.
      </div>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActive(visible.target.id);
      },
      {
        rootMargin: "-18% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    ["home", "rules", "mods"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMenuOpen(false);
  };

  const stats = [
    [TOTAL_RULES, "пунктов правил", "Поиск, фильтры и ссылки на каждый пункт", BookOpen],
    [TOTAL_ALLOWED_MODS, "разрешённых модов", "Быстрый поиск по списку", Check],
    [TOTAL_BANNED_MODS, "запрещённых модов", "Категории и точный статус", Ban],
  ] as const;

  return (
    <div
      className="relative min-h-screen bg-[#07090d] text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(5, 8, 13, 0.42), rgba(5, 8, 13, 0.48)), url('/hardlyworld-bg.jpg')",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3" aria-label="На главную">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/15 bg-red-500/[0.09]">
              <ShieldAlert className="h-5 w-5 text-red-300" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-black tracking-tight text-white">{SERVER_NAME}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{SERVER_MODE}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
            {[
              ["home", "Главная"],
              ["start", "Как играть"],
              ["rules", "Правила"],
              ["mods", "Моды"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={
                  "rounded-lg px-3 py-2 text-sm font-semibold transition " +
                  (active === id
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-500 hover:text-white")
                }
              >
                {label}
              </button>
            ))}
            <a
              href={STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-white"
            >
              Магазин
            </a>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={VK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              VK <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-xl border border-white/10 p-2 text-slate-300 sm:hidden"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/[0.06] bg-[#07090d] px-4 py-3 sm:hidden"
            >
              {[["home", "Главная"], ["start", "Как играть"], ["rules", "Правила"], ["mods", "Моды"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"
                >
                  {label}
                </button>
              ))}
              <a
                href={STORE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"
              >
                Магазин
              </a>
              <a
                href={VK_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"
              >
                VK
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
        <section id="home" className="scroll-mt-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Официальный сайт проекта
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.05em] text-white md:text-7xl lg:text-8xl">
                {SERVER_NAME}
                <span className="block bg-gradient-to-r from-red-300 via-orange-200 to-white bg-clip-text text-transparent">
                  {SERVER_MODE}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                Анархический Minecraft-проект с понятными правилами, быстрым поиском модов и живым статусом сервера. Всё нужное для входа и игры — в одном месте.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CopyButton value={SERVER_IP} label="Скопировать IP" />
                <button
                  onClick={() => scrollTo("start")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  Как начать играть <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  onClick={() => scrollTo("mods")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-bold text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                >
                  Проверить моды
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs font-bold text-slate-400">
                  <Server className="h-3.5 w-3.5" /> {SERVER_IP}
                </span>
                <span className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs font-bold text-slate-400">
                  Minecraft Java · {SERVER_VERSION}
                </span>
              </div>
            </div>

            <ServerStatusCard />
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {stats.map(([value, title, desc, Icon], index) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-red-300">
                    0{index + 1}
                  </span>
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="mt-0.5 font-bold text-slate-300">{title}</div>
                <div className="mt-1 text-sm text-slate-600">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <GettingStarted onNavigate={scrollTo} />
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <RulesExplorer />
        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <ModsExplorer />

        <div className="mt-14 rounded-2xl border border-amber-400/10 bg-amber-500/[0.035] p-5 text-sm leading-6 text-amber-100/70">
          <div className="mb-1 flex items-center gap-2 font-black text-amber-200">
            <ShieldAlert className="h-4 w-4" /> Актуальность
          </div>
          Статья может быть отредактирована администрацией без уведомления пользователей. Перед запуском клиента сверяйтесь с актуальным списком.
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            © {new Date().getFullYear()} {SERVER_NAME} — {SERVER_MODE}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <CopyButton value={SERVER_IP} label="IP сервера" icon={<Server className="h-4 w-4" />} />
            <a href={VK_URL} target="_blank" rel="noreferrer" className="transition hover:text-white">
              VK
            </a>
            <a href={STORE_URL} target="_blank" rel="noreferrer" className="transition hover:text-white">
              Магазин
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => scrollTo("home")}
            className="fixed bottom-5 right-5 z-40 rounded-xl border border-white/10 bg-[#0b0e13]/90 p-3 text-slate-300 shadow-xl backdrop-blur-md transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Наверх"
            title="Наверх"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
