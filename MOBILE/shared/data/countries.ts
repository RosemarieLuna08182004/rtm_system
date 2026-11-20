/**
 * Locations where apps can be distributed on Google Play, from
 * https://play.google.com/supported-locations (version 2026/01, published 2026-09-28).
 * "Rest of the world" is not included.
 *
 * Same list as backend/src/shared/data/countries.ts (which checks sign-ups); keep in sync.
 */
export interface Country { Code: string; Name: string; Purchases: boolean }

const RAW: Array<[string, string, 0 | 1]> = [
  ["AG","Antigua & Barbuda",1],["AR","Argentina",1],["AW","Aruba",1],["BS","Bahamas",1],["BZ","Belize",1],["BM","Bermuda",1],["BO","Bolivia",1],["BR","Brazil",1],["VG","British Virgin Islands",1],["CA","Canada",1],["KY","Cayman Islands",1],["CL","Chile",1],["CO","Colombia",1],["CR","Costa Rica",1],["CU","Cuba",0],["DM","Dominica",1],["DO","Dominican Republic",1],["EC","Ecuador",1],["SV","El Salvador",1],["GD","Grenada",1],["GT","Guatemala",1],["HT","Haiti",1],["HN","Honduras",1],["JM","Jamaica",1],["MX","Mexico",1],["NI","Nicaragua",1],["PA","Panama",1],["PY","Paraguay",1],["PE","Peru",1],["KN","St. Kitts & Nevis",1],["LC","St. Lucia",1],["TT","Trinidad & Tobago",1],["TC","Turks & Caicos Islands",1],["US","United States",1],["UY","Uruguay",1],["VE","Venezuela",1],
  ["AL","Albania",1],["DZ","Algeria",1],["AO","Angola",1],["AM","Armenia",1],["AT","Austria",1],["AZ","Azerbaijan",1],["BH","Bahrain",1],["BY","Belarus",1],["BE","Belgium",1],["BJ","Benin",1],["BA","Bosnia & Herzegovina",1],["BW","Botswana",1],["BG","Bulgaria",1],["BF","Burkina Faso",1],["CM","Cameroon",1],["CV","Cape Verde",1],["TD","Chad",1],["KM","Comoros",1],["CG","Congo - Brazzaville",1],["CD","Congo - Kinshasa",1],["HR","Croatia",1],["CY","Cyprus",1],["CZ","Czechia",1],["CI","Côte d’Ivoire",1],["DK","Denmark",1],["DJ","Djibouti",1],["EG","Egypt",1],["ER","Eritrea",1],["EE","Estonia",1],["ET","Ethiopia",1],["FI","Finland",1],["FR","France",1],["GA","Gabon",1],["GM","Gambia",1],["GE","Georgia",1],["DE","Germany",1],["GH","Ghana",1],["GI","Gibraltar",1],["GR","Greece",1],["GN","Guinea",1],["GW","Guinea-Bissau",1],["HU","Hungary",1],["IS","Iceland",1],["IR","Iran",0],["IQ","Iraq",1],["IE","Ireland",1],["IL","Israel",1],["IT","Italy",1],["JO","Jordan",1],["KZ","Kazakhstan",1],["KE","Kenya",1],["KW","Kuwait",1],["KG","Kyrgyzstan",1],["LV","Latvia",1],["LB","Lebanon",1],["LR","Liberia",1],["LY","Libya",1],["LI","Liechtenstein",1],["LT","Lithuania",1],["LU","Luxembourg",1],["ML","Mali",1],["MT","Malta",1],["MU","Mauritius",1],["MD","Moldova",1],["MC","Monaco",1],["MA","Morocco",1],["MZ","Mozambique",1],["NA","Namibia",1],["NL","Netherlands",1],["NE","Niger",1],["NG","Nigeria",1],["MK","North Macedonia",1],["NO","Norway",1],["OM","Oman",1],["PL","Poland",1],["PT","Portugal",1],["QA","Qatar",1],["RO","Romania",1],["RU","Russia",0],["RW","Rwanda",1],["SM","San Marino",1],["SA","Saudi Arabia",1],["SN","Senegal",1],["RS","Serbia",1],["SC","Seychelles",1],["SL","Sierra Leone",1],["SK","Slovakia",1],["SI","Slovenia",1],["SO","Somalia",1],["ZA","South Africa",1],["ES","Spain",1],["SD","Sudan",0],["SR","Suriname",1],["SE","Sweden",1],["CH","Switzerland",1],["TJ","Tajikistan",1],["TZ","Tanzania",1],["TG","Togo",1],["TN","Tunisia",1],["TM","Turkmenistan",1],["TR","Türkiye",1],["UG","Uganda",1],["UA","Ukraine",1],["AE","United Arab Emirates",1],["GB","United Kingdom",1],["UZ","Uzbekistan",1],["VA","Vatican City",1],["YE","Yemen",1],["ZM","Zambia",1],["ZW","Zimbabwe",1],
  ["AU","Australia",1],["BD","Bangladesh",1],["KH","Cambodia",1],["CN","China",0],["FJ","Fiji",1],["HK","Hong Kong",1],["IN","India",1],["ID","Indonesia",1],["JP","Japan",1],["LA","Laos",1],["MO","Macao",1],["MY","Malaysia",1],["MV","Maldives",1],["FM","Micronesia",1],["MN","Mongolia",1],["MM","Myanmar (Burma)",1],["NP","Nepal",1],["NZ","New Zealand",1],["PK","Pakistan",1],["PG","Papua New Guinea",1],["PH","Philippines",1],["WS","Samoa",1],["SG","Singapore",1],["SB","Solomon Islands",1],["KR","South Korea",1],["LK","Sri Lanka",1],["TW","Taiwan",1],["TH","Thailand",1],["TO","Tonga",1],["VU","Vanuatu",1],["VN","Vietnam",1],
];

/** Sorted by name, for drop-downs. */
export const COUNTRIES: Country[] = RAW
  .map(([Code, Name, Purchases]) => ({ Code, Name, Purchases: Purchases === 1 }))
  .sort((a, b) => a.Name.localeCompare(b.Name));

export const COUNTRY_CODES: string[] = COUNTRIES.map((c) => c.Code);

export const countryName = (code?: string | null) => COUNTRIES.find((c) => c.Code === code)?.Name ?? null;

/** Flag emoji from the two-letter code (regional indicator letters). */
export const countryFlag = (code?: string | null) =>
  code && /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';

/**
 * Best guess of the user's country from the phone's language/region setting
 * (e.g. "en-PH" -> PH), used to pre-fill sign-up. Null if it isn't on the list.
 */
export const deviceCountry = (): string | null => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    const region = /[-_]([A-Z]{2})/.exec(locale)?.[1] ?? null;
    return region && COUNTRY_CODES.includes(region) ? region : null;
  } catch {
    return null;
  }
};
