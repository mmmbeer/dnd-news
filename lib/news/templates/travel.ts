import { defineTemplates } from "./shared";

export const travelTemplates = defineTemplates("travel", [
  {
    id: "travel-road", title: "{{location}} Road Reopens Under Escort", dramaticTitle: "Travelers Vanish Between {{location}} and {{location2}}", kicker: "Roads & Rivers",
    dek: "Officials advise daylight travel and groups of six or more.", illustrationId: "caravan-road",
    paragraphs: ["The post road has reopened with armed escorts after reports of {{choice:bandits/giant spoor/living fog/unlicensed toll collectors}}.", "Coaches depart at first and fifth bell. Freight receives priority for {{number:2-5}} days.", "Lantern signals from the northern wood are not official and should not be answered."],
  },
  {
    id: "travel-bridge", title: "Old {{location}} Bridge Closes for Repairs", dramaticTitle: "Crack Splits Bridge Before Dawn Caravan", kicker: "Road Notice",
    dek: "Traffic diverts {{distance}} through the lower ford.", illustrationId: "stone-bridge",
    paragraphs: ["Surveyors closed the bridge after finding a central stone had shifted overnight.", "Masons expect repairs to take {{number:3-14}} days unless the river rises or the bridge objects.", "Foot travelers may use the ferry. Carts and mounted ogres must take the marked detour."],
  },
  {
    id: "travel-ferry", title: "New Ferry Begins {{location}} Crossing", dramaticTitle: "Chain Ferry Defies River Current", kicker: "River News",
    dek: "The service cuts the trip to {{location2}} by {{number:1-6}} hours.", illustrationId: "river-barge",
    paragraphs: ["The flat-bottomed ferry made its first public crossing with {{number:20-60}} passengers and six carts.", "Fares are {{silver}} per wagon, with reduced rates for pilgrims and nonflammable familiars.", "Service runs until the {{bell}}. The ferryman reserves the right to refuse prophetic horses."],
  },
  {
    id: "travel-crossroads", title: "All Signs at {{location}} Crossroads Turn {{direction|title}}", dramaticTitle: "Bewitched Signpost Sends Caravans Astray", kicker: "Traveler Alert",
    dek: "Road crews have covered the arrows while a hedge mage investigates.", illustrationId: "road-sign",
    paragraphs: ["Drivers reported that every arm on the signpost pointed {{direction}} regardless of its destination.", "At least {{number:5-18}} wagons reached {{inn}} twice before noticing the error.", "Travelers should use mile stones until {{weekday}} and disregard directions offered by crows."],
  },
  {
    id: "travel-pass", title: "{{location}} Pass Opens After Early Thaw", dramaticTitle: "Avalanche Road Opens Beneath Unstable Peaks", kicker: "Mountain Routes",
    dek: "Wardens permit single-file travel between sunrise and the {{bell}}.", illustrationId: "mountain-pass",
    paragraphs: ["Crews cleared the final drift from the pass after {{number:4-16}} days of digging.", "Snow remains deep above the eastern shelf. Bells, thunder spells and loud arguments are forbidden.", "The first escorted caravan leaves {{weekday}} carrying food, mail and replacement shrine candles."],
  },
  {
    id: "travel-caravan", title: "Missing Caravan Walks Into {{location}}", dramaticTitle: "Lost Caravan Returns With One Extra Wagon", kicker: "Road Mystery",
    dek: "The merchants vanished {{number:3-20}} days ago in clear weather.", illustrationId: "caravan-road",
    paragraphs: ["The caravan entered by the {{direction}} gate at dawn, its drivers tired but unharmed.", "Every traveler remembers one night on the road. Their cargo of {{good}} is intact, along with a wagon none claims.", "The Watch has sealed the unclaimed wagon after knocking was heard from beneath its floor."],
  },
  {
    id: "travel-inn", title: "{{inn}} Closes After {{number:80-300}} Years", dramaticTitle: "Famed Roadhouse Bars Its Doors Without Warning", kicker: "Wayfarer's Desk",
    dek: "The innkeeper cites repairs, retirement and a cellar that will not stay put.", illustrationId: "stone-bridge",
    paragraphs: ["Travelers arriving yesterday found shutters closed and a notice nailed above the stable door.", "Innkeeper {{person}} promises all room deposits will be returned, except coins currently in another year.", "The nearest licensed lodging is {{distance}} {{direction}} on the {{location}} road."],
  },
  {
    id: "travel-map", title: "Cartographers Release New Map of {{region|title}}", dramaticTitle: "New Survey Erases Three Villages, Adds Seven", kicker: "Maps & Miles",
    dek: "The edition corrects roads altered by flood, war and wandering hills.", illustrationId: "road-sign",
    paragraphs: ["{{organization}} unveiled its first full survey in {{number:8-40}} years at the guildhall.", "The map adds {{number:4-12}} bridges and marks regions where distances vary by moon phase.", "Owners of the last edition may trade it in, provided it has not become attached to its errors."],
  },
  {
    id: "travel-circle", title: "Public Travel Circle Links {{location}} and {{location2}}", dramaticTitle: "One Step Now Crosses {{distance}}", kicker: "Arcane Transit",
    dek: "Licensed passengers can cross twice daily under Collegium supervision.", illustrationId: "river-barge",
    paragraphs: ["The paired circles opened after a month of tests involving crates, goats and volunteer apprentices.", "Passage costs {{silver}} and includes one trunk. Iron weapons must be wrapped and memories declared.", "Officials warn that the final service leaves at the {{bell}} with or without delayed body parts."],
  },
  {
    id: "travel-beast", title: "{{creature|title}} Herd Delays North Road", dramaticTitle: "Travel Halted by {{creature|plural|title}}", kicker: "Roads & Rivers",
    dek: "Rangers expect the migration to clear within {{number:2-8}} days.", illustrationId: "mountain-pass",
    paragraphs: ["A herd settled across the road near mile marker {{number:8-40}}, stopping coaches in both directions.", "Rangers advise waiting quietly. Attempts to lure the creatures with {{good}} have attracted more.", "Mail will travel by river until the herd moves on or learns the route schedule."],
  },
]);
