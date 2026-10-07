import React from "react";
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
        text: '🔹 Запрещено пользоваться всем, что упрощает процесс игры.',
        punishment: 'бан на 90 дней',
        note: 'Запрещено пользоваться любыми средствами, которые дают упрощение игрового процесса или преимущества в игре.'
      },
      {
        id: '3.3',
        text: 'Тим с читером',
        punishment: 'бан на 10 дней по IP',
      },
      {
        id: '3.4',
        text: 'Использование недоработок сервера/Дюпов/багов.',
        punishment: 'бан по айпи на 7 дней',
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

export const TOTAL_RULES = RULES_DATA.reduce((sum, section) => sum + section.rules.length, 0);
export const TOTAL_ALLOWED_MODS = Object.values(allowedMods).flat().length;
export const TOTAL_BANNED_MODS = Object.values(bannedMods).flat().length;
