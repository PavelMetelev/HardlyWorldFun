import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Flag,
  Info,
  Menu,
  MessageSquare,
  UserCheck,
  Search,
  ShieldAlert,
  Swords,
  X,
  Zap,
  Crown,
} from "lucide-react";

type Rule = {
  id: string;
  text: string;
  punishment: string;
  note?: string;
};

type Section = {
  title: string;
  icon: React.ReactNode;
  rules: Rule[];
};

const SERVER_NAME = "HardlyWorld";
const SERVER_MODE = "Анархия";
const SERVER_IP = "mc.HardlyWorld.fun";
const VK_URL = "https://vk.ru/hardly_world_anarchy";
const STORE_URL = "https://hardlyworld.fun/";

const RULES_DATA: Section[] = [
  {
    title: 'Правила Чата',
    icon: <MessageSquare className="w-6 h-6" />,
    rules: [
      {
        id: '2.1',
        text: 'Запрещён флуд/повторение сообщений, символов.',
        punishment: 'мут на 30 минут',
        note: 'За спам/флуд в локальный чат / глобальный / личные сообщения - сотрудник вправе выдать наказание. Продублированное сообщение более 3 раз с одинаковой смысловой нагрузкой. Флуд символами считается от 7 символов и выше.'
      },
      {
        id: '2.2',
        text: 'Запрещено использовать CAPS в более 50% своего сообщения.',
        punishment: 'мут на 30 минут',
        note: 'Относится к словам свыше 6-и символов, либо к предложениям, которые состоят из 2-х и более слов.'
      },
      {
        id: '2.3',
        text: 'Запрещена организация флуда.',
        punishment: 'мут на 30 минут',
      },
      {
        id: '2.4',
        text: 'Запрещено попрошайничество у игроков/модерации/администрации.',
        punishment: 'мут на 60 минут',
        note: 'Не стоит попрошайничать у кого-либо, Вы только засоряете им чат.'
      },
      {
        id: '2.5',
        text: 'Запрещены оскорбления/унижения к кому-либо в любой форме.',
        punishment: 'мут 60 минут',
        note: 'За оскорбление в локальный чат / глобальный / личные сообщения - сотрудник вправе выдать наказание. Завуалированные оскорбления также считаются нарушением; За слова: "Лёгкий, Ez, Нуб, 0, школьник" наказание не выдаётся.'
      },
      {
        id: '2.6',
        text: 'Запрещены оскорбления/унижения/упоминания родных.',
        punishment: 'мут на 180 минут',
        note: 'Оскорбление родных, считается как оскорбление в сторону игрока. Это крайне низкий поступок, за который игрока накажет администрация/модерация проекта.'
      },
      {
        id: '2.7',
        text: 'Запрещена пропаганда или агитация, возбуждающая социальную, расовую, национальную или религиозную ненависть и вражду.',
        punishment: 'мут на 120 минут',
        note: 'При повторе - Блокировка аккаунта на 1 день.'
      },
      {
        id: '2.8',
        text: 'Запрещено рекламировать соц.сети TWITCH/VK/YouTube и т.д , не имея статуса YT.',
        punishment: 'мут на 120 минут',
        note: 'При повторе - Блокировка аккаунта на 7 дней.'
      },
    ]
  },
  {
    title: 'Блокировка Аккаунта',
    icon: <Ban className="w-6 h-6" />,
    rules: [
      {
        id: '3.2',
        text: 'Использование/Хранение сторонних ПО: (Читов/Макросов/Модов, дающих преимущество в игре), Троллинг во время проверки, Выход во время проверки на читы, Отказ от проверки на читы, Оскорбления на проверке',
        punishment: 'бан на 30 дней по IP',
        note: 'Хранение, удаление менее 20-ти дней назад, использование запрещённых программ.'
      },
      {
        id: '3.2.1',
        text: 'Признание в запрещённом ПО',
        punishment: 'бан на 20 дней',
        note: 'Если вы пишите в глобал/локал/лс "я читер" и т.д, это расценивается как признание.'
      },
      {
        id: '3.2.2',
        text: 'Запрещено пользоваться всем, что упрощает процесс игры.',
        punishment: 'бан на 90 дней',
        note: 'Под действие пункта попадают любые программы, модификации и средства, которые упрощают игровой процесс или дают игроку дополнительное преимущество.'
      },
      {
        id: '3.3',
        text: 'Тим с читером',
        punishment: 'бан на 10 дней по IP',
      },
      {
        id: '3.4',
        text: 'Использование недоработок сервера/Дюпов/багов.',
        punishment: 'бан на 7 дней',
        note: 'Багоюз киркой также карается баном.'
      },
      {
        id: '3.5',
        text: 'Реклама сторонних проектов/Магазинов/ПО/Ютуберов',
        punishment: 'бан на 30 дней по IP',
        note: 'Скрытая, на табличках, на название мобов и так далее, будет является - рекламой.'
      },
      {
        id: '3.6',
        text: 'Оскорбление сервера',
        punishment: 'бан на 12 часов',
        note: 'Завуалированные оскорбления также считаются нарушением пункта.'
      },
      {
        id: '3.7',
        text: 'Попытка взлома аккаунта.',
        punishment: 'бан на 90 дней по IP',
        note: 'Попытка узнать пароль или иные данные для входа в аккаунт.'
      },
      {
        id: '3.8',
        text: 'Передача/Попытка передачи аккаунта 3-им лицам.',
        punishment: 'бан на 14 дней',
        note: 'Данное правило действует, если игрок зайдет с другого IP адреса, а не с одного устройства/IP.'
      },
      {
        id: '3.9',
        text: 'Операция с реальными деньгами',
        punishment: 'бан на 30 дней',
        note: 'Попытка/Продажа виртуальных рублей, вещей и других предметов.'
      },
      {
        id: '3.10',
        text: 'Запрещённы любые виды трапок',
        punishment: 'бан на 3 дня',
      },
      {
        id: '3.11',
        text: 'Постройка/использование/распространение уязвимостей сервера, независимо от их реализуемости и практичности.',
        punishment: 'бан навсегда по IP',
        note: 'Постройки данного типа считаются некорректными и требуют сноса.'
      },
      {
        id: '3.12',
        text: 'Постройка, не соответствующая нравственным нормам (флаги стран, свастики, половые органы и т.д).',
        punishment: ' бан 1 день',
        note: 'Постройки данного типа считаются некорректными и требуют сноса.'
      },
      {
        id: '3.13',
        text: 'Обход мута через /bc, /ad',
        punishment: 'бан на 6 часов',
        note: 'Запрещено писать в чат через /bc, /ad, когда на вас наложен мут'
      },
      {
        id: '3.13.1',
        text: 'Обход мута с помощью второго аккаунта',
        punishment: 'бан на 8 часов',
      },
    ]
  },
  {
    title: 'Правила Донатеров',
    icon: <Crown className="w-6 h-6" />,
    rules: [
      {
        id: '4.2',
        text: 'Выдача бана/мута без доказательств.',
        punishment: 'бан на 7 дней',
        note: 'Администратор в праве потребовать доказательства о муте/бане. При отсутствии доказательств выдается наказание.'
      },
      {
        id: '4.3',
        text: 'Выдача Бана/Мута с некорректной причиной.',
        punishment: 'бан на 7 дней',
        note: 'Каждое доказательство должно быть правильно оформлено. При выдачи Банов/Мутов, требуется указывать пункт или причину наказания.'
      },
      {
        id: '4.4',
        text: 'Запрещено использование команд не по назначению.',
        punishment: 'бан на 7 дней',
      },
    ]
  },
  {
    title: 'Администрация и Модерация',
    icon: <UserCheck className="w-6 h-6" />,
    rules: [
      {
        id: '5.1',
        text: 'Оскорбление/унижение администрации.',
        punishment: 'бан на 1 день',
        note: 'За любое оскорбление/унижение в локальный чат / глобальный / личные сообщения- Сотрудник вправе Вас заблокировать, если посчитает нужным. Завуалированные оскорбления так же считаются нарушением пункта.'
      },
      {
        id: '5.2',
        text: 'Ввод администрации в заблуждение.',
        punishment: 'бан на 5 дней',
        note: 'Даже при попытке обмана сотрудника в соц.сетях влечёт за собой наказание на сервере.'
      },
      {
        id: '5.3',
        text: 'Выдача себя за администрацию.',
        punishment: 'бан на 2 дня',
        note: 'Игрока могут привлечь за данный пункт, даже если игрок является сотрудником другого проекта.'
      },
      {
        id: '5.4',
        text: 'Любая помеха в работе администрации/модерации.',
        punishment: 'бан на 12 часов',
        note: 'Перед выдачей наказания сотрудник обязан предупредить Вас, к примеру покинуть территорию в которой введётся работа администрации/модерации. В случае, если Вы откажетесь покидать территорию или проигнорируете его, Вы будете привлечены к данному пункту наказания.'
      },
    ]
  },
];



const allowedMods = {
  "Кликеры, макросы и другие моды": [
    "TapeMouse",
    "AutoClanInvest",
    "AutoTrade",
    "AutoTransfer",
    "TopkaAutoDrop",
    "AutoDrop",
    "AutoEat",
    "MacroKeybinds",
  ],
  "Визуальные эффекты и клиенты": [
    "PulseVisuals",
    "TopkaVisuals",
    "CustomBlockOverlay",
    "TrajectoryGuard",
    "ViewModel-Changer",
    "RainVisuals",
    "Do a Barrel Roll",
    "MoonLightClient",
    "SoupApi (SoupVisuals)",
    "SoupBetter",
    "PhantomVisuals",
    "Mytheria",
    "KastrixVisuals",
    "RivalVisuals",
    "DestraVisuals",
    "ReallyVisuals",
    "GammaUtils",
    "Stark Helper",
  ],
  "Иные разрешённые моды": [
    "rct",
    "PRIME PARTS",
    "Chunks fade in",
    "berdinskiybear's armor hud",
    "AntiGhost",
    "TopkaTags",
    "ContainerSearcher",
    "ItemLocks",
    "Giselbaer's Durability Viewer",
    "MiniHUD",
    "TopkaHealth",
    "ExitLag",
    "Abstract",
    "Custom FOV",
    "Show Yourself",
    "Jade",
    "JJElytraSwap",
    "InventoryCleaner",
    "VisualRatio",
    "AxolotlClient",
    "ItemScroller",
    "NoHurtCam",
    "LavaClearWater",
    "BetterHitReg",
    "ZakoHealthIndicator",
    "Pearl Trajectory",
    "wWaypoints",
    "Feather Client",
  ],
};

const bannedMods = {
  "Моды для записи игры": [
    "ReplayMod",
    "IsometricRender",
    "CmdCam",
    "WorldDownloader",
    "Flashback",
  ],
  "Автодобыча и использование ресурсов": [
    "AutoMining",
    "ReplantingCrops",
    "AutoHarvest",
    "Reap",
    "Tweakeroo",
    "AutoFish",
    "Accurate Block Placement",
    "Baritone",
  ],
  "Подсветка игроков / мобов / блоков": [
    "Player Spotlight",
    "AucHelper",
    "ChestTracker",
    "Friend Highlighter",
    "Donut Auctions",
    "XRay",
    "DiamondGen",
    "FreeCam",
    "BaseFinder",
    "TrueSight",
    "МиниКарты (кроме Lunar Client)",
    "Neat",
    "ChunkAnimator",
    "MobHealthBar",
    "Litematica / Schematica",
    "block-entity-tooltip",
    "WorldEdit",
    "Better PVP",
    "WorldDownloader",
    "RemoveBlindness (и аналоги)",
    "Re:Entity Outline",
    "AntiInvis",
    "Cooldowns HUD (UseTracker)",
    "CheatUtils",
    "No Darkness Effect",
    "funtime-ah-helper",
  ],
  "Автоматизация функционала сервера": [
    "AutoBuy (и аналоги)",
    "AutoSell (и аналоги)",
    "AutoCasino",
    "AutoPilot",
  ],
  "Автоматизация ПВП и инвентаря": [
    "InventoryControlTweaks",
    "AutoLeave",
    "Foodslot",
    "Quickstack",
    "ItemSwap",
    "AutoTool",
    "Movement in GUI",
    "FasterBlockPlacement",
    "Firework Helper",
    "Effortless Building",
    "InvMove",
    "Inventory Profiles Next",
    "autojumpreset",
  ],
  "Изменение условий PvP": [
    "Dont Heat Teammates",
    "Don't hit teammates",
    "CleanCut",
    "AutoAttack",
    "AutoAim",
  ],
  "Иные запрещённые моды": [
    "FeverVisuals",
    "LuminarVisuals",
    "Ascart",
    "Badlion Client",
    "Эмуляторы / лаунчеры мобильных устройств (Pojav, FCL и т.п.)",
    "SimpleVisuals",
    "SoupApi (версии ниже 3.0.0)",
    "WaveVisuals",
    "ClientCommands",
    "Взломанные версии мультимодификаций",
    "Самостоятельно модифицированные мультимодификации",
  ],
};



const allowedIcons: Record<string, React.ReactNode> = {
  "Кликеры, макросы и другие моды": <Zap className="h-4 w-4" />,
  "Визуальные эффекты и клиенты": <Swords className="h-4 w-4" />,
  "Иные разрешённые моды": <Check className="h-4 w-4" />,
};
const bannedIcons: Record<string, React.ReactNode> = {
  "Моды для записи игры": <Flag className="h-4 w-4" />,
  "Автодобыча и использование ресурсов": <Swords className="h-4 w-4" />,
  "Подсветка игроков / мобов / блоков": <ShieldAlert className="h-4 w-4" />,
  "Автоматизация функционала сервера": <Zap className="h-4 w-4" />,
  "Автоматизация ПВП и инвентаря": <Crown className="h-4 w-4" />,
  "Изменение условий PvP": <Ban className="h-4 w-4" />,
  "Иные запрещённые моды": <X className="h-4 w-4" />,
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable in some embedded contexts.
    }
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
      {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Clipboard className="h-4 w-4 text-slate-400" />}
      {copied ? "Скопировано" : "Копировать IP"}
    </button>
  );
}

function RuleCard({ rule }: { rule: Rule }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.35 }}
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.045]"
    >
      <div className="flex gap-4">
        <span className="mt-0.5 inline-flex h-8 min-w-12 items-center justify-center rounded-lg border border-white/10 bg-black/20 px-2 font-mono text-xs font-bold text-slate-500">
          {rule.id}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base leading-7 text-slate-100 md:text-[17px]">{rule.text}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Наказание</span>
            <span className="rounded-full border border-red-400/15 bg-red-500/[0.07] px-2.5 py-1 text-sm font-bold text-red-300">
              {rule.punishment}
            </span>
          </div>
          {rule.note && (
            <div className="mt-4">
              <button onClick={() => setOpen(v => !v)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
                <Info className="h-4 w-4" />
                {open ? "Скрыть примечание" : "Показать примечание"}
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-6 text-slate-400">
                      {rule.note}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function RuleSection({ section }: { section: Section }) {
  return (
    <section className="scroll-mt-28">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Раздел
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/15 bg-red-500/[0.08] text-red-300">
              {section.icon}
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">{section.title}</h3>
          </div>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-500 md:inline-flex">
          {section.rules.length} пунктов
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {section.rules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
      </div>
    </section>
  );
}

function ModsSection() {
  const [tab, setTab] = useState<"all" | "allowed" | "banned">("all");
  const [search, setSearch] = useState("");
  const allowed = Object.entries(allowedMods);
  const banned = Object.entries(bannedMods);
  const filter = (items: [string, string[]][]) =>
    items.map(([category, mods]) => [category, mods.filter(m => m.toLowerCase().includes(search.toLowerCase()))] as [string, string[]])
      .filter(([, mods]) => mods.length);
  const filteredAllowed = filter(allowed);
  const filteredBanned = filter(banned);
  const totalAllowed = Object.values(allowedMods).flat().length;
  const totalBanned = Object.values(bannedMods).flat().length;

  return (
    <section id="mods" className="scroll-mt-28">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Проверка модификаций
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">Какие моды разрешены?</h2>
        <p className="mt-3 text-slate-400">Поиск по названию и быстрый просмотр категорий. Перед игрой сверяйтесь с актуальным списком.</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Найти мод..." className="w-full rounded-xl border border-white/[0.06] bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/15" />
        </div>
        <div className="flex gap-2 overflow-auto">
          {(["all", "allowed", "banned"] as const).map(value => (
            <button key={value} onClick={() => setTab(value)} className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-bold transition ${tab === value ? "border-white/15 bg-white/[0.09] text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
              {value === "all" ? `Все · ${totalAllowed + totalBanned}` : value === "allowed" ? `Разрешённые · ${totalAllowed}` : `Запрещённые · ${totalBanned}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {(tab === "all" || tab === "allowed") && (
          <ModColumn title="Разрешённые моды" items={filteredAllowed} type="allowed" icons={allowedIcons} />
        )}
        {(tab === "all" || tab === "banned") && (
          <ModColumn title="Запрещённые моды" items={filteredBanned} type="banned" icons={bannedIcons} />
        )}
      </div>
    </section>
  );
}

function ModColumn({ title, items, type, icons }: { title: string; items: [string, string[]][]; type: "allowed" | "banned"; icons: Record<string, React.ReactNode> }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const good = type === "allowed";
  return (
    <div className={`rounded-2xl border p-4 ${good ? "border-emerald-400/10 bg-emerald-500/[0.025]" : "border-red-400/10 bg-red-500/[0.025]"}`}>
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/[0.06] px-2 pb-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${good ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
            {good ? <Check className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
          </span>
          <div>
            <h3 className="font-black text-white">{title}</h3>
            <p className="text-xs text-slate-600">{good ? "Безопасный список" : "Под запретом"}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {items.length ? items.map(([category, mods]) => {
          const isOpen = open[category] ?? true;
          return (
            <div key={category} className={`rounded-xl border ${good ? "border-emerald-400/10 bg-emerald-500/[0.025]" : "border-red-400/10 bg-red-500/[0.025]"}`}>
              <button onClick={() => setOpen(v => ({ ...v, [category]: !isOpen }))} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="flex min-w-0 items-center gap-2">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${good ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>{icons[category]}</span>
                  <span className="truncate text-sm font-bold text-slate-200">{category}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black ${good ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>{mods.length}</span>
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-slate-600" /> : <ChevronDown className="h-4 w-4 text-slate-600" />}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex flex-wrap gap-2 border-t border-white/[0.05] px-4 py-4">
                      {mods.map(mod => <span key={mod} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${good ? "border-emerald-400/10 bg-emerald-500/[0.05] text-emerald-200" : "border-red-400/10 bg-red-500/[0.05] text-red-200"}`}>{mod}</span>)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }) : <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-600">Ничего не найдено</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const totalRules = useMemo(() => RULES_DATA.reduce((sum, section) => sum + section.rules.length, 0), []);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
    setActive(id);
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-22rem] h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-red-500/[0.06] blur-3xl" />
        <div className="absolute left-[-10rem] top-1/3 h-80 w-80 rounded-full bg-orange-500/[0.035] blur-3xl" />
        <div className="absolute right-[-8rem] bottom-0 h-96 w-96 rounded-full bg-emerald-500/[0.03] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.055]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-red-400/15 bg-red-500/[0.09]">
              <ShieldAlert className="h-5 w-5 text-red-300" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-black tracking-tight text-white">{SERVER_NAME}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{SERVER_MODE}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            <button key="home" onClick={() => scrollTo("home")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${active === "home" ? "bg-white/[0.06] text-white" : "text-slate-500 hover:text-white"}`}>
              Главная
            </button>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Открыть магазин HardlyWorld" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-white">
              Магазин
            </a>
            <button key="mods" onClick={() => scrollTo("mods")} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${active === "mods" ? "bg-white/[0.06] text-white" : "text-slate-500 hover:text-white"}`}>
              Моды
            </button>
            <button onClick={() => scrollTo("rules")} className={`ml-1 rounded-lg bg-white/[0.06] px-3 py-2 text-sm font-bold text-white transition hover:bg-white/[0.12] ${active === "rules" ? "ring-1 ring-white/10" : ""}`}>
              Правила
            </button>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <a href={VK_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">VK</a>
          </div>

          <button onClick={() => setMenuOpen(v => !v)} className="rounded-xl border border-white/10 p-2 text-slate-300 sm:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/[0.06] bg-[#07090d] px-4 py-3 sm:hidden">
              <button onClick={() => scrollTo("home")} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">Главная</button>
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Открыть магазин HardlyWorld" className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">
                Магазин
              </a>
              <button onClick={() => scrollTo("mods")} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">Моды</button>
              <button onClick={() => scrollTo("rules")} className="mt-1 block w-full rounded-lg bg-white/[0.06] px-3 py-3 text-left text-sm font-bold text-white hover:bg-white/[0.1]">
                Правила
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
        <section id="home" className="scroll-mt-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.17em] text-slate-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Официальный сайт проекта
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.05em] text-white md:text-7xl lg:text-8xl">
                {SERVER_NAME}
                <span className="block bg-gradient-to-r from-red-300 via-orange-200 to-white bg-clip-text text-transparent">{SERVER_MODE}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                Всё необходимое для игрока в одном месте: правила проекта, актуальный список разрешённых и запрещённых модификаций и быстрые ссылки на сообщество.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => scrollTo("rules")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-black transition hover:bg-slate-200">
                  Правила <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-md">
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">Server status</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/[0.06] px-2.5 py-1 text-xs font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Готов к подключению
                  </span>
                </div>
                <div className="mb-2 text-3xl font-black tracking-tight text-white">{SERVER_IP}</div>
                <div className="mb-5 text-sm text-slate-600">Minecraft · {SERVER_MODE}</div>
                <div className="flex flex-wrap gap-2">
                  <CopyButton value={SERVER_IP} />
                  <a href={STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Открыть магазин HardlyWorld" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">Магазин</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            {[
              ["01", `${totalRules} пунктов правил`, "Понятные наказания и примечания"],
              ["02", `${Object.values(allowedMods).flat().length} разрешённых модов`, "Проверенный список"],
              ["03", `${Object.values(bannedMods).flat().length} запрещённых модов`, "Актуальные ограничения"],
            ].map(([num, title, desc]) => (
              <div key={num} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="mb-4 font-mono text-xs font-bold text-red-300">{num}</div>
                <div className="font-black text-white">{title}</div>
                <div className="mt-1 text-sm text-slate-600">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <section id="rules" className="scroll-mt-28">
          <div className="mb-10 max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Регламент проекта
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">Правила сервера</h2>
            <p className="mt-3 text-slate-400">Ознакомьтесь с основными правилами до начала игры. Примечания раскрываются прямо внутри пункта.</p>
          </div>

          <div className="mb-10 rounded-2xl border border-red-400/10 bg-red-500/[0.035] p-5 text-sm leading-6 text-red-100/75">
            <div className="mb-1 font-black text-red-200">Важно</div>
            Данный свод правил может быть изменён в любой момент, и администрация оставляет за собой право не оповещать игроков об изменениях.
          </div>

          <div className="space-y-16">
            {RULES_DATA.map(section => <RuleSection key={section.title} section={section} />)}
          </div>
        </section>

        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <ModsSection />

        <div className="mt-14 rounded-2xl border border-amber-400/10 bg-amber-500/[0.035] p-5 text-sm leading-6 text-amber-100/70">
          <div className="mb-1 flex items-center gap-2 font-black text-amber-200"><ShieldAlert className="h-4 w-4" /> Актуальность</div>
          Статья может быть отредактирована администрацией без уведомления пользователей. Перед запуском клиента сверяйтесь с актуальным списком.
        </div>
      </main>

      <footer className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-6">
          <div>© {new Date().getFullYear()} {SERVER_NAME} — {SERVER_MODE}</div>
          <div className="flex flex-wrap gap-4">
            <a href={VK_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">VK</a>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Открыть магазин HardlyWorld" className="transition hover:text-white">Магазин</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
