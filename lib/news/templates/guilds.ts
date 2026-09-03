import { defineTemplates } from "./shared";

export const guildTemplates = defineTemplates("guilds", [
  {
    id: "guild-accord", title: "{{organization}} Reaches Accord", dramaticTitle: "Guild Ultimatum Could Empty {{location}}", kicker: "Labor & Guilds",
    dek: "A late agreement may avert shortages of {{good}} before marketday.", illustrationId: "guild-hammer",
    paragraphs: ["Negotiators emerged before dawn with a compact covering apprentices, night rates and enchanted tools.", "Journeymen return after first bell, though stockpiles of {{good}} remain thin. Merchants were asked not to raise prices.", "Two chapters may still reject the pact unless meal allowances include food recognizably from this plane."],
  },
  {
    id: "guild-apprentice-trial", title: "Apprentices Face the {{color|title}} Hammer Trial", dramaticTitle: "Only {{number:3-12}} Survive Guild's Final Test Unsinged", kicker: "Workshop Notes",
    dek: "This year's candidates must complete a masterwork before the {{bell}}.", illustrationId: "guild-hammer",
    paragraphs: ["{{number:12-40}} apprentices entered the guildhall carrying raw iron, charcoal and sealed instructions.", "Master {{person}} said the trial rewards judgment over speed. Spontaneous singing by finished tools will count against the maker.", "The public exhibition opens {{weekday}}, once the hotter entries can be moved safely."],
  },
  {
    id: "guild-weavers", title: "Weavers Unveil Cloth That Never Fades", dramaticTitle: "Miracle Cloth Threatens {{location}} Dye Houses", kicker: "Tradecraft",
    dek: "A new {{color}} fabric holds its color through fire, frost and one minor curse.", illustrationId: "weavers-loom",
    paragraphs: ["The Weavers' Hall displayed forty bolts of enchanted cloth produced from ordinary wool and a guarded finishing process.", "Dyers called the invention impressive but warned it may erase {{number:20-80}} jobs. The inventors deny using bound spirits.", "Samples go on sale at {{street}} after independent testing by {{organization}}."],
  },
  {
    id: "guild-masons", title: "Masons Complete {{location}} Arch Ahead of Schedule", dramaticTitle: "Impossible Arch Stands Without Mortar", kicker: "Builders' Ledger",
    dek: "The span opens {{weekday}} after a final inspection for structural magic.", illustrationId: "masons-tools",
    paragraphs: ["Stoneworkers set the final block yesterday over the {{direction}} canal, completing the arch {{number:2-8}} days early.", "Foreman {{person}} credits careful cutting and a song known only to senior masons. The guild denies the stones are floating.", "Carts under three tons may cross first. Ogres must use the lower ford."],
  },
  {
    id: "guild-bakers", title: "Bakers Ration Flour After Mill Trouble", dramaticTitle: "Bread Lines Loom Across {{location}}", kicker: "Guild Kitchens",
    dek: "A jammed millstone and missing grain barge squeeze the city's ovens.", illustrationId: "bakers-oven",
    paragraphs: ["The Bakers' Fellowship set a temporary limit of {{number:2-6}} loaves per household after deliveries failed.", "Master Baker {{person}} promised no one will go without basic bread. Honey twists and resurrection cakes are not considered basic.", "The ration ends when the {{direction}} mill resumes or the grain barge reaches the quay."],
  },
  {
    id: "guild-dockers", title: "Dock Crane Falls Without Injury", dramaticTitle: "Timber Giant Crashes Across {{location}} Quay", kicker: "At the Docks",
    dek: "A cargo of {{good}} is lost, but every stevedore walks away.", illustrationId: "dock-crane",
    paragraphs: ["The old crane at Berth {{number:2-18}} split at the main spar while lifting {{number:10-60}} barrels of {{good}}.", "Dockmaster {{person}} praised a warning shout from a nearby gull. The bird has been offered honorary union membership.", "The berth remains closed pending inspection. Incoming cargo shifts to the {{direction}} quay."],
  },
  {
    id: "guild-election", title: "{{profession|title}} Guild Elects New Master", dramaticTitle: "Upset Vote Topples Old Guard at Guildhall", kicker: "Guild Politics",
    dek: "{{person}} wins on a platform of open ledgers and shorter banquets.", illustrationId: "weavers-loom",
    paragraphs: ["Guild members chose {{person}} over incumbent {{person2}} after three ballots and one recount by abacus.", "The new master promised fair apprentice placements and an audit of ceremonial robe expenses.", "Installation takes place {{weekday}}. The losing slate has requested the ballot chest be checked for enchantment."],
  },
  {
    id: "guild-seal", title: "False Guild Seals Found on {{good|title}}", dramaticTitle: "Counterfeit Marks Flood {{location}} Market", kicker: "Quality & Craft",
    dek: "Inspectors seize {{number:20-90}} suspect goods bearing a copied maker's mark.", illustrationId: "masons-tools",
    paragraphs: ["Guild wardens confiscated shipments at {{street}} after a journeyman noticed the certification rune was backward.", "The goods may be safe but cannot be traced. Buyers should look for a raised star beneath the official seal.", "Anyone holding suspect {{good}} may return it to the guildhall without penalty through {{weekday}}."],
  },
  {
    id: "guild-feast", title: "Crafts Procession Set for {{festival}}", dramaticTitle: "Guilds Battle for Best Float", kicker: "Festival Book",
    dek: "{{number:8-20}} guilds will parade masterworks through {{street}}.", illustrationId: "bakers-oven",
    paragraphs: ["This year's procession begins at the {{direction}} gate and ends before the council steps.", "Highlights include a walking oven, a glass dragon and the chandlers' controversial tower of living flame.", "Spectators should keep the route clear and refrain from ordering goods from moving displays."],
  },
  {
    id: "guild-night-work", title: "New Rules Limit Enchanted Night Work", dramaticTitle: "Guild Bans Tools That Labor While Masters Sleep", kicker: "Workshop Law",
    dek: "The code follows complaints from neighbors and one exhausted broom.", illustrationId: "dock-crane",
    paragraphs: ["Beginning {{weekday}}, unattended tools may work no later than the {{bell}} inside {{location}}.", "Guild counsel says the rule protects apprentices and prevents hammers from learning bad habits without supervision.", "Exemptions require a warded shop, a named overseer and written consent from any sentient equipment."],
  },
]);
