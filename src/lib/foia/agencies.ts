import { AgencyContact } from '@/types/foia';

export const AGENCIES_DATABASE: AgencyContact[] = [
  // FEDERAL AGENCIES
  {
    id: 'fed-fbi',
    name: 'Federal Bureau of Investigation (FBI / DOJ)',
    acronym: 'FBI',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Section Chief, Record/Information Dissemination Section',
    foiaEmail: 'foiparequest@fbi.gov',
    portalUrl: 'https://efoia.fbi.gov',
    portalType: 'FOIAonline',
    physicalAddress: '170 Marcel Drive, Winchester, VA 22602-4843',
    phone: '(540) 868-4593',
    verified: true
  },
  {
    id: 'fed-epa',
    name: 'Environmental Protection Agency',
    acronym: 'EPA',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'environmental',
    custodianTitle: 'National FOIA Officer',
    foiaEmail: 'hqfoia@epa.gov',
    portalUrl: 'https://foiaonline.gov',
    portalType: 'FOIAonline',
    physicalAddress: '1200 Pennsylvania Avenue NW, Washington, DC 20460',
    phone: '(202) 566-1667',
    verified: true
  },
  {
    id: 'fed-sec',
    name: 'Securities and Exchange Commission',
    acronym: 'SEC',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'regulatory',
    custodianTitle: 'Office of FOIA Services',
    foiaEmail: 'foiapa@sec.gov',
    portalUrl: 'https://www.sec.gov/foia',
    portalType: 'Custom',
    physicalAddress: '100 F Street NE, Washington, DC 20549',
    phone: '(202) 551-7900',
    verified: true
  },
  {
    id: 'fed-dod',
    name: 'Department of Defense (Office of the Secretary of Defense)',
    acronym: 'DOD',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'general',
    custodianTitle: 'Chief, Defense FOIA Division',
    foiaEmail: 'whs.mc-alex.esd.mbx.osd-js-foia-requester-service-center@mail.mil',
    portalUrl: 'https://www.esd.whs.mil/FOIA/Request',
    portalType: 'Custom',
    physicalAddress: '1155 Defense Pentagon, Washington, DC 20301-1155',
    phone: '(571) 372-0400',
    verified: true
  },
  {
    id: 'fed-faa',
    name: 'Federal Aviation Administration (DOT)',
    acronym: 'FAA',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'transportation',
    custodianTitle: 'National FOIA Office',
    foiaEmail: 'foia@faa.gov',
    portalUrl: 'https://www.foia.gov',
    portalType: 'FOIA.gov',
    physicalAddress: '800 Independence Ave SW, Washington, DC 20591',
    phone: '(202) 267-3481',
    verified: true
  },
  {
    id: 'fed-fda',
    name: 'Food and Drug Administration (HHS)',
    acronym: 'FDA',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'health_human_services',
    custodianTitle: 'Director, Division of Information Disclosure',
    foiaEmail: 'FDAFOIA@fda.hhs.gov',
    portalUrl: 'https://www.accessdata.fda.gov/scripts/foi/foiarequest/index.cfm',
    portalType: 'Custom',
    physicalAddress: '5630 Fishers Lane, Rockville, MD 20857',
    phone: '(301) 796-3900',
    verified: true
  },
  {
    id: 'fed-ftc',
    name: 'Federal Trade Commission',
    acronym: 'FTC',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'regulatory',
    custodianTitle: 'Office of General Counsel, FOIA Unit',
    foiaEmail: 'FOIA@ftc.gov',
    portalUrl: 'https://www.ftc.gov/about-ftc/foia',
    portalType: 'FOIA.gov',
    physicalAddress: '600 Pennsylvania Ave NW, Washington, DC 20580',
    phone: '(202) 326-2430',
    verified: true
  },
  {
    id: 'fed-dhs',
    name: 'Department of Homeland Security (HQ)',
    acronym: 'DHS',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Chief Privacy Officer / FOIA Officer',
    foiaEmail: 'foia@hq.dhs.gov',
    portalUrl: 'https://www.dhs.gov/dhs-foia-public-portal',
    portalType: 'Custom',
    physicalAddress: '245 Murray Lane SW, Washington, DC 20528-0655',
    phone: '(866) 431-0486',
    verified: true
  },
  {
    id: 'fed-doj-crm',
    name: 'Department of Justice - Criminal Division',
    acronym: 'DOJ-CRM',
    jurisdictionId: 'US_FED',
    jurisdictionType: 'federal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Chief, FOIA/PA Unit',
    foiaEmail: 'crm.foiaparequests@usdoj.gov',
    portalUrl: 'https://www.foia.gov',
    portalType: 'FOIA.gov',
    physicalAddress: '1301 New York Ave NW, Washington, DC 20530',
    phone: '(202) 514-4113',
    verified: true
  },

  // CALIFORNIA (STATE & LOCAL)
  {
    id: 'ca-doj',
    name: 'California Department of Justice (Office of the Attorney General)',
    acronym: 'CalDOJ',
    jurisdictionId: 'CA',
    jurisdictionType: 'state',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Public Records Coordinator',
    foiaEmail: 'pra@doj.ca.gov',
    portalUrl: 'https://oag.ca.gov/pra',
    portalType: 'NextRequest',
    physicalAddress: '1300 I Street, Sacramento, CA 95814',
    phone: '(916) 210-6276',
    verified: true
  },
  {
    id: 'ca-lapd',
    name: 'Los Angeles Police Department',
    acronym: 'LAPD',
    jurisdictionId: 'CA',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Discovery Section / Public Records Unit',
    foiaEmail: 'lapdrecords@lapd.online',
    portalUrl: 'https://lacity.nextrequest.com',
    portalType: 'NextRequest',
    physicalAddress: '100 W. 1st Street, Los Angeles, CA 90012',
    phone: '(213) 486-6000',
    verified: true
  },
  {
    id: 'ca-sfpd',
    name: 'San Francisco Police Department',
    acronym: 'SFPD',
    jurisdictionId: 'CA',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Legal Division / Records Custodian',
    foiaEmail: 'sfpd.legal@sfgov.org',
    portalUrl: 'https://sanfrancisco.nextrequest.com',
    portalType: 'NextRequest',
    physicalAddress: '1245 3rd Street, San Francisco, CA 94158',
    phone: '(415) 837-7000',
    verified: true
  },
  {
    id: 'ca-carb',
    name: 'California Air Resources Board',
    acronym: 'CARB',
    jurisdictionId: 'CA',
    jurisdictionType: 'state',
    departmentCategory: 'environmental',
    custodianTitle: 'Public Records Access Coordinator',
    foiaEmail: 'pra@arb.ca.gov',
    portalUrl: 'https://ww2.arb.ca.gov/public-records-requests',
    portalType: 'Custom',
    physicalAddress: '1001 I Street, Sacramento, CA 95814',
    phone: '(916) 322-2990',
    verified: true
  },
  {
    id: 'ca-gov',
    name: 'Office of the Governor of California',
    acronym: 'CA-GOV',
    jurisdictionId: 'CA',
    jurisdictionType: 'state',
    departmentCategory: 'executive',
    custodianTitle: 'Legal Affairs Secretary',
    foiaEmail: 'pra@gov.ca.gov',
    portalUrl: 'https://www.gov.ca.gov/contact/',
    portalType: 'Custom',
    physicalAddress: '1021 O Street, Suite 9000, Sacramento, CA 95814',
    phone: '(916) 445-2841',
    verified: true
  },

  // TEXAS (STATE & LOCAL)
  {
    id: 'tx-oag',
    name: 'Office of the Attorney General of Texas',
    acronym: 'TXOAG',
    jurisdictionId: 'TX',
    jurisdictionType: 'state',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Public Information Coordinator',
    foiaEmail: 'publicrecords@oag.texas.gov',
    portalUrl: 'https://texasattorneygeneral.gov/open-government/public-information-act',
    portalType: 'GovQA',
    physicalAddress: '300 W. 15th Street, Austin, TX 78701',
    phone: '(512) 463-2100',
    verified: true
  },
  {
    id: 'tx-apd',
    name: 'Austin Police Department / City of Austin',
    acronym: 'APD',
    jurisdictionId: 'TX',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'APD Public Information Specialist',
    foiaEmail: 'apdpublicinformation@austintexas.gov',
    portalUrl: 'https://austintexas.gov/pir',
    portalType: 'GovQA',
    physicalAddress: '715 E 8th St, Austin, TX 78701',
    phone: '(512) 974-5000',
    verified: true
  },
  {
    id: 'tx-hpd',
    name: 'Houston Police Department',
    acronym: 'HPD',
    jurisdictionId: 'TX',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Open Records Unit',
    foiaEmail: 'hpd.openrecords@houstonpolice.org',
    portalUrl: 'https://houstontx.gov/police/open_records',
    portalType: 'GovQA',
    physicalAddress: '1200 Travis St, Houston, TX 77002',
    phone: '(713) 308-9000',
    verified: true
  },
  {
    id: 'tx-tceq',
    name: 'Texas Commission on Environmental Quality',
    acronym: 'TCEQ',
    jurisdictionId: 'TX',
    jurisdictionType: 'state',
    departmentCategory: 'environmental',
    custodianTitle: 'Open Records Manager',
    foiaEmail: 'openrecs@tceq.texas.gov',
    portalUrl: 'https://www.tceq.texas.gov/agency/decisions/pia/request.html',
    portalType: 'Custom',
    physicalAddress: '12100 Park 35 Circle, Austin, TX 78753',
    phone: '(512) 239-0010',
    verified: true
  },

  // FLORIDA
  {
    id: 'fl-fdle',
    name: 'Florida Department of Law Enforcement',
    acronym: 'FDLE',
    jurisdictionId: 'FL',
    jurisdictionType: 'state',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Office of the General Counsel / Public Records',
    foiaEmail: 'PublicRecords@fdle.state.fl.us',
    portalUrl: 'https://www.fdle.state.fl.us/Public-Records',
    portalType: 'Custom',
    physicalAddress: '2331 Phillips Road, Tallahassee, FL 32308',
    phone: '(850) 410-7676',
    verified: true
  },
  {
    id: 'fl-miami-dade',
    name: 'Miami-Dade Police Department & County Mayor',
    acronym: 'MDPD',
    jurisdictionId: 'FL',
    jurisdictionType: 'county',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Central Records Bureau',
    foiaEmail: 'publicrecords@mdpd.com',
    portalUrl: 'https://www.miamidade.gov/global/service.page?Mduid_service=ser1471542158872584',
    portalType: 'GovQA',
    physicalAddress: '9105 NW 25th St, Doral, FL 33172',
    phone: '(305) 471-2085',
    verified: true
  },
  {
    id: 'fl-dep',
    name: 'Florida Department of Environmental Protection',
    acronym: 'FLDEP',
    jurisdictionId: 'FL',
    jurisdictionType: 'state',
    departmentCategory: 'environmental',
    custodianTitle: 'Ombudsman & Public Records Officer',
    foiaEmail: 'PublicRecords@FloridaDEP.gov',
    portalUrl: 'https://floridadep.gov/open-government',
    portalType: 'Custom',
    physicalAddress: '3900 Commonwealth Blvd, Tallahassee, FL 32399',
    phone: '(850) 245-2118',
    verified: true
  },

  // NEW YORK
  {
    id: 'ny-nypd',
    name: 'New York City Police Department (NYPD)',
    acronym: 'NYPD',
    jurisdictionId: 'NY',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Records Access Officer, Legal Bureau',
    foiaEmail: 'foil@nypd.org',
    portalUrl: 'https://a860-openrecords.nyc.gov',
    portalType: 'Custom',
    physicalAddress: 'One Police Plaza, Room 110-C, New York, NY 10038',
    phone: '(646) 610-5296',
    verified: true
  },
  {
    id: 'ny-nyc-mayor',
    name: 'Office of the Mayor of New York City',
    acronym: 'NYC-Mayor',
    jurisdictionId: 'NY',
    jurisdictionType: 'municipal',
    departmentCategory: 'executive',
    custodianTitle: 'Records Access Officer',
    foiaEmail: 'foil@cityhall.nyc.gov',
    portalUrl: 'https://a860-openrecords.nyc.gov',
    portalType: 'Custom',
    physicalAddress: 'City Hall, New York, NY 10007',
    phone: '(212) 788-3000',
    verified: true
  },

  // ILLINOIS
  {
    id: 'il-cpd',
    name: 'Chicago Police Department',
    acronym: 'CPD',
    jurisdictionId: 'IL',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Freedom of Information Officer',
    foiaEmail: 'foia@chicagopolice.org',
    portalUrl: 'https://home.chicagopolice.org/information/freedom-of-information-act-foia/',
    portalType: 'GovQA',
    physicalAddress: '3510 S. Michigan Ave, Chicago, IL 60653',
    phone: '(312) 745-6110',
    verified: true
  },
  {
    id: 'il-epa',
    name: 'Illinois Environmental Protection Agency',
    acronym: 'ILEPA',
    jurisdictionId: 'IL',
    jurisdictionType: 'state',
    departmentCategory: 'environmental',
    custodianTitle: 'FOIA Officer',
    foiaEmail: 'epa.foia@illinois.gov',
    portalUrl: 'https://epa.illinois.gov/foia.html',
    portalType: 'Custom',
    physicalAddress: '1021 North Grand Ave East, Springfield, IL 62794',
    phone: '(217) 782-5544',
    verified: true
  },

  // WASHINGTON
  {
    id: 'wa-spd',
    name: 'Seattle Police Department',
    acronym: 'SPD',
    jurisdictionId: 'WA',
    jurisdictionType: 'municipal',
    departmentCategory: 'law_enforcement',
    custodianTitle: 'Public Records Unit Supervisor',
    foiaEmail: 'spdpublicrecords@seattle.gov',
    portalUrl: 'https://seattle.govqa.us/WEBAPP/_rs/',
    portalType: 'GovQA',
    physicalAddress: '610 5th Avenue, Seattle, WA 98124',
    phone: '(206) 684-5454',
    verified: true
  }
];

export function searchAgencies(query: string, jurisdictionFilter?: string): AgencyContact[] {
  const q = query.toLowerCase().trim();
  return AGENCIES_DATABASE.filter(agency => {
    if (jurisdictionFilter && jurisdictionFilter !== 'all' && agency.jurisdictionId !== jurisdictionFilter) {
      return false;
    }
    if (!q) return true;
    return (
      agency.name.toLowerCase().includes(q) ||
      (agency.acronym && agency.acronym.toLowerCase().includes(q)) ||
      agency.foiaEmail.toLowerCase().includes(q) ||
      agency.departmentCategory.toLowerCase().includes(q)
    );
  });
}

export function findAgencyById(id: string): AgencyContact | undefined {
  return AGENCIES_DATABASE.find(a => a.id === id);
}

export function getRecommendedAgenciesForTopic(topic: string, jurisdictionId?: string): AgencyContact[] {
  const t = topic.toLowerCase();
  let category: AgencyContact['departmentCategory'] | undefined;
  
  if (t.includes('police') || t.includes('bodycam') || t.includes('arrest') || t.includes('officer') || t.includes('shooting') || t.includes('fbi') || t.includes('crime')) {
    category = 'law_enforcement';
  } else if (t.includes('environment') || t.includes('water') || t.includes('spill') || t.includes('chemical') || t.includes('epa') || t.includes('pollution') || t.includes('emissions')) {
    category = 'environmental';
  } else if (t.includes('stock') || t.includes('sec') || t.includes('trade') || t.includes('ftc') || t.includes('investigation') || t.includes('antitrust')) {
    category = 'regulatory';
  } else if (t.includes('flight') || t.includes('drone') || t.includes('faa') || t.includes('plane') || t.includes('aviation')) {
    category = 'transportation';
  }

  const matched = AGENCIES_DATABASE.filter(a => {
    if (jurisdictionId && jurisdictionId !== 'all' && a.jurisdictionId !== jurisdictionId) return false;
    if (category && a.departmentCategory === category) return true;
    return false;
  });

  return matched.length > 0 ? matched : AGENCIES_DATABASE.slice(0, 5);
}
