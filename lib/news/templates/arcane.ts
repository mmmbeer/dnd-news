import { defineTemplates } from "./shared";

export const arcaneTemplates = defineTemplates("arcane", [
  {
    id: "arcane-phenomenon", title: "Collegium Studies {{phenomenon|title}}", dramaticTitle: "Experts Baffled as {{phenomenon|title}} Engulfs {{location}}", kicker: "Arcane Affairs",
    dek: "Residents should avoid mirrors, unattended circles and confident amateur explanations.", illustrationId: "wizard-tower",
    paragraphs: ["{{phenomenon|title}} was observed over {{location}} shortly after the {{bell}}, prompting the Collegium to close two courtyards.", "Professor {{person}} called the event probably natural before a nearby statue began answering questions.", "Anyone experiencing prophetic dreams should write them in the present tense and deliver them before noon."],
  },
  {
    id: "arcane-portal", title: "Unlicensed Portal Opens on {{street}}", dramaticTitle: "Doorway to Unknown Shore Swallows Cart", kicker: "Arcane Incident",
    dek: "Wardens cordon off a blue arch that was not there yesterday.", illustrationId: "magic-circle",
    paragraphs: ["A freestanding doorway appeared before dawn, showing a black beach beneath unfamiliar stars.", "One empty handcart rolled through before wardens raised a barrier. A rope sent after it returned neatly coiled and warm.", "The Collegium asks citizens not to throw messages, rubbish or relatives through the opening."],
  },
  {
    id: "arcane-licensing", title: "New Rules Proposed for {{spellSchool|title}} Magic", dramaticTitle: "Wizards Face Registry Under Council Plan", kicker: "Law & Magic",
    dek: "The measure would require permits for spells cast in streets, taverns and civic offices.", illustrationId: "enchanted-book",
    paragraphs: ["Councilor {{person}} introduced licensing rules after {{number:5-20}} complaints involving public {{spellSchool}}.", "The proposal exempts temple rites, emergencies and stage performances clearly advertised as dangerous.", "{{organization}} will testify {{weekday}}. Familiar attendance is permitted if carriers are provided."],
  },
  {
    id: "arcane-familiars", title: "Familiars Refuse Duties at Collegium", dramaticTitle: "Owls, Imps and Cats Walk Out Together", kicker: "Campus Dispatch",
    dek: "The dispute centers on treats, working hours and credit for research.", illustrationId: "crystal-ball",
    paragraphs: ["More than {{number:20-90}} familiars gathered silently in the east quad while their wizards searched for missing notes.", "A raven speaking for the group demanded named authorship on papers and an end to unpaid night observation.", "Talks continue. Classes requiring small creatures have been postponed or redesigned around willing furniture."],
  },
  {
    id: "arcane-clock", title: "Town Clock Begins Counting Backward", dramaticTitle: "{{location}} Has {{number:8-30}} Hours Left, Clock Claims", kicker: "Unexplained",
    dek: "No one agrees what happens when the hands reach midnight.", illustrationId: "wizard-tower",
    paragraphs: ["The clock above {{street}} reversed at noon and has lost one hour with each bell.", "Clockmaker {{person}} found no mechanical fault. Diviners disagree whether the display is prophecy, warning or criticism.", "The square will close before the final hour. Residents are asked not to gather merely to see what happens."],
  },
  {
    id: "arcane-tower", title: "Wizard's Tower Moves {{direction|title}} Overnight", dramaticTitle: "Missing Tower Found Blocking Royal Road", kicker: "Arcane Affairs",
    dek: "The seven-story structure travels {{distance}} without disturbing its sleeping owner.", illustrationId: "wizard-tower",
    paragraphs: ["Residents of {{location}} woke to an empty foundation and a neat note apologizing for the inconvenience.", "The tower was found near {{inn}}, standing in the road with every lamp still lit.", "Professor {{person}} denies moving it and has hired surveyors to determine where it would prefer to live."],
  },
  {
    id: "arcane-golem", title: "Civic Golem Retires After {{number:40-200}} Years", dramaticTitle: "Ancient Guardian Lays Down Stone Spear", kicker: "Arcane Personages",
    dek: "The granite sentinel requests a garden, a roof and no further parades.", illustrationId: "magic-circle",
    paragraphs: ["The guardian of the {{direction}} gate completed its final watch at sunrise and stepped off its plinth.", "In a statement carved overnight, it thanked citizens for their patience and criticized modern cart widths.", "Council will debate pension terms {{weekday}}. The golem has already selected a quiet courtyard."],
  },
  {
    id: "arcane-dreams", title: "Shared Dream Reported Across {{location}}", dramaticTitle: "A Thousand Sleepers Hear the Same Warning", kicker: "Dream Desk",
    dek: "Witnesses describe a {{color}} door, three bells and a voice beneath the earth.", illustrationId: "crystal-ball",
    paragraphs: ["Clerics at {{temple}} collected {{number:80-500}} matching accounts after last night's sleep.", "Every dream ended at the {{bell}} with the words chosen at dawn. No speaker was visible.", "The Collegium advises ordinary routines while researchers compare drawings of the door."],
  },
  {
    id: "arcane-laboratory", title: "Laboratory Blast Rattles {{street}}", dramaticTitle: "{{color|title}} Fireball Tears Roof From Alchemist Hall", kicker: "Breaking",
    dek: "No serious injuries are reported after an experiment involving {{good}}.", illustrationId: "alchemy-flask",
    paragraphs: ["Windows shook across the {{direction}} ward when an upper laboratory released a silent column of {{color}} flame.", "Alchemist {{person}} called the result unexpected but repeatable. The Watch has forbidden repetition.", "Neighbors may claim broken glass costs at the guildhall. Glowing glass requires a separate form."],
  },
  {
    id: "arcane-library", title: "Enchanted Books Reshelve Themselves by Mood", dramaticTitle: "Library Stacks Reject Readers", kicker: "From the Archives",
    dek: "The new catalog works quickly but refuses to explain its decisions.", illustrationId: "enchanted-book",
    paragraphs: ["Books at the Third Archive began moving after a routine ward renewal, arranging themselves under headings such as Regret and Overconfidence.", "Chief Scribe {{person}} says no volume is missing, though tax histories have barricaded one aisle.", "Readers may request books at the desk. Requests judged insincere may receive a different title."],
  },
]);
