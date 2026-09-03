import { defineTemplates } from "./shared";

export const crimeTemplates = defineTemplates("crime", [
  {
    id: "crime-archive", title: "Watch Seeks Leads in Archive Theft", dramaticTitle: "{{artifact|title}} Vanishes Behind Locked Doors", kicker: "Watch Report",
    dek: "No lock was broken, but witnesses report the odor of {{creature|article}}.", illustrationId: "watch-lantern",
    paragraphs: ["The night watch sealed the lower archive in {{location}} after the disappearance of {{artifact}}.", "Investigators recovered blue wax, wet footprints and a feather that refuses to fall. Captain {{person}} declined to name a suspect.", "A reward of {{gold}} has been posted. Citizens should not approach anyone selling objects that whisper after sunset."],
  },
  {
    id: "crime-rooftops", title: "Rooftop Burglar Eludes Watch Again", dramaticTitle: "The {{color|title}} Magpie Strikes Above {{street}}", kicker: "Crime Desk",
    dek: "A masked thief crosses six roofs and leaves a silver feather behind.", illustrationId: "rooftop-chase",
    paragraphs: ["Residents woke to whistles as Watch officers pursued a lone figure over the roofs of {{street}}.", "The thief escaped with {{artifact}} from a locked upper room. No ground-floor door was opened.", "Captain {{person}} asks chimney sweeps, gargoyles and unusually observant pigeons to report what they saw."],
  },
  {
    id: "crime-jailbreak", title: "{{number:2-9}} Prisoners Escape {{location}} Gaol", dramaticTitle: "Cell Door Opens Itself at Midnight", kicker: "Breaking News",
    dek: "The Watch searches the {{direction}} ward after an impossible escape.", illustrationId: "prison-bars",
    paragraphs: ["A barred cell stood open at the {{bell}}, though its key remained on Warden {{person}}'s belt.", "The escapees include a forger, two smugglers and {{creature|article}} held as evidence.", "Road checks remain in place. The public should report discarded uniforms and doors behaving helpfully."],
  },
  {
    id: "crime-poison", title: "Banquet Guests Recover After Poison Scare", dramaticTitle: "{{color|title}} Wine Fells {{number:8-30}} at Noble Feast", kicker: "Investigation",
    dek: "Healers identify a rare sleeping draught but no clear target.", illustrationId: "evidence-dagger",
    paragraphs: ["Guests at {{inn}} collapsed during the final toast and awoke three hours later speaking in rhyme.", "Watch alchemists found traces of dreamroot in a single decanter. Host {{person}} denies knowing how it arrived.", "The kitchen staff were released. A hooded server seen leaving by {{street}} remains sought."],
  },
  {
    id: "crime-smugglers", title: "Smuggling Tunnel Found Beneath {{street}}", dramaticTitle: "Secret Road Runs Under Watch Headquarters", kicker: "Watch Report",
    dek: "Crates of {{good}} and a ledger point to a wider network.", illustrationId: "thieves-mask",
    paragraphs: ["Inspectors opened a cellar wall and found a brick passage running {{distance}} toward the river.", "Inside were false-bottom crates, {{silver}} and uniforms from three merchant houses.", "The Watch made {{number:3-14}} arrests. Officials will not confirm whether the tunnel has a second, smaller tunnel."],
  },
  {
    id: "crime-missing-evidence", title: "Evidence Room Emptied During Shift Change", dramaticTitle: "Watch Vault Robbed From the Inside", kicker: "Exclusive",
    dek: "Sealed exhibits disappear while every guard remembers standing at the door.", illustrationId: "watch-lantern",
    paragraphs: ["{{number:8-24}} exhibits vanished from the {{location}} watch-house between bells.", "Missing items include {{artifact}}, a bloodless dagger and a jar labeled not to be opened.", "Commander {{person}} has suspended the duty roster and ordered memory checks for the entire night shift."],
  },
  {
    id: "crime-graves", title: "Watch Detains Suspects Near Old Cemetery", dramaticTitle: "Grave Lanterns Lead to Midnight Arrests", kicker: "Night Watch",
    dek: "Shovels, spell chalk and a rented cart were recovered outside {{temple}}.", illustrationId: "prison-bars",
    paragraphs: ["Patrols stopped {{number:2-7}} cloaked figures leaving the cemetery shortly before dawn.", "The suspects claim to be historians conducting urgent soil research. None could name their university.", "Clerics are checking the affected graves. Families will be contacted privately if anything is missing or newly added."],
  },
  {
    id: "crime-forged-warrants", title: "Forged Warrants Used in Merchant Raids", dramaticTitle: "False Watch Squad Sweeps {{location}} Shops", kicker: "Public Warning",
    dek: "Impostors in borrowed uniforms seize coin and enchanted stock.", illustrationId: "evidence-dagger",
    paragraphs: ["At least {{number:4-12}} shops admitted a squad carrying warrants stamped with a convincing false seal.", "The impostors took coin, {{good}} and customer ledgers before leaving by cart.", "Real officers will now present a brass token that grows warm when named. Merchants should still read every warrant."],
  },
  {
    id: "crime-highway", title: "Bandit Captain Captured on {{location}} Road", dramaticTitle: "Masked Terror of {{region|title}} Unmasked", kicker: "Road Watch",
    dek: "A broken axle ends a {{number:6-30}}-week pursuit.", illustrationId: "rooftop-chase",
    paragraphs: ["Watch riders arrested the bandit known as the {{color|title}} Fox after a coach wheel failed near the old quarry.", "The suspect, {{person}}, carried {{gold}} and three sets of contradictory identification papers.", "A hearing is set for {{weekday}}. Travelers are warned that several members of the gang remain free."],
  },
  {
    id: "crime-mimic", title: "Furniture Thief Revealed as Mimic", dramaticTitle: "Stolen Chest Eats Its Captor", kicker: "Strange Crime",
    dek: "A burglary on {{street}} ends with an unusual arrest and several bite marks.", illustrationId: "thieves-mask",
    paragraphs: ["Officers cornered a suspected thief carrying a stolen chest through an alley near {{inn}}.", "When ordered to set it down, the chest bit the suspect and attempted to flee on six narrow legs.", "Both are in custody. The Watch has not decided whether the mimic is evidence, accomplice or victim."],
  },
]);
