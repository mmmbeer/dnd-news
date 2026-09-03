import { defineTemplates } from "./shared";

export const adventureTemplates = defineTemplates("adventure", [
  {
    id: "adventure-expedition", title: "Expedition Sought for {{location}} Survey", dramaticTitle: "Who Will Brave the Ruins Beneath {{location}}?", kicker: "Beyond the Walls",
    dek: "Patrons offer coin and salvage rights for recovery of {{artifact}}.", illustrationId: "dungeon-stairs",
    paragraphs: ["Floodwater receded last week, revealing a stair marked with the seal of a dynasty absent from every history of {{region}}.", "Sponsors seek {{number:4-7}} persons familiar with traps, dead languages and tactful retreat. Payment begins at {{gold}}.", "Applicants should leave a copper feather at {{inn}}. If it knocks from within, do not answer."],
  },
  {
    id: "adventure-map", title: "Map to {{artifact|title}} Offered for Sale", dramaticTitle: "Treasure Map Sparks Bidding War", kicker: "Fortune & Peril",
    dek: "The ink redraws a route through {{region}} whenever the moon rises.", illustrationId: "treasure-map",
    paragraphs: ["A weathered map appeared in the window of a dealer on {{street}} with an asking price of {{gold}}.", "The route ends beneath a mark shaped like {{creature|article}}. Two previous owners are missing.", "The dealer guarantees the parchment is genuine but makes no promise about the destination."],
  },
  {
    id: "adventure-tracks", title: "Enormous Tracks Found Near {{location}}", dramaticTitle: "What Left This Print Outside the Walls?", kicker: "Frontier Report",
    dek: "Rangers measure a clawed footprint longer than a cart.", illustrationId: "monster-footprint",
    paragraphs: ["The first track appeared beside the north road, followed by {{number:8-30}} more leading toward {{region}}.", "No livestock are missing. Trees along the path have been stripped of bark at twice a person's height.", "Rangers seek experienced trackers. Sightseers will be fined and returned to the gate."],
  },
  {
    id: "adventure-camp", title: "Delvers Form Company at {{inn}}", dramaticTitle: "New Adventuring Band Claims Impossible Contract", kicker: "Company News",
    dek: "The {{color|title}} Lanterns recruit a healer, scout and licensed arcanist.", illustrationId: "adventurers-camp",
    paragraphs: ["Company founder {{person}} announced the charter before a crowded common room.", "Their first commission is to recover {{artifact}} from ruins {{distance}} {{direction}} of {{location}}.", "Applicants must supply references, next of kin and their own bedroll."],
  },
  {
    id: "adventure-stair", title: "Hidden Stair Opens Beneath {{temple}}", dramaticTitle: "Priests Seal Door After Voices Rise Below", kicker: "Discovery",
    dek: "Renovation reveals steps descending beyond the known crypt.", illustrationId: "dungeon-stairs",
    paragraphs: ["Workers lifted a cracked altar stone and found an iron ring set into older masonry.", "The stair drops past torchlight and bears fresh footprints leading downward only.", "Clerics seek a discreet party for inspection after {{weekday}} services."],
  },
  {
    id: "adventure-reward", title: "{{gold}} Reward Offered for {{creature|article|title}}", dramaticTitle: "Beast of {{region|title}} Claims Another Wagon", kicker: "Bounty Board",
    dek: "The contract requires proof, witnesses and minimal damage to nearby farms.", illustrationId: "monster-footprint",
    paragraphs: ["A regional reeve posted the bounty after the creature overturned {{number:3-12}} wagons in one month.", "Hunters describe feathered tracks, scorched grass and a cry like a temple bell underwater.", "Claims must be filed at {{inn}}. Parts from unrelated monsters will not be accepted."],
  },
  {
    id: "adventure-ruin", title: "Ruined Keep Appears on Empty Hill", dramaticTitle: "Castle Returns Overnight After {{number:200-900}} Years", kicker: "Borderlands",
    dek: "Travelers report lit windows and banners from a forgotten house.", illustrationId: "treasure-map",
    paragraphs: ["The keep now stands beside the road to {{location}}, where maps show only pasture.", "A rider approaching the gate heard a herald announce a feast dated centuries ago.", "The Crown seeks scouts willing to observe from outside and resist invitations."],
  },
  {
    id: "adventure-missing-party", title: "Search Begins for {{color|title}} Company", dramaticTitle: "Adventurers Miss Third Check-In", kicker: "Search Notice",
    dek: "The company vanished while surveying caves near {{location}}.", illustrationId: "adventurers-camp",
    paragraphs: ["The {{number:4-8}}-member party last sent word from a camp {{distance}} beyond the west road.", "Their message mentioned running water, carved eyes and a door that knew their names.", "Search volunteers gather at {{inn}} on {{weekday}} with three days' provisions."],
  },
  {
    id: "adventure-key", title: "Brass Key Seeks New Keeper", dramaticTitle: "Relic Chooses Bearer in Crowded Market", kicker: "Curious Objects",
    dek: "{{artifact|title}} attaches itself to a passerby's belt.", illustrationId: "dungeon-stairs",
    paragraphs: ["Witnesses on {{street}} saw the object leap from a locked case and fasten to {{person}}.", "Every attempt to remove it has opened a different nearby lock instead.", "Scholars believe the true door lies in {{region}} and request escort for the key's reluctant keeper."],
  },
  {
    id: "adventure-escort", title: "Caravan Seeks Armed Escort to {{location}}", dramaticTitle: "Hazard Pay Doubled for {{region|title}} Run", kicker: "Contracts",
    dek: "Merchants offer {{gold}} plus meals for a {{number:5-14}}-day journey.", illustrationId: "adventurers-camp",
    paragraphs: ["The caravan carries {{good}}, medicine and sealed diplomatic cases.", "Recent hazards include washed bridges, false road signs and {{creature|plural}} nesting near the pass.", "Applicants meet factor {{person}} at {{inn}} before the {{bell}}."],
  },
]);
