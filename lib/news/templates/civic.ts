import { defineTemplates } from "./shared";

export const civicTemplates = defineTemplates("civic", [
  {
    id: "civic-measure", title: "{{choice:Curfew/Bridge Toll/Market Charter/Night Watch Budget|title}} Measure Advances",
    dramaticTitle: "Council Erupts Over {{choice:Curfew/Bridge Toll/Market Charter/Night Watch Budget|title}}", kicker: "Council & Crown",
    dek: "{{location}} officials set a final vote for {{weekday}}.", illustrationId: "council-chamber",
    paragraphs: ["{{location}}'s council heard four hours of testimony before advancing the measure. {{person}}, speaking for {{organization}}, called it a matter of order and plain accounting.", "Opponents packed the west gallery. The clerk recorded {{number:2-7}} amendments, one broken quill and a demand that magical interference be defined.", "The old rules remain until {{weekday}}. The Watch has been told to use discretion, a phrase neither side found comforting."],
  },
  {
    id: "civic-gate-hours", title: "Gate Hours Extended for {{festival}}", dramaticTitle: "Midnight Opening at {{location}} Gates Raises Alarm",
    kicker: "City Hall", dek: "Merchants welcome later passage while the Watch seeks {{number:12-40}} additional lanterns.", illustrationId: "city-gates",
    paragraphs: ["The {{direction}} gate at {{location}} will remain open through the {{bell}} during {{festival}}, the magistrate announced.", "Carters praised the change. Watch Captain {{person}} warned that every wagon will still be searched for contraband, curses and unregistered poultry.", "The trial schedule begins {{weekday}} and will be reviewed after {{number:2-6}} marketdays."],
  },
  {
    id: "civic-royal-decree", title: "Crown Issues New Decree on {{good|title}}", dramaticTitle: "Royal Seal Falls on {{good|title}} Trade",
    kicker: "From the Palace", dek: "The order takes effect at the next sunrise throughout {{region}}.", illustrationId: "royal-decree",
    paragraphs: ["A decree bearing the royal seal reached {{location}} shortly before noon. It changes the licensing, transport and public display of {{good}}.", "Chancellor {{person}} said the order corrects an old ambiguity. {{organization}} called it a tax disguised as punctuation.", "Copies will be posted on {{street}}. Ignorance of the decree is no defense, though illegible copies may earn a short adjournment."],
  },
  {
    id: "civic-magistrate-trial", title: "Magistrate Clears {{number:20-80}} Cases in One Sitting", dramaticTitle: "Justice by Sundown: Record Docket Stuns {{location}}",
    kicker: "Courts", dek: "A marathon session settles disputes ranging from enchanted fences to a disputed goat.", illustrationId: "justice-scales",
    paragraphs: ["Magistrate {{person}} concluded {{number:20-80}} matters before the {{bell}}, setting what clerks believe is a city record.", "The longest case concerned a boundary stone that moves three feet each night. The shortest ended when the accused turned back into a hat.", "Court resumes {{weekday}} with arguments over whether a familiar may testify through its wizard."],
  },
  {
    id: "civic-aqueduct", title: "Council Funds Repairs to {{location}} Aqueduct", dramaticTitle: "Cracks Widen Above the {{direction|title}} Ward",
    kicker: "Public Works", dek: "Masons promise clean water within {{number:3-12}} days and dry cellars eventually.", illustrationId: "public-works",
    paragraphs: ["The council approved {{gold}} for emergency stonework after inspectors found six leaking arches above {{street}}.", "{{organization}} will oversee the work. Residents should boil water until the pipes stop humming in harmony.", "Traffic will detour past {{inn}}. Heavy wagons and unusually dense familiars are prohibited."],
  },
  {
    id: "civic-election", title: "Three Enter Race for {{location}} Mayor", dramaticTitle: "Promises Fly as Mayoral Contest Turns Bitter",
    kicker: "Election Desk", dek: "Candidates divide over taxes, torchlight and the legal definition of a resident.", illustrationId: "council-chamber",
    paragraphs: ["{{person}}, {{person2}} and {{person3}} filed papers before yesterday's deadline. A fourth petition was rejected because every signature belonged to the same mimic.", "The first debate at {{inn}} will cover market fees, sewer wards and the Watch.", "Voting begins {{weekday}}. Citizens must bring a seal, a witness or a sufficiently convincing family ghost."],
  },
  {
    id: "civic-city-charter", title: "Lost City Charter Found Behind Hearth", dramaticTitle: "Ancient Charter Could Unmake {{location}} Council",
    kicker: "Civic Records", dek: "The soot-blackened document appears to grant unexpected rights to the {{profession|plural}}.", illustrationId: "royal-decree",
    paragraphs: ["Renovators at {{inn}} found a sealed tube behind a hearthstone bearing the first arms of {{location}}.", "Archivist {{person}} says the charter may predate the current council by {{number:80-400}} years. One clause recognizes speaking animals as ratepayers.", "The document is under guard while experts test the ink, wax and unusually opinionated ribbon."],
  },
  {
    id: "civic-ward-boundary", title: "Ward Line Moves to {{street}}", dramaticTitle: "One Street, Two Taxmen: Boundary Change Sparks Fury",
    kicker: "Local Government", dek: "Residents will change wards without moving their doors.", illustrationId: "city-gates",
    paragraphs: ["Surveyors redrew the border between the {{direction}} and {{direction2}} wards after finding the official marker beneath a bakery.", "The change affects {{number:30-180}} households and one shrine. Property records will be amended without charge through {{weekday}}.", "Councilor {{person}} blamed an obsolete map. The map, when shown the accusation, folded itself shut."],
  },
  {
    id: "civic-watch-budget", title: "Watch Wins Funds for {{number:10-60}} New Recruits", dramaticTitle: "Council Arms the Night Watch After Dark Omens",
    kicker: "Public Safety", dek: "The levy adds patrols near {{street}} and the {{direction}} gate.", illustrationId: "justice-scales",
    paragraphs: ["The council passed a supplemental Watch budget by a vote of {{number:5-9}} to {{number:1-4}} after testimony from Captain {{person}}.", "Funds cover recruits, lantern oil and cages rated for creatures larger than a horse.", "Training begins {{weekday}}. Applicants must run a mile, read a warrant and distinguish illusion from poor lighting."],
  },
  {
    id: "civic-fountain", title: "New Fountain Opens in {{street}}", dramaticTitle: "Civic Fountain Speaks During Dedication",
    kicker: "Around the Ward", dek: "The public work honors {{person}} and dispenses water with unsolicited advice.", illustrationId: "public-works",
    paragraphs: ["Mayor {{person2}} opened the new fountain with a silver cup and a speech lasting {{number:12-40}} minutes.", "At the first pour, the central figure cleared its stone throat and corrected the mayor's account of the old war.", "Engineers insist the water is safe. Citizens are asked not to debate the fountain after dusk."],
  },
]);
