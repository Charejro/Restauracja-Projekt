/* ===================================================================
   Portowa Fala — dane menu (PL + EN), wspólne dla wszystkich podstron
   =================================================================== */
window.MENU = {
  zupy: [
    { id: "z1", name: "Zupa rybna po kaszubsku", nameEn: "Kashubian fish soup", price: 24,
      desc: "wywar z ryb z portu, ziemniaki, koperek, śmietana", descEn: "broth from the port's fish, potatoes, dill, cream", tag: "specjał domu" },
    { id: "z2", name: "Żurek kaszubski", nameEn: "Kashubian żurek (sour rye soup)", price: 26,
      desc: "na zakwasie z chleba, jajko, biała kiełbasa", descEn: "rye sourdough, egg, white sausage", tag: "" },
    { id: "z3", name: "Chłodnik z botwiną", nameEn: "Chilled beetroot soup", price: 22,
      desc: "kefir, botwina, ogórek, rzodkiewka, jajko", descEn: "kefir, beet leaves, cucumber, radish, egg", tag: "na ciepłe dni" },
    { id: "z4", name: "Rosół z makaronem", nameEn: "Broth with homemade noodles", price: 20,
      desc: "wolno gotowany drób, makaron domowy, marchew", descEn: "slow-cooked poultry, homemade noodles, carrot", tag: "" },
    { id: "z5", name: "Krem z dyni z pestką", nameEn: "Pumpkin cream soup with seeds", price: 24,
      desc: "dynia z Kaszub, imbir, pestki, śmietana", descEn: "Kashubian pumpkin, ginger, seeds, cream", tag: "wegetariańska" }
  ],
  obiad: [
    { id: "o1", name: "Dorsz po kaszubsku", nameEn: "Kashubian-style cod", price: 58,
      desc: "dorsz świeży, sos z kurek, jajko, ziemniaki z koperkiem", descEn: "fresh cod, chanterelle sauce, egg, potatoes with dill", tag: "specjał domu" },
    { id: "o2", name: "Sandacz na maśle", nameEn: "Pike-perch in lemon butter", price: 62,
      desc: "filet z sandacza, masło cytrynowe, warzywa z patelni", descEn: "pike-perch fillet, lemon butter, pan-fried vegetables", tag: "polecane" },
    { id: "o3", name: "Ryba z dnia z grilla", nameEn: "Catch of the day from the grill", price: 54,
      desc: "połowu z portu, cytryna, czosnek, zioła", descEn: "fresh from the port, lemon, garlic, herbs", tag: "zmienne" },
    { id: "o4", name: "Krewetki w czosnku", nameEn: "Garlic prawns", price: 52,
      desc: "krewetki, masło czosnkowe, chili, bagietka", descEn: "prawns, garlic butter, chilli, baguette", tag: "" },
    { id: "o5", name: "Placki ziemniaczane po kaszubsku", nameEn: "Kashubian potato pancakes", price: 38,
      desc: "ze smażoną rybą lub sosem grzybowym", descEn: "with fried fish or mushroom sauce", tag: "wegetariańska opcja" },
    { id: "o6", name: "Kotlet z indyka z kurkami", nameEn: "Turkey cutlet with chanterelles", price: 48,
      desc: "panierowany indyk, sos kurkowy, ziemniaki", descEn: "breaded turkey, chanterelle sauce, potatoes", tag: "" },
    { id: "o7", name: "Pierogi z rybą", nameEn: "Fish pierogi", price: 42,
      desc: "ręcznie lepione, farsz z dorsza, okrasa cebulowa", descEn: "handmade, cod filling, fried onion topping", tag: "" }
  ],
  dodatki: [
    { id: "d1", name: "Frytki", nameEn: "French fries", price: 14,
      desc: "grube, chrupiące, z solą morską", descEn: "thick, crispy, with sea salt", tag: "" },
    { id: "d2", name: "Ziemniaki z koperkiem", nameEn: "Potatoes with dill", price: 12,
      desc: "młode ziemniaki, masło, koperek", descEn: "young potatoes, butter, dill", tag: "" },
    { id: "d3", name: "Kluski śląskie", nameEn: "Silesian dumplings", price: 14,
      desc: "8 sztuk, z prażoną cebulką", descEn: "8 pieces, with fried onion", tag: "" },
    { id: "d4", name: "Surówka z kapusty", nameEn: "Cabbage salad", price: 10,
      desc: "kapusta, marchew, sos kolendrowy", descEn: "cabbage, carrot, coriander dressing", tag: "" },
    { id: "d5", name: "Buraczki zasmażane", nameEn: "Warm beetroot", price: 12,
      desc: "buraczki, śmietana, chrzan", descEn: "beetroot, cream, horseradish", tag: "" },
    { id: "d6", name: "Pieczywo czosnkowe", nameEn: "Garlic bread", price: 12,
      desc: "domowe, masło ziołowe, czosnek", descEn: "homemade, herb butter, garlic", tag: "" },
    { id: "d7", name: "Ryż z warzywami", nameEn: "Rice with vegetables", price: 10,
      desc: "basmati, marchew, groszek, kukurydza", descEn: "basmati, carrot, peas, sweetcorn", tag: "" }
  ],
  desery: [
    { id: "de1", name: "Sernik kaszubski", nameEn: "Kashubian cheesecake", price: 22,
      desc: "na palonym twarogu, z rodzynkami", descEn: "baked quark cheesecake with raisins", tag: "specjał domu" },
    { id: "de2", name: "Szarlotka z lodami", nameEn: "Apple pie with ice cream", price: 24,
      desc: "ciepła, z lodami waniliowymi i cynamonem", descEn: "warm, with vanilla ice cream and cinnamon", tag: "" },
    { id: "de3", name: "Panna cotta z maliną", nameEn: "Panna cotta with raspberry", price: 26,
      desc: "śmietankowa, z sosem malinowym", descEn: "creamy, with raspberry sauce", tag: "" },
    { id: "de4", name: "Lody domowe (3 gałki)", nameEn: "Homemade ice cream (3 scoops)", price: 18,
      desc: "waniliowe, czekoladowe, truskawkowe", descEn: "vanilla, chocolate, strawberry", tag: "" },
    { id: "de5", name: "Pączki z konfiturą", nameEn: "Doughnuts with jam", price: 16,
      desc: "3 sztuki, różyczkowa konfitura", descEn: "3 pieces, rose petal jam", tag: "" }
  ],
  napoje: [
    { id: "n1", name: "Kompot domowy", nameEn: "Homemade kompot", price: 12,
      desc: "sezonowe owoce, 0,4 l", descEn: "seasonal fruit, 0.4 l", tag: "" },
    { id: "n2", name: "Lemonada", nameEn: "Lemonade", price: 14,
      desc: "cytryna, mięta, lód, 0,4 l", descEn: "lemon, mint, ice, 0.4 l", tag: "" },
    { id: "n3", name: "Woda mineralna", nameEn: "Mineral water", price: 8,
      desc: "gazowana / niegazowana, 0,5 l", descEn: "sparkling / still, 0.5 l", tag: "" },
    { id: "n4", name: "Kawa z ekspresu", nameEn: "Espresso coffee", price: 12,
      desc: "espresso / americano / cappuccino", descEn: "espresso / americano / cappuccino", tag: "" },
    { id: "n5", name: "Herbata", nameEn: "Tea", price: 10,
      desc: "wybór z 6 gatunków", descEn: "choice of 6 blends", tag: "" },
    { id: "n6", name: "Sok wyciskany", nameEn: "Freshly squeezed juice", price: 10,
      desc: "pomarańczowy / jabłkowy, 0,25 l", descEn: "orange / apple, 0.25 l", tag: "" },
    { id: "n7", name: "Piwo regionalne", nameEn: "Regional beer", price: 14,
      desc: "kaszubskie, 0,5 l", descEn: "Kashubian, 0.5 l", tag: "" }
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
