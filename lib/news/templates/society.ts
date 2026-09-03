import { defineTemplates } from "./shared";

export const societyTemplates = defineTemplates("society", [
  {
    id: "society-salon", title: "{{person}} Opens Winter Salon", dramaticTitle: "Masks, Missteps and a Midnight Departure", kicker: "Society",
    dek: "{{location}}'s season begins with seven courses and one empty chair.", illustrationId: "masked-ball",
    paragraphs: ["{{person}} opened the season with a candlelit salon beneath an illusion of a summer sky.", "{{person2}} arrived after the soup wearing mourning blue, then departed without cloak or carriage.", "The hostess called the evening a success. Her steward clarified that the peacock was invited and the duelist was not."],
  },
  {
    id: "society-carriage", title: "Unmarked Carriage Seen at {{inn}}", dramaticTitle: "Whose Crest Was Hidden at Midnight?", kicker: "Seen & Heard",
    dek: "A curtained coach waits through the {{bell}} before leaving {{direction}}.", illustrationId: "noble-carriage",
    paragraphs: ["The driver refused the stable and kept two gray horses harnessed in the rain.", "A figure in a {{color}} cloak entered by the kitchen door and left carrying a narrow silver case.", "The innkeeper denies recognizing the visitor and has already repeated the denial to four papers."],
  },
  {
    id: "society-banquet", title: "{{person}} Hosts Feast for {{organization}}", dramaticTitle: "Twelve Courses, One Duel and a Missing Dessert", kicker: "At Table",
    dek: "The banquet at {{location}} brings old rivals under one roof.", illustrationId: "feast-table",
    paragraphs: ["Guests dined beneath floating lanterns while musicians played from the upper gallery.", "A dispute over precedence ended with two gloves thrown and no blades drawn, thanks to a locked cloakroom.", "The final sugared castle vanished before serving. Staff blame heat, magic or a small guest."],
  },
  {
    id: "society-wedding", title: "{{person}} and {{person2}} Announce Wedding", dramaticTitle: "Rival Houses Joined by Secret Betrothal", kicker: "Society Notices",
    dek: "The ceremony will take place at {{temple}} during {{festival}}.", illustrationId: "wedding-rings",
    paragraphs: ["The families announced the match in matching letters delivered shortly after dawn.", "A reception for {{number:80-400}} guests follows at the {{location}} assembly rooms.", "Gifts are discouraged. Donations to the city orphan house and dragon relief fund are requested."],
  },
  {
    id: "society-mask", title: "{{color|title}} Mask Becomes Season's Fashion", dramaticTitle: "Every Face Hidden at Lantern Court", kicker: "Fashion",
    dek: "A theatrical accessory moves from stage to ballroom in a week.", illustrationId: "masked-ball",
    paragraphs: ["Silk masks with long {{color}} ribbons appeared at three major gatherings this week.", "Designer {{person}} claims the style flatters every face and discourages tedious recognition.", "The Watch asks wearers to remove masks at gates, banks and active crime scenes."],
  },
  {
    id: "society-arrival", title: "Duchess Arrives for {{festival}}", dramaticTitle: "Royal Cousin Brings {{number:20-80}} Trunks to {{location}}", kicker: "Court Circular",
    dek: "The visit fills every fine room along {{street}}.", illustrationId: "noble-carriage",
    paragraphs: ["Her Grace entered by the {{direction}} gate with six carriages and a mounted household.", "The official schedule includes {{temple}}, the guild exhibition and a private dinner with {{person}}.", "A palace aide denies that one trunk moved on its own during unloading."],
  },
  {
    id: "society-charity", title: "Midwinter Supper Raises {{gold}}", dramaticTitle: "Masked Benefactor Doubles Charity Purse", kicker: "Good Works",
    dek: "The benefit at {{inn}} supports families displaced by the river.", illustrationId: "feast-table",
    paragraphs: ["Guests pledged coin, blankets and winter fuel through a silent auction.", "The largest gift came from an unknown bidder wearing a plain {{color}} mask.", "Organizers will publish full accounts {{weekday}} after counting a purse that occasionally adds a coin."],
  },
  {
    id: "society-elopement", title: "Young Heirs Return After Sudden Journey", dramaticTitle: "Moonlit Elopement Ends at {{location}} Gate", kicker: "Society",
    dek: "Two prominent families request privacy and immediate legal advice.", illustrationId: "wedding-rings",
    paragraphs: ["{{person}} and {{person2}} arrived before dawn in a hired cart decorated with road dust and white ribbon.", "They presented a marriage certificate from {{region}} and declined to discuss the chase behind them.", "Both households now describe the union as entirely expected, though invitations have not been printed."],
  },
  {
    id: "society-garden", title: "{{person}} Opens Moon Garden to Public", dramaticTitle: "Flowers Bloom Only for Selected Guests", kicker: "Estates",
    dek: "The rare collection may be viewed after sunset through {{weekday}}.", illustrationId: "feast-table",
    paragraphs: ["The walled garden holds pale flowers from {{region}} that open only under moonlight.", "Visitors must remain on marked paths and refrain from answering plants that ask personal questions.", "Admission is {{silver}}, benefiting the healers' fund."],
  },
  {
    id: "society-scandal", title: "Court Apology Ends Seating Dispute", dramaticTitle: "Wrong Chair Nearly Starts Duel at Palace", kicker: "Court Whisper",
    dek: "A place card error puts {{person}} above {{person2}} at supper.", illustrationId: "masked-ball",
    paragraphs: ["The Master of Ceremonies issued a written apology after the disputed arrangement halted dinner.", "Both parties accepted, though one chair was removed and ceremonially burned.", "Future place cards will be checked by two clerks and a neutral herald."],
  },
]);
