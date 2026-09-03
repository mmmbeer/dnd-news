import { defineTemplates } from "./shared";

export const weatherTemplates = defineTemplates("weather", [
  {
    id: "weather-phenomenon", title: "Unseasonable Conditions Cross {{region}}", dramaticTitle: "{{phenomenon|title}} Forecast Through {{weekday}}", kicker: "Weather & Almanac",
    dek: "Temple augurs recommend securing livestock and loose memories.", illustrationId: "enchanted-weather", kind: "brief",
    paragraphs: ["A band of {{phenomenon}} is expected to cross {{region}} by evening, according to the combined temple almanac.", "River traffic may be delayed. Farmers should cover young plants and bring familiars indoors.", "The forecast carries a confidence of six rooks in ten. Contradictory weather should be reported."],
  },
  {
    id: "weather-eclipse", title: "Noonday Eclipse Expected {{weekday}}", dramaticTitle: "Sun to Vanish for {{number:3-18}} Minutes", kicker: "Sky Watch",
    dek: "Astronomers say the event is natural, punctual and safe to observe indirectly.", illustrationId: "sun-and-moon",
    paragraphs: ["The moon will cross the sun shortly after the {{bell}}, darkening {{region}}.", "Clerics at {{temple}} will ring bells throughout the eclipse. Street lamps will be lit at public expense.", "Readers should not stare at the sun through crystal balls, polished shields or borrowed familiars."],
  },
  {
    id: "weather-lightning", title: "Dry Lightning Strikes {{number:8-40}} Times", dramaticTitle: "{{color|title}} Bolts Hammer {{location}} Without Rain", kicker: "Storm Desk",
    dek: "Fire crews patrol the {{direction}} ward after an unnatural storm.", illustrationId: "lightning-tree",
    paragraphs: ["Lightning moved across {{location}} from east to west while the sky remained clear.", "Most strikes hit iron signs, weather vanes and one extremely unlucky suit of armor.", "The Collegium is testing residue. Residents should avoid tall trees and unusually eager swords."],
  },
  {
    id: "weather-flood", title: "River Expected to Crest by {{bell|title}}", dramaticTitle: "Floodwater Nears {{street}}", kicker: "River Warning",
    dek: "Sandbag lines open as the water rises another {{number:2-9}} feet.", illustrationId: "flooded-river",
    paragraphs: ["Upstream rain pushed the river over its lower bank before dawn.", "Crews closed cellar doors along {{street}} and moved livestock to {{temple}} hill.", "The ferry is suspended. Citizens should tie down boats and refuse invitations from voices in the water."],
  },
  {
    id: "weather-warm-snow", title: "Warm Snow Falls Across {{location}}", dramaticTitle: "Winter Flakes Steam on Every Roof", kicker: "Unusual Weather",
    dek: "The flakes melt upward and leave the streets dry.", illustrationId: "enchanted-weather",
    paragraphs: ["Soft snow began at sunrise despite temperatures fit for midsummer.", "Almanac keeper {{person}} measured each flake at exactly the warmth of fresh bread.", "No harm is reported. Bakers object to the comparison and the Collegium has collected a sealed bucket."],
  },
  {
    id: "weather-forecast", title: "Almanac Predicts {{number:8-30}} Clear Days", dramaticTitle: "Perfect Weather Promised, Farmers Suspicious", kicker: "Forecast",
    dek: "Every major augur agrees for the first time in living memory.", illustrationId: "sun-and-moon", kind: "brief",
    paragraphs: ["Seven temple calendars and three trained geese point to an extended spell of clear weather.", "Farmers are advised to plant, repair roofs and remain skeptical.", "The Gazette will print corrections if clouds appear before {{weekday}}."],
  },
  {
    id: "weather-hail", title: "Hail Damages Orchards in {{region|title}}", dramaticTitle: "Fist-Sized Ice Batters Harvest", kicker: "Farm Report",
    dek: "Growers estimate losses near {{percent}} after a sudden storm.", illustrationId: "lightning-tree",
    paragraphs: ["The hailstorm crossed three valleys in less than an hour, stripping leaves and bruising late fruit.", "No people were seriously hurt. Several scarecrows are missing and presumed displaced.", "Relief petitions open at the Crown Office on {{weekday}}."],
  },
  {
    id: "weather-fog", title: "River Fog Delays Morning Traffic", dramaticTitle: "Whispering Fog Swallows {{location}} Quay", kicker: "Travel Weather",
    dek: "Visibility falls to arm's length along the waterfront.", illustrationId: "flooded-river", kind: "brief",
    paragraphs: ["Boats remained tied while dense fog climbed the quay and entered several open warehouses.", "Witnesses heard names spoken from the mist, though none matched anyone present.", "The harbor reopens when the third beacon becomes visible or stops answering."],
  },
  {
    id: "weather-wind", title: "{{direction|title}} Wind Topples Market Awnings", dramaticTitle: "Gale Sends Stalls Flying Over {{street}}", kicker: "Weather Desk",
    dek: "A sudden gust scatters goods across three wards.", illustrationId: "enchanted-weather",
    paragraphs: ["The gale struck during the busiest market hour and lasted {{number:4-20}} minutes.", "Watch officers recovered bolts of cloth, cages and one astonished pie from nearby rooftops.", "Merchants may claim lost goods at the guildhall after describing them without exaggeration."],
  },
  {
    id: "weather-red-dawn", title: "{{color|title}} Dawn Seen Across {{region|title}}", dramaticTitle: "Red Sky Ignites Prophecy Rumors", kicker: "Sky Watch",
    dek: "Temple observers record a brilliant horizon with no matching fire.", illustrationId: "sun-and-moon",
    paragraphs: ["The eastern sky held a deep {{color}} band from first light until the {{bell}}.", "Cleric {{person}} found no recognized omen matching the display. Sailors found several and disagree on all of them.", "The color faded by noon, leaving a faint metallic smell over {{location}}."],
  },
]);
