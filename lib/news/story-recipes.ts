import type { StoryCategory, StoryLength, StoryTone } from "./types";

type Rng = () => number;
const pick = <T,>(rng: Rng, values: readonly T[]) => values[Math.floor(rng() * values.length)];

type Category = Exclude<StoryCategory, "any">;

const sharedSourceParagraphs = [
  `"{{choice:What matters now is a complete record/The public deserves a plain account/We will follow the evidence wherever it leads/No conclusion should outrun the facts}}," {{person8}} said {{choice:outside the guildhall/beneath the council clock/on the steps of the watch-house/after reviewing the morning dispatches}}. "{{choice:Every witness will be heard/The ledgers will be opened/Questions will be answered in order/We expect a fuller account before the next bell}}."`,
  `Witness {{person8}}, who was {{choice:crossing the square/opening a nearby shop/returning from the river/standing watch at the gate}}, described {{choice:a sudden silence before the commotion/two sharp sounds followed by shouting/a crowd forming within minutes/an unusual light above the rooftops}}. The account agrees with the posted timeline on its broad points, though not every detail.`,
  `A second account came from {{person9}}, who cautioned that {{choice:rumor had moved faster than the facts/several details changed in the retelling/the first crowd obscured the scene/the official notice left important questions unanswered}}. That witness supplied a written statement to {{organization}} before leaving {{street}}.`,
] as const;

const recipes: Record<Category, readonly string[]> = {
  civic: [
    `Clerks circulated a {{number:8-40}}-page summary showing the matter could affect {{number:40-200}} households, {{number:3-18}} licensed shops and the approaches to {{street}}. The figures remain provisional because two ward ledgers use different boundaries.`,
    `Councilor {{person4}} called the city's handling "{{choice:necessary and overdue/narrower than its critics suggest/a practical answer to an old problem/worth testing under close review}}." {{person5}} replied that the council had not yet counted every cost.`,
    `The city solicitor identified three unresolved questions: who has final authority, how appeals will be heard and which old charters in {{region}} still control. A written opinion is expected before {{weekday}}.`,
    `Residents may inspect the underlying notices at {{temple}} and submit signed comments through the {{bell}}. The clerk will attach every response to the public record, including those delivered by familiar.`,
    `Officials will review the change after {{number:2-8}} marketdays and publish separate figures for the {{direction}} ward and the rest of {{location}}.`,
  ],
  guilds: [
    `Guild ledgers place the immediate value of the affected work at {{gold}}, with orders from {{region}} still waiting. Masters disagree over whether the delay can be recovered before {{festival}}.`,
    `"{{choice:The craft cannot be hurried past safety/Every apprentice deserves the same rule/A mark means nothing unless buyers can trust it/We can meet the order without lowering the standard}}," Master {{person4}} said while inspectors examined benches near {{street}}.`,
    `Journeyman {{person5}} offered a different account, saying the dispute began with {{choice:unpaid night work/a changed apprenticeship list/a shipment that failed inspection/new fees imposed without a chapter vote}}. {{organization}} has requested the underlying books.`,
    `Merchants have begun shifting orders toward {{location2}}, but carriers warn that the alternate route adds {{distance}} and at least {{number:2-6}} days. Prices for {{good}} rose {{percent}} by the closing bell.`,
    `A chapter meeting on {{weekday}} will consider temporary permits, apprentice relief and compensation for spoiled stock. Any agreement must be sealed by both the masters and the elected journeymen.`,
  ],
  crime: [
    `Investigators catalogued {{choice:wet boot marks/a torn strip of dark cloth/blue sealing wax/a scorched brass token}} near {{street}} and sent the material to {{organization}}. Officers would not say whether it belongs to a suspect or a witness.`,
    `Captain {{person4}} said patrols are testing two competing timelines. "{{choice:We know how the route was entered/We have ruled out a random act/Someone prepared this carefully/The public is not in immediate danger}}," the captain said, declining to identify the person who supplied the key statement.`,
    `Shopkeeper {{person5}} recalled {{choice:a cart leaving without lamps/a stranger asking about the watch rota/a bell sounding between the proper hours/a shutter closing in an empty building}} shortly before the alarm. The Watch has asked neighbors to preserve receipts and door-ward records.`,
    `No charge has been filed. Under {{location}} law, seized objects must be presented to a magistrate by {{weekday}} or returned, unless the Watch obtains a sealed extension.`,
    `The inquiry now extends toward {{location2}}, where a description matching one witness account was entered in the {{direction}} gate book. Travelers should expect document checks but no general closure.`,
  ],
  arcane: [
    `Collegium readers recorded traces of {{spellSchool}}, {{spellSchool2}} and a third resonance they could not classify. The readings weakened when moved away from {{street}}, suggesting the effect is tied to place rather than weather.`,
    `Magister {{person4}} described the event as "{{choice:stable but not understood/unusual rather than unprecedented/contained for the present/consistent with a damaged ward}}." The distinction did little to thin the crowd behind the cordon.`,
    `A rival assessment from {{person5}} argues that {{artifact}} may be acting as a focus. {{organization}} has asked that the claim remain provisional until the object can be examined at noon and midnight.`,
    `Residents within {{number:2-9}} streets reported {{phenomenon}} during the same bell. Scribes are comparing those accounts against moon tables and spell registrations from {{region}}.`,
    `The survey continues through {{weekday}}. Until then, officials advise against loose metal, unattended familiars and any attempt to answer voices coming from sealed containers.`,
  ],
  trade: [
    `Market books show activity shifting {{percent}} from last week's level, while warehouse and exchange totals no longer agree. Smaller dealers say the posted average understates conditions in the {{direction}} ward.`,
    `Asked about the wider market, Factor {{person4}} cited {{choice:late barges/tighter credit/a failed inspection/uncertain tolls beyond the city}}. "{{choice:There is stock on the road/The market is anxious, not empty/Prices should settle after the next convoy/Buyers are paying for uncertainty}}," the factor said.`,
    `Carters represented by {{organization}} point to a separate delay at {{location2}}. Their ledger lists {{number:8-30}} wagons awaiting inspection, some since {{weekday}}, though no official has linked that backlog to the present report.`,
    `Buyers have begun dividing larger orders and asking for shorter payment terms. The adjustment may limit immediate losses, though guild rules restrict changes to certified contracts.`,
    `The exchange will publish revised weights, warehouse totals and foreign quotations after the {{bell}}. Coordinated false scarcity remains punishable by forfeiture and a hearing before the market court.`,
  ],
  travel: [
    `Road wardens list {{choice:a washed culvert/a leaning milestone/a damaged toll chain/fresh slides above the road}} as the principal obstacle. Crews from {{organization}} expect to clear one lane before {{weekday}} if the weather holds.`,
    `Courier {{person4}} completed the route in {{number:5-20}} hours and called conditions "{{choice:slow but passable/unsafe after dark/better than the rumors/worse beyond the second bridge}}." The courier advised carrying rope and an extra axle pin.`,
    `Travelers arriving from {{location2}} reported {{choice:false direction markers/unlicensed toll collectors/animal tracks around camps/lanterns moving off the road}}. The accounts agree on the location but differ on the number involved.`,
    `Coaches now assemble in groups at {{inn}} and depart under escort at the {{bell}}. Seats are limited, and priority goes to healers, official messengers and passengers already delayed.`,
    `The next formal route report will be posted at both gates. Until then, the river road adds {{distance}} but avoids the disputed stretch through {{region}}.`,
  ],
  weather: [
    `Observers at {{temple}} measured the disturbance for {{number:3-14}} consecutive bells. Their instruments agree on its direction and duration, though one rain gauge recorded three inches of feathers.`,
    `Almanac keeper {{person4}} said the pattern resembles an entry from {{number:80-400}} years ago. "{{choice:The old account ends before the explanation/The signs are rare, not necessarily dangerous/We should prepare without inventing a prophecy/The river level matters more than the color of the clouds}}," the keeper said.`,
    `Farmers beyond {{location2}} are covering seedlings, moving stock uphill and marking wells. {{organization}} has released reserve canvas and {{number:20-90}} lanterns.`,
    `Sailings remain suspended between the {{direction}} quay and {{region}}. Ferrymen will reassess visibility at the {{bell}}, when the tide and the predicted wind change coincide.`,
    `The public should report {{phenomenon2}} to the watch-house with the exact bell and direction observed. Officials asked residents not to collect fallen material until it has been tested.`,
  ],
  society: [
    `The guest book records {{number:40-180}} names, though several entries are initials and one is a sketch of {{creature|article}}. Hosts insist the list was closed before invitations began appearing in the wrong hands.`,
    `A guest identified as {{person4}} described the evening as "{{choice:carefully arranged and immediately unpredictable/more political than festive/excellent until the second toast/less secret than everyone hoped}}." The guest declined to discuss the exchange near the conservatory.`,
    `Two households issued matching statements through {{organization}}, an unusual step that quieted one rumor while encouraging three others. Neither statement addressed the carriage seen leaving for {{location2}}.`,
    `Dressmakers, florists and musicians along {{street}} report orders tied to a second gathering on {{weekday}}. No host has claimed it, and the hall named on the cards is presently empty.`,
    `Whatever the private consequences, the public effect is already visible: charity pledges rose, dinner reservations shifted and every available {{color}} ribbon sold before noon.`,
  ],
  culture: [
    `The program credits {{number:20-80}} performers, makers and copyists, including apprentices from {{organization}}. Several worked through the night after a late change to the final scene.`,
    `Critic {{person4}} called the work "{{choice:undisciplined but impossible to ignore/formally daring and emotionally exact/more spectacle than argument/the strongest opening seen this season}}." The morning edition of a rival paper reached the opposite conclusion.`,
    `Audience member {{person5}} singled out {{choice:the silent procession/the painted storm/the final courtroom speech/the music beneath the closing tableau}}. That detail was not listed in the program and may change before {{weekday}}.`,
    `Ticket sellers on {{street}} reported a line before dawn. Seats now change hands for {{silver}}, prompting the theatre to add a matinee and warn against forged brass tokens.`,
    `The production next travels to {{location2}}, then through {{region}}. Scenery will go by barge because the largest piece cannot pass beneath the {{direction}} gate.`,
  ],
  adventure: [
    `The public file identifies three likely hazards: unstable ground, uncertain wards and long stretches beyond regular patrols. It leaves several pages sealed at the sponsor's request.`,
    `Veteran guide {{person4}} reviewed the known route and called the available purse "{{choice:fair if the map is current/low for winter travel/generous enough to invite trouble/only the first cost}}." The guide recommended no fewer than {{number:4-8}} capable travelers.`,
    `Traveler {{person5}}, who recently crossed the surrounding country, reported {{choice:doors closing in sequence/fresh campfires with no travelers/voices repeating old watchwords/a bridge that returned travelers to the same bank}}. No second witness has confirmed the account.`,
    `Anyone joining an official search, escort or expedition must register next of kin and declared magic at {{inn}}. {{organization}} will hold duplicate instructions until the party returns.`,
    `A follow-up party is expected on {{weekday}} at the {{bell}}, weather permitting. The road toward {{location2}} offers the last reliable provisions before the route enters {{region}}.`,
  ],
  notices: [
    `Applicants or claimants must give a full name, two references and a reliable address in {{location}}. Marks made by proxy, familiar or summoned hand require a witness.`,
    `Questions may be directed to {{person4}} at {{street}} between the {{bell}} and sunset. Please bring the original notice because copies have begun adding their own conditions.`,
    `Fees are payable in coin, certified guild note or goods by prior agreement. Offers involving {{artifact}}, future favors or unspecified treasure shares will not be considered.`,
    `The notice remains in force through {{weekday}} unless filled, withdrawn or superseded by a proclamation bearing the seal of {{organization}}.`,
    `Those traveling from {{location2}} should allow extra time at the {{direction}} gate. The issuing office accepts no responsibility for missed bells, awakened property or unlicensed escorts.`,
  ],
};

const toneBridges: Record<StoryTone, readonly string[]> = {
  straight: [
    "Records reviewed for this report establish the broad sequence, though several times remain approximate.",
    "The available accounts agree on the central event and diverge on what caused it.",
    "Officials released a preliminary chronology while emphasizing that the inquiry remains open.",
    "Interviews and posted notices support the main outline, with further documentation expected.",
  ],
  sensational: [
    "By nightfall, the incident had become the only subject in the markets, taverns and gate queues.",
    "Rumor outran the Watch before noon, carrying increasingly lurid versions into every ward.",
    "Not since last winter's tower fire has a single report seized {{location}} so completely.",
    "Crowds pressed against the cordon as each new scrap of information produced fresh alarm.",
  ],
  gossipy: [
    "Those claiming not to be interested nevertheless supplied this paper with the most exact details.",
    "The official account is brief; the account repeated over luncheon is considerably more elaborate.",
    "No name appears in the notice, a courtesy that has done little to conceal the names involved.",
    "By afternoon, every drawing room in {{location}} possessed a different confidential version.",
  ],
  ominous: [
    "The official notice answers when and where. It does not attempt to answer why.",
    "Several witnesses ended their accounts at the same detail and would not explain their silence.",
    "The cordon remains in place after dark, when the reported signs are said to become clearer.",
    "Authorities call the situation contained. They have not said what, precisely, is being contained.",
  ],
};

export function recipeParagraphs(category: Category, tone: StoryTone, rng: Rng) {
  const categoryPool = [...recipes[category]];
  const categorySelections: string[] = [];
  while (categoryPool.length && categorySelections.length < 4) {
    categorySelections.push(categoryPool.splice(Math.floor(rng() * categoryPool.length), 1)[0]);
  }
  if (category === "notices") return categorySelections;
  return [
    pick(rng, toneBridges[tone]),
    categorySelections[0],
    pick(rng, sharedSourceParagraphs),
    ...categorySelections.slice(1),
  ];
}

export function arrangeParagraphs(base: string[], extras: string[], length: StoryLength, rng: Rng) {
  if (length === "brief") return [base[0], base[2] ?? base[1]].filter(Boolean);
  if (length === "standard") {
    return rng() < 0.5
      ? [base[0], base[1], extras[0], extras[1], base[2]].filter(Boolean)
      : [base[0], extras[0], base[1], extras[1], base[2]].filter(Boolean);
  }
  return rng() < 0.5
    ? [base[0], base[1], extras[0], extras[1], extras[2], extras[3], extras[4], base[2]].filter(Boolean)
    : [base[0], extras[0], base[1], extras[1], extras[2], extras[3], extras[4], base[2]].filter(Boolean);
}
