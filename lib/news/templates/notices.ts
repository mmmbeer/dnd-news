import { defineTemplates } from "./shared";

export const noticeTemplates = defineTemplates("notices", [
  {
    id: "notice-missing", title: "Public Notice: Missing {{choice:Apprentice/Ceremonial Mace/Six Homing Pigeons/Tax Ledger|title}}", dramaticTitle: "REWARD! Missing Property Sought", kicker: "Notices",
    dek: "Last seen near {{location}}. Discretion requested; questions expected.", illustrationId: "notice-board", kind: "notice",
    paragraphs: ["The missing party or item was last observed after the final bell on {{weekday}}. A reward of {{gold}} is offered for safe return.", "Do not approach if glowing, reciting legal doctrine or traveling in duplicate.", "Information may be left with {{person}} at the {{direction}} gate."],
  },
  {
    id: "notice-crier", title: "Hear Ye: Gate Muster at {{bell|title}}", dramaticTitle: "Town Crier Calls Every Able Hand", kicker: "Official Notice",
    dek: "Residents of the {{direction}} ward must attend or send a lawful excuse.", illustrationId: "town-crier", kind: "notice",
    paragraphs: ["By order of Magistrate {{person}}, households will muster in {{street}} on {{weekday}}.", "Bring one bucket, one lantern and the name of a person to contact in case of transformation.", "This is a drill unless the city bells ring in descending order."],
  },
  {
    id: "notice-familiar", title: "Lost Familiar: {{color|title}} Winged Cat", dramaticTitle: "REWARD for Missing Winged Cat", kicker: "Lost & Found",
    dek: "Answers to {{choice:Buttons/Marmalade/Professor/Midnight}} when inclined.", illustrationId: "lost-pet", kind: "notice",
    paragraphs: ["Last seen above {{street}} wearing a brass collar and carrying a sealed note.", "Friendly to children, suspicious of clergy and capable of opening simple windows.", "Return to {{person}} at {{inn}} for {{silver}}. Do not read the note."],
  },
  {
    id: "notice-auction", title: "Public Auction on {{weekday}}", dramaticTitle: "Rare Seized Goods Go Under the Hammer", kicker: "Auction Notice",
    dek: "Lots include carts, furniture, {{good}} and one sealed trunk.", illustrationId: "auction-gavel", kind: "advert",
    paragraphs: ["Viewing begins at the {{bell}} in the Crown warehouse near {{street}}.", "All lots sell as found. Magical inspection is permitted but must not alter, awaken or release the property.", "Payment in coin or certified guild note. No prophecies accepted."],
  },
  {
    id: "notice-help-wanted", title: "Help Wanted: Experienced {{profession|title}}", dramaticTitle: "Immediate Hire — Hazard Pay Included", kicker: "Situations Vacant",
    dek: "Steady work at {{location}} with meals and protective gloves.", illustrationId: "notice-board", kind: "advert",
    paragraphs: ["Applicant must provide tools, two references and proof of resistance to minor curses.", "Duties vary with weather and may include feeding {{creature|article}}.", "Apply to {{person}} at {{inn}} before {{weekday}}."],
  },
  {
    id: "notice-room", title: "Room to Let Above {{profession|article|title}}'s Shop", dramaticTitle: "Fine Room, Low Rent, One Small Haunting", kicker: "To Let",
    dek: "Furnished chamber on {{street}} with hearth and shared roof access.", illustrationId: "notice-board", kind: "advert",
    paragraphs: ["Rent is {{silver}} each week, paid in advance. Quiet tenant preferred.", "The east wall whispers only during rain and has never caused material harm.", "Inquire after the {{bell}}. No necromancers without references."],
  },
  {
    id: "notice-sale", title: "For Sale: Gentle {{creature|title}}", dramaticTitle: "Exceptional Beast, Sensible Offers", kicker: "For Sale",
    dek: "Trained for cart, saddle and one household command.", illustrationId: "lost-pet", kind: "advert",
    paragraphs: ["Healthy, recently shod where applicable and accustomed to children.", "Sale due to travel, not temperament. Buyer receives feed, harness and written apology from prior owner.", "View at the {{direction}} stable outside {{location}}."],
  },
  {
    id: "notice-classes", title: "Evening Lessons in {{spellSchool|title}}", dramaticTitle: "Learn Practical Magic in Six Nights", kicker: "Instruction",
    dek: "Small classes for careful adults at {{street}}.", illustrationId: "town-crier", kind: "advert",
    paragraphs: ["Instructor {{person}} offers beginner lessons each {{weekday}} after the {{bell}}.", "Fee is {{silver}}, including chalk and basic ward insurance.", "Students must bring a candle, closed shoes and no existing pacts."],
  },
  {
    id: "notice-found", title: "Found: {{artifact|title}}", dramaticTitle: "Curious Object Awaits Proof of Ownership", kicker: "Lost & Found",
    dek: "Recovered near {{temple}} after {{festival}}.", illustrationId: "auction-gavel", kind: "notice",
    paragraphs: ["The owner must describe the object, its container and any sound it makes at midnight.", "Storage charges begin after {{number:5-14}} days. Unclaimed cursed property transfers to the Watch.", "Ask for {{person}} at {{inn}} and do not bring matching copies."],
  },
  {
    id: "notice-proclamation", title: "Proclamation: Bells Silent on {{weekday}}", dramaticTitle: "City Bells Ordered Still for One Night", kicker: "By Civic Order",
    dek: "The quiet period runs from sunset until the {{bell}}.", illustrationId: "town-crier", kind: "notice",
    paragraphs: ["All temples, guildhalls and private towers must silence bells during the appointed hours.", "The order supports an arcane survey beneath {{location}} and carries a fine of {{gold}}.", "Handbells for emergencies remain permitted if wrapped in {{color}} cloth."],
  },
]);
