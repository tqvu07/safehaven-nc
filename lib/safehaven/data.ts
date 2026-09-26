// Static UI reference data for the intake form (locations, structure types,
// storm scenario presets). All risk/shelter data now comes live from the
// SafeHaven NC FastAPI backend — see lib/safehaven/api.ts.

export type CountyId = 'orange' | 'durham' | 'wake' | 'mecklenburg' | 'buncombe' | 'new-hanover' | 'guilford'

export interface DemoLocation {
  id: string
  label: string
  coords: [number, number]
  county: CountyId
}

export interface NcCountyOption {
  id: string
  label: string
  coords: [number, number]
}

export const NC_BOUNDS: [[number, number], [number, number]] = [
  [33.84, -84.32],
  [36.59, -75.46],
]

export const DEMO_LOCATIONS: DemoLocation[] = [
  { id: 'chapel-hill', label: 'Chapel Hill (Orange Co)', coords: [35.9132, -79.0558], county: 'orange' },
  { id: 'raleigh', label: 'Downtown Raleigh (Wake Co)', coords: [35.7796, -78.6382], county: 'wake' },
  { id: 'charlotte', label: 'Charlotte (Mecklenburg Co)', coords: [35.2271, -80.8431], county: 'mecklenburg' },
  { id: 'asheville', label: 'Asheville (Buncombe Co)', coords: [35.5951, -82.5515], county: 'buncombe' },
  { id: 'wilmington', label: 'Wilmington (New Hanover Co)', coords: [34.2104, -77.8868], county: 'new-hanover' },
  { id: 'greensboro', label: 'Greensboro (Guilford Co)', coords: [36.0726, -79.7922], county: 'guilford' },
]

export const NC_COUNTY_OPTIONS: NcCountyOption[] = [
  { id: 'alamance', label: 'Alamance County', coords: [36.0956, -79.4378] },
  { id: 'alexander', label: 'Alexander County', coords: [35.9288, -81.1826] },
  { id: 'alleghany', label: 'Alleghany County', coords: [36.4891, -81.133] },
  { id: 'anson', label: 'Anson County', coords: [34.9989, -80.1116] },
  { id: 'ashe', label: 'Ashe County', coords: [36.4314, -81.516] },
  { id: 'avery', label: 'Avery County', coords: [36.0722, -81.9001] },
  { id: 'beaufort', label: 'Beaufort County', coords: [35.491, -76.966] },
  { id: 'bertie', label: 'Bertie County', coords: [36.0588, -77.016] },
  { id: 'bladen', label: 'Bladen County', coords: [34.6026, -78.565] },
  { id: 'brunswick', label: 'Brunswick County', coords: [34.035, -78.1668] },
  { id: 'buncombe', label: 'Buncombe County', coords: [35.5951, -82.5515] },
  { id: 'burke', label: 'Burke County', coords: [35.7487, -81.6934] },
  { id: 'cabarrus', label: 'Cabarrus County', coords: [35.4073, -80.6202] },
  { id: 'caldwell', label: 'Caldwell County', coords: [35.9638, -81.5469] },
  { id: 'camden', label: 'Camden County', coords: [36.3265, -76.0932] },
  { id: 'carteret', label: 'Carteret County', coords: [34.8469, -76.5332] },
  { id: 'caswell', label: 'Caswell County', coords: [36.4015, -79.3301] },
  { id: 'catawba', label: 'Catawba County', coords: [35.7247, -81.177] },
  { id: 'chatham', label: 'Chatham County', coords: [35.7205, -79.2394] },
  { id: 'cherokee', label: 'Cherokee County', coords: [35.1227, -83.9185] },
  { id: 'chowan', label: 'Chowan County', coords: [36.1328, -76.6124] },
  { id: 'clay', label: 'Clay County', coords: [35.0396, -83.7716] },
  { id: 'cleveland', label: 'Cleveland County', coords: [35.3303, -81.544] },
  { id: 'columbus', label: 'Columbus County', coords: [34.2478, -78.747] },
  { id: 'craven', label: 'Craven County', coords: [35.1111, -77.0842] },
  { id: 'cumberland', label: 'Cumberland County', coords: [35.0527, -78.8784] },
  { id: 'currituck', label: 'Currituck County', coords: [36.3548, -75.9396] },
  { id: 'dare', label: 'Dare County', coords: [35.8592, -75.8768] },
  { id: 'davidson', label: 'Davidson County', coords: [35.8042, -80.2639] },
  { id: 'davie', label: 'Davie County', coords: [35.9513, -80.5704] },
  { id: 'duplin', label: 'Duplin County', coords: [34.9538, -77.9584] },
  { id: 'durham', label: 'Durham County', coords: [35.994, -78.8986] },
  { id: 'edgecombe', label: 'Edgecombe County', coords: [35.9042, -77.6946] },
  { id: 'forsyth', label: 'Forsyth County', coords: [36.0896, -80.2446] },
  { id: 'franklin', label: 'Franklin County', coords: [36.0833, -78.2967] },
  { id: 'gaston', label: 'Gaston County', coords: [35.2793, -81.1853] },
  { id: 'gates', label: 'Gates County', coords: [36.4935, -76.7481] },
  { id: 'graham', label: 'Graham County', coords: [35.3773, -83.8209] },
  { id: 'granville', label: 'Granville County', coords: [36.3172, -78.6417] },
  { id: 'greene', label: 'Greene County', coords: [35.4848, -77.676] },
  { id: 'guilford', label: 'Guilford County', coords: [36.0726, -79.7922] },
  { id: 'halifax', label: 'Halifax County', coords: [36.3314, -77.6004] },
  { id: 'harnett', label: 'Harnett County', coords: [35.3718, -78.839] },
  { id: 'haywood', label: 'Haywood County', coords: [35.5343, -82.9911] },
  { id: 'henderson', label: 'Henderson County', coords: [35.3248, -82.4601] },
  { id: 'hertford', label: 'Hertford County', coords: [36.3274, -76.8624] },
  { id: 'hoke', label: 'Hoke County', coords: [35.019, -79.2215] },
  { id: 'hyde', label: 'Hyde County', coords: [35.5443, -76.176] },
  { id: 'iredell', label: 'Iredell County', coords: [35.8159, -80.861] },
  { id: 'jackson', label: 'Jackson County', coords: [35.2972, -83.189] },
  { id: 'johnston', label: 'Johnston County', coords: [35.5212, -78.3628] },
  { id: 'jones', label: 'Jones County', coords: [35.0128, -77.3891] },
  { id: 'lee', label: 'Lee County', coords: [35.4809, -79.1854] },
  { id: 'lenoir', label: 'Lenoir County', coords: [35.2607, -77.5694] },
  { id: 'lincoln', label: 'Lincoln County', coords: [35.4779, -81.149] },
  { id: 'macon', label: 'Macon County', coords: [35.1648, -83.4252] },
  { id: 'madison', label: 'Madison County', coords: [35.8426, -82.7135] },
  { id: 'martin', label: 'Martin County', coords: [35.9012, -77.2442] },
  { id: 'mcdowell', label: 'McDowell County', coords: [35.7142, -82.0616] },
  { id: 'mecklenburg', label: 'Mecklenburg County', coords: [35.2271, -80.8431] },
  { id: 'mitchell', label: 'Mitchell County', coords: [36.0282, -82.1885] },
  { id: 'montgomery', label: 'Montgomery County', coords: [35.3201, -79.8714] },
  { id: 'moore', label: 'Moore County', coords: [35.3395, -79.4371] },
  { id: 'nash', label: 'Nash County', coords: [35.9652, -77.9936] },
  { id: 'new-hanover', label: 'New Hanover County', coords: [34.2104, -77.8868] },
  { id: 'northampton', label: 'Northampton County', coords: [36.5129, -77.3976] },
  { id: 'onslow', label: 'Onslow County', coords: [34.873, -77.5533] },
  { id: 'orange', label: 'Orange County', coords: [35.9132, -79.0558] },
  { id: 'pamlico', label: 'Pamlico County', coords: [35.1578, -76.6879] },
  { id: 'pasquotank', label: 'Pasquotank County', coords: [36.2519, -76.2715] },
  { id: 'pender', label: 'Pender County', coords: [34.5528, -78.0747] },
  { id: 'perquimans', label: 'Perquimans County', coords: [36.1804, -76.4067] },
  { id: 'person', label: 'Person County', coords: [36.4017, -78.9898] },
  { id: 'pitt', label: 'Pitt County', coords: [35.6127, -77.366] },
  { id: 'polk', label: 'Polk County', coords: [35.271, -82.1883] },
  { id: 'randolph', label: 'Randolph County', coords: [35.7064, -79.8092] },
  { id: 'richmond', label: 'Richmond County', coords: [35.0364, -79.7852] },
  { id: 'robeson', label: 'Robeson County', coords: [34.6514, -79.024] },
  { id: 'rockingham', label: 'Rockingham County', coords: [36.3937, -79.7845] },
  { id: 'rowan', label: 'Rowan County', coords: [35.6683, -80.5544] },
  { id: 'rutherford', label: 'Rutherford County', coords: [35.3945, -81.9549] },
  { id: 'sampson', label: 'Sampson County', coords: [35.0106, -78.3316] },
  { id: 'scotland', label: 'Scotland County', coords: [34.8334, -79.4612] },
  { id: 'stanly', label: 'Stanly County', coords: [35.2731, -80.2343] },
  { id: 'stokes', label: 'Stokes County', coords: [36.4272, -80.2051] },
  { id: 'surry', label: 'Surry County', coords: [36.414, -80.7251] },
  { id: 'swain', label: 'Swain County', coords: [35.5028, -83.4811] },
  { id: 'transylvania', label: 'Transylvania County', coords: [35.1782, -82.8249] },
  { id: 'tyrrell', label: 'Tyrrell County', coords: [35.9143, -76.184] },
  { id: 'union', label: 'Union County', coords: [35.0142, -80.5096] },
  { id: 'vance', label: 'Vance County', coords: [36.3019, -78.3864] },
  { id: 'wake', label: 'Wake County', coords: [35.7796, -78.6382] },
  { id: 'warren', label: 'Warren County', coords: [36.4208, -78.1326] },
  { id: 'washington', label: 'Washington County', coords: [35.7508, -76.6174] },
  { id: 'wayne', label: 'Wayne County', coords: [35.3572, -77.9775] },
  { id: 'wilkes', label: 'Wilkes County', coords: [36.2228, -81.1381] },
  { id: 'wilson', label: 'Wilson County', coords: [35.722, -77.9149] },
  { id: 'yadkin', label: 'Yadkin County', coords: [36.176, -80.6582] },
  { id: 'yancey', label: 'Yancey County', coords: [35.9208, -82.3243] },
]

// Matches the backend's `structure_type` enum exactly.
export type StructureType = 'single_family' | 'multi_family' | 'mobile_home'

export const STRUCTURE_TYPES: { id: StructureType; label: string }[] = [
  { id: 'single_family', label: 'Single Family Home' },
  { id: 'multi_family', label: 'Multi-Family / Apartment' },
  { id: 'mobile_home', label: 'Manufactured / Mobile Home' },
]

export interface StormScenario {
  id: string
  label: string
  shortLabel: string
  /** Sent to the backend as `scenario_wind_mph` when this preset is selected. */
  windMph: number
}

export const STORM_SCENARIOS: StormScenario[] = [
  { id: 'ts', label: 'Tropical Storm', shortLabel: '50 mph', windMph: 50 },
  { id: 'cat1', label: 'Cat 1 Hurricane', shortLabel: '80 mph', windMph: 80 },
  { id: 'cat2', label: 'Cat 2 Hurricane', shortLabel: '105 mph', windMph: 105 },
  { id: 'ef2', label: 'Severe Tornado', shortLabel: 'EF2 · 125 mph', windMph: 125 },
]

export const HIGH_CAPACITY_THRESHOLD = 1000
