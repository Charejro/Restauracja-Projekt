/* ===================================================================
   Portowa Fala — dane menu (wspólne dla wszystkich podstron)
   =================================================================== */
window.MENU = {
  zupy: [
    { id: "z1", name: "Zupa rybna po kaszubsku", price: 24, desc: "wywar z ryb z portu, ziemniaki, koperek, śmietana", tag: "specjał domu" },
    { id: "z2", name: "Żurek kaszubski", price: 26, desc: "na zakwasie z chleba, jajko, biała kiełbasa", tag: "" },
    { id: "z3", name: "Chłodnik z botwiną", price: 22, desc: "kefir, botwina, ogórek, rzodkiewka, jajko", tag: "na ciepłe dni" },
    { id: "z4", name: "Rosół z makaronem", price: 20, desc: "wolno gotowany drób, makaron domowy, marchew", tag: "" },
    { id: "z5", name: "Krem z dyni z pestką", price: 24, desc: "dynia z Kaszub, imbir, pestki, śmietana", tag: "wegetariańska" }
  ],
  obiad: [
    { id: "o1", name: "Dorsz po kaszubsku", price: 58, desc: "dorsz świeży, sos z kurek, jajko, ziemniaki z koperkiem", tag: "specjał domu" },
    { id: "o2", name: "Sandacz na maśle", price: 62, desc: "filet z sandacza, masło cytrynowe, warzywa z patelni", tag: "polecane" },
    { id: "o3", name: "Ryba z dnia z grilla", price: 54, desc: "połowu z portu, cytryna, czosnek, zioła", tag: "zmienne" },
    { id: "o4", name: "Krewetki w czosnku", price: 52, desc: "krewetki, masło czosnkowe, chili, bagietka", tag: "" },
    { id: "o5", name: "Placki ziemniaczane po kaszubsku", price: 38, desc: "ze smażoną rybą lub sosem grzybowym", tag: "wegetariańska opcja" },
    { id: "o6", name: "Kotlet z indyka z kurkami", price: 48, desc: "panierowany indyk, sos kurkowy, ziemniaki", tag: "" },
    { id: "o7", name: "Pierogi z rybą", price: 42, desc: "ręcznie lepione, farsz z dorsza, okrasa cebulowa", tag: "" }
  ],
  dodatki: [
    { id: "d1", name: "Frytki", price: 14, desc: "grube, chrupiące, z solą morską", tag: "" },
    { id: "d2", name: "Ziemniaki z koperkiem", price: 12, desc: "młode ziemniaki, masło, koperek", tag: "" },
    { id: "d3", name: "Kluski śląskie", price: 14, desc: "8 sztuk, z prażoną cebulką", tag: "" },
    { id: "d4", name: "Surówka z kapusty", price: 10, desc: "kapusta, marchew, sos kolendrowy", tag: "" },
    { id: "d5", name: "Buraczki zasmażane", price: 12, desc: "buraczki, śmietana, chrzan", tag: "" },
    { id: "d6", name: "Pieczywo czosnkowe", price: 12, desc: "domowe, masło ziołowe, czosnek", tag: "" },
    { id: "d7", name: "Ryż z warzywami", price: 10, desc: "basmati, marchew, groszek, kukurydza", tag: "" }
  ],
  desery: [
    { id: "de1", name: "Sernik kaszubski", price: 22, desc: "na palonym twarogu, z rodzynkami", tag: "specjał domu" },
    { id: "de2", name: "Szarlotka z lodami", price: 24, desc: "ciepła, z lodami waniliowymi i cynamonem", tag: "" },
    { id: "de3", name: "Panna cotta z maliną", price: 26, desc: "śmietankowa, z sosem malinowym", tag: "" },
    { id: "de4", name: "Lody domowe (3 gałki)", price: 18, desc: "waniliowe, czekoladowe, truskawkowe", tag: "" },
    { id: "de5", name: "Pączki z konfiturą", price: 16, desc: "3 sztuki, różyczkowa konfitura", tag: "" }
  ],
  napoje: [
    { id: "n1", name: "Kompot domowy", price: 12, desc: "sezonowe owoce, 0,4 l", tag: "" },
    { id: "n2", name: "Lemonada", price: 14, desc: "cytryna, mięta, lód, 0,4 l", tag: "" },
    { id: "n3", name: "Woda mineralna", price: 8, desc: "gazowana / niegazowana, 0,5 l", tag: "" },
    { id: "n4", name: "Kawa z ekspresu", price: 12, desc: "espresso / americano / cappuccino", tag: "" },
    { id: "n5", name: "Herbata", price: 10, desc: "wybór z 6 gatunków", tag: "" },
    { id: "n6", name: "Sok wyciskany", price: 10, desc: "pomarańczowy / jabłkowy, 0,25 l", tag: "" },
    { id: "n7", name: "Piwo regionalne", price: 14, desc: "kaszubskie, 0,5 l", tag: "" }
  ]
};

window.MENU_TAGS = {
  zupy: "Zupy",
  obiad: "Obiad główny",
  dodatki: "Dodatki do obiadu",
  desery: "Desery",
  napoje: "Napoje"
};

window.findMenuItem = function (id) {
  const menu = window.MENU || {};
  for (const cat of Object.keys(menu)) {
    const hit = menu[cat].find((x) => x.id === id);
    if (hit) return hit;
  }
  return null;
};
