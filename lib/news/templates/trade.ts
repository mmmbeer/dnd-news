import { defineTemplates } from "./shared";

export const tradeTemplates = defineTemplates("trade", [
  {
    id: "trade-prices", title: "{{good|title}} Prices Rise {{percent}}", dramaticTitle: "{{good|title}} Panic Grips the Markets", kicker: "Markets",
    dek: "Caravan delays in {{region}} squeeze supplies while brokers dispute the cause.", illustrationId: "merchant-scales",
    paragraphs: ["{{good|title}} opened sharply higher after three caravans failed to arrive from {{region}}.", "Factors blamed weather, banditry and unhelpful divination in equal measure.", "Households are advised that substitutes remain available, though ordinary pepper cannot safely replace dragon pepper."],
  },
  {
    id: "trade-market-fair", title: "{{location}} Market Fair Opens {{weekday}}", dramaticTitle: "Rare Goods Draw Record Crowds to {{location}}", kicker: "Market Guide",
    dek: "More than {{number:40-180}} stalls will fill {{street}} from dawn to dusk.", illustrationId: "market-stall",
    paragraphs: ["Traders from {{region}} began raising striped awnings yesterday for the seasonal fair.", "Featured goods include {{good}}, bottled weather and maps guaranteed accurate for at least a week.", "The Watch warns buyers to count change and confirm that purchased containers are not larger inside."],
  },
  {
    id: "trade-coin-shortage", title: "Small Coin Shortage Hits {{location}}", dramaticTitle: "No Change: Copper Vanishes From City Tills", kicker: "Money Desk",
    dek: "Merchants turn to wooden tallies, favors and increasingly creative arithmetic.", illustrationId: "coin-purse",
    paragraphs: ["Banks report that copper deposits fell by {{percent}} over three marketdays without a matching rise in spending.", "Shopkeepers on {{street}} now offer sweetcakes or string in lieu of small change.", "Mint official {{person}} promises a new shipment by {{weekday}} and denies rumors that the old coins walked away."],
  },
  {
    id: "trade-ship", title: "Long-Delayed Cargo Ship Reaches {{location}}", dramaticTitle: "Ghost-Lit Vessel Returns After {{number:5-40}} Years", kicker: "Shipping News",
    dek: "The {{color}}-sailed ship carries {{good}} and a crew with conflicting dates.", illustrationId: "cargo-ship",
    paragraphs: ["Harbor pilots guided the vessel to the {{direction}} quay shortly before dawn.", "Its manifest lists {{number:20-90}} tons of {{good}}, all dry and recently packed. The captain insists the voyage lasted twelve days.", "Customs has sealed the hold while archivists compare names on the crew list."],
  },
  {
    id: "trade-counterfeit", title: "Inspectors Seize False {{good|title}}", dramaticTitle: "Counterfeit Cargo Reaches {{number:8-40}} Shops", kicker: "Buyer Beware",
    dek: "The imitation looks convincing but dissolves in moonlight.", illustrationId: "spice-sack",
    paragraphs: ["Market wardens traced the suspect goods to a rented warehouse near {{street}}.", "No injuries are reported, though one cook says the imitation {{good}} insulted the soup.", "Refund claims require a receipt, a sample and a witness who saw the item before sunset."],
  },
  {
    id: "trade-auction", title: "Royal Auction Lists {{artifact|title}}", dramaticTitle: "Bidders Circle Impossible Relic", kicker: "Auction Block",
    dek: "The recovered object opens for bidding at {{gold}}.", illustrationId: "merchant-scales",
    paragraphs: ["The Crown Office will auction confiscated and unclaimed property in {{location}} on {{weekday}}.", "The catalog's final lot is {{artifact}}, described as stable when properly complimented.", "Prospective bidders must register before noon and sign a waiver covering curses, heirs and reversed causality."],
  },
  {
    id: "trade-pact", title: "{{region|title}} Merchants Sign New Trade Pact", dramaticTitle: "Old Rivals Open Gates to Rival Goods", kicker: "Commerce",
    dek: "The agreement cuts tolls on {{good}} and standardizes caravan seals.", illustrationId: "market-stall",
    paragraphs: ["Delegates signed the compact at {{inn}} after {{number:3-12}} days of negotiation.", "Tolls on {{good}} fall immediately, while rules for enchanted livestock take effect next month.", "Merchants expect lower prices by winter. Teamsters expect longer forms by tomorrow."],
  },
  {
    id: "trade-warehouse-fire", title: "Warehouse Fire Contained at {{location}} Quay", dramaticTitle: "{{color|title}} Flames Consume River Stores", kicker: "Commerce Alert",
    dek: "Fire crews save neighboring stock after {{good}} ignites unexpectedly.", illustrationId: "cargo-ship",
    paragraphs: ["The fire began shortly after the {{bell}} in a sealed stack of imported {{good}}.", "Bucket crews and two water elementals contained the blaze before it reached the ropewalk.", "Losses may reach {{gold}}. Inspectors are testing whether the cargo was declared accurately."],
  },
  {
    id: "trade-tariff", title: "Council Cuts {{good|title}} Tariff", dramaticTitle: "Market Winners and Losers After Sudden Tax Cut", kicker: "Rates & Duties",
    dek: "The new schedule lowers border charges by {{percent}}.", illustrationId: "coin-purse",
    paragraphs: ["The revised tariff takes effect at every gate on {{weekday}}.", "Importers welcomed the cut, while local producers demanded relief from rents and magical inspection fees.", "Customs clerks warn that goods already seized cannot be declared retroactively, even with a very good explanation."],
  },
  {
    id: "trade-night-market", title: "Night Market Returns to {{street}}", dramaticTitle: "After-Dark Bazaar Offers Goods Best Left Unnamed", kicker: "After Hours",
    dek: "Licensed stalls may trade until the {{bell}} beneath new lantern wards.", illustrationId: "spice-sack",
    paragraphs: ["The market reopens after a year's closure with {{number:20-70}} approved vendors.", "Permitted wares include {{good}}, dream ink and minor charms that stop working by breakfast.", "Unlabeled bottles, bottled shadows and contracts written on skin remain prohibited."],
  },
]);
