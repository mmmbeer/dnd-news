import { defineTemplates } from "./shared";

export const cultureTemplates = defineTemplates("culture", [
  {
    id: "culture-play", title: "{{choice:The Duchess of Daggers/A Map of Empty Rooms/The Goblin's Almanac/Seven Funerals for Spring}} Opens at Old Crown", dramaticTitle: "Triumph or Treason? New Play Divides {{location}}", kicker: "Arts & Letters",
    dek: "A crowded premiere earns applause, walkouts and a formal complaint.", illustrationId: "theatre-stage",
    paragraphs: ["The production favors spare scenery, practical thunder and a chorus seated among the audience.", "Lead player {{person}} delivered the trial speech from atop the royal box. Critics questioned the live gelatinous cube.", "Performances continue through the month. Patrons in the first rows receive protective capes."],
  },
  {
    id: "culture-bard", title: "Ballad of {{location}} Wins Silver Lute", dramaticTitle: "Unknown Bard Silences Festival Hall", kicker: "Music",
    dek: "{{person}} takes the city's highest song prize on a borrowed instrument.", illustrationId: "bard-lute",
    paragraphs: ["The final ballad began without accompaniment before adding a chorus from the upper balcony.", "Judges praised its account of {{artifact}} and ignored several historical liberties.", "The winning song will be performed at {{festival}} if the chorus can be found again."],
  },
  {
    id: "culture-painting", title: "Portrait Exhibition Opens on {{street}}", dramaticTitle: "Painted Eyes Follow Every Visitor", kicker: "Galleries",
    dek: "{{number:20-80}} new works by {{person}} fill the Lantern Gallery.", illustrationId: "painter-easel",
    paragraphs: ["The exhibition depicts merchants, laborers and nobles against the same storm-dark horizon.", "Several subjects claim their portraits have changed expression since hanging.", "The gallery calls the effect artistic depth. A warder has been retained for the night shift."],
  },
  {
    id: "culture-printing", title: "New Press Prints {{number:100-800}} Sheets an Hour", dramaticTitle: "Mechanical Press Threatens Scribes' Monopoly", kicker: "Letters & Print",
    dek: "The iron-framed machine begins work at {{location}}'s largest printshop.", illustrationId: "printing-press",
    paragraphs: ["Printer {{person}} demonstrated the press with a broadsheet produced before the ink on its first line dried.", "Scribes question its accuracy and object to the noise. The machine has not answered.", "Its first commission is a revised city code of {{number:80-300}} pages."],
  },
  {
    id: "culture-opera", title: "{{color|title}} Tower Opera Extends Run", dramaticTitle: "Audience Demands Seventh Curtain Call", kicker: "On Stage",
    dek: "The spectacle's flying chorus returns through {{weekday}}.", illustrationId: "theatre-stage",
    paragraphs: ["All performances sold out after word spread of the third act's airborne duel.", "Soprano {{person}} sings the final note while suspended above a pool of real water.", "Management says the rigging is safe and the understudy can swim."],
  },
  {
    id: "culture-poet", title: "Street Poet Appointed Royal Laureate", dramaticTitle: "Palace Chooses Tavern Verse Over Court Favorites", kicker: "Books",
    dek: "{{person}} receives a silver chain and an annual barrel of ink.", illustrationId: "bard-lute",
    paragraphs: ["The new laureate is known for verses performed outside {{inn}} and written on discarded warrants.", "The palace praised a direct voice and useful rhymes. Court poets requested the scoring rubric.", "A first official ode is due before {{festival}}."],
  },
  {
    id: "culture-sculpture", title: "Statue Unveiled in {{location}} Square", dramaticTitle: "New Monument Looks Nothing Like Its Hero", kicker: "Public Art",
    dek: "The bronze figure honors {{person}} and points firmly {{direction}}.", illustrationId: "painter-easel",
    paragraphs: ["A crowd gathered as workers pulled away the canvas at noon.", "The sculptor defended the unfamiliar face as symbolic accuracy. The subject's descendants called it a handsome stranger.", "Pigeons approved immediately. The council will review the inscription {{weekday}}."],
  },
  {
    id: "culture-book", title: "Banned Chronicle Returns to Shelves", dramaticTitle: "Forbidden History Sells Out Before Noon", kicker: "Books & Ideas",
    dek: "A new edition restores {{number:3-12}} chapters removed by royal order.", illustrationId: "printing-press",
    paragraphs: ["Booksellers opened crates under Watch supervision and sold every copy within two hours.", "The restored passages concern {{artifact}} and a disputed succession in {{region}}.", "Palace counsel says possession is lawful. Reading aloud near government buildings may still cause delays."],
  },
  {
    id: "culture-museum", title: "Museum Opens Hall of Small Wonders", dramaticTitle: "Tiny Relics Draw Enormous Queue", kicker: "Exhibitions",
    dek: "The collection ranges from a dragon's baby tooth to a bottled footstep.", illustrationId: "painter-easel",
    paragraphs: ["The new gallery at {{location}} Archive contains {{number:40-120}} objects no larger than a fist.", "Curator {{person}} says small objects preserve history people otherwise overlook.", "Visitors receive magnifying lenses and strict instructions not to uncork anything."],
  },
  {
    id: "culture-puppet", title: "Puppet Satire Returns After Council Review", dramaticTitle: "Mayor's Wooden Double Takes the Stage", kicker: "Popular Theatre",
    dek: "The revised show keeps its sharpest jokes and removes one actual fireball.", illustrationId: "theatre-stage",
    paragraphs: ["Crowds filled {{street}} for the first legal performance of The Aldermen's Supper.", "The mayor attended in disguise and was recognized when his puppet complained about taxes.", "Shows continue nightly, weather and warrants permitting."],
  },
]);
