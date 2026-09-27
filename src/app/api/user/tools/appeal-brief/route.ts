import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

interface AppealRequest {
  agency: string;
  trackingNumber?: string;
  requesterName?: string;
  requesterOrg?: string;
  exemptionCodes: string[];
  requestSubject: string;
  denialDate?: string;
  appealArgumentFocus?: string;
}

const STATUTORY_PRECEDENTS: Record<string, { title: string; citation: string; principle: string; statutoryText: string }> = {
  "Exemption 4": {
    title: "Commercial & Financial Information Confidentiality Challenge",
    citation: "Food Marketing Institute v. Argus Leader Media, 139 S. Ct. 2356 (2019); Center for Investigative Reporting v. CBP, 437 F. Supp. 3d 715 (D.D.C. 2020)",
    principle: "Under the FOIA Improvement Act of 2016, 5 U.S.C. § 552(a)(8)(A), the agency cannot withhold information under Exemption 4 on purely speculative grounds. The agency must identify specific, non-conjectural 'foreseeable harm' to a commercial interest and prove both that the submitter customarily kept the information private AND that the government gave express assurances of confidentiality upon receipt.",
    statutoryText: "5 U.S.C. § 552(b)(4)"
  },
  "Exemption 5": {
    title: "Deliberative Process Privilege & Factual Segregability",
    citation: "EPA v. Mink, 410 U.S. 73 (1973); Machado Amadis v. U.S. Dep't of State, 971 F.3d 364 (D.C. Cir. 2020); Reporters Comm. for Freedom of the Press v. FBI, 3 F.4th 350 (D.C. Cir. 2021)",
    principle: "Purely factual material, statistical compilations, and historical recitations embedded within deliberative records are NOT exempt and must be disclosed pursuant to the statutory segregability mandate of 5 U.S.C. § 552(b). Furthermore, the 2016 FOIA amendments require the agency to articulate an independent showing of foreseeable harm to future agency deliberations.",
    statutoryText: "5 U.S.C. § 552(b)(5)"
  },
  "Exemption 6": {
    title: "Public Interest Balancing in Personal Privacy",
    citation: "Dep't of the Air Force v. Rose, 425 U.S. 352 (1976); U.S. Dep't of Justice v. Reporters Comm. for Freedom of the Press, 489 U.S. 749 (1989)",
    principle: "Exemption 6 requires a strict balancing test weighing the individual privacy interest against the core purpose of FOIA: opening agency action to the light of public scrutiny. Where records shed light on agency performance of statutory duties, public interest overrides de minimis privacy assertions.",
    statutoryText: "5 U.S.C. § 552(b)(6)"
  },
  "Exemption 7(A)": {
    title: "Ongoing Enforcement Proceeding Concrete Interference Requirement",
    citation: "NLRB v. Robbins Tire & Rubber Co., 437 U.S. 214 (1978); Campbell v. Dep't of Health & Human Servs., 682 F.2d 256 (D.C. Cir. 1982); CREW v. DOJ, 746 F.3d 1082 (D.C. Cir. 2014)",
    principle: "To justify withholding under Exemption 7(A), the agency cannot rely on blanket categorical assertions. It must demonstrate (1) a concrete, prospective law enforcement proceeding and (2) articulate specifically how disclosure of each category of withheld records would interfere with that proceeding.",
    statutoryText: "5 U.S.C. § 552(b)(7)(A)"
  },
  "Exemption 7(C)": {
    title: "Official Misconduct & Government Integrity Exception",
    citation: "National Archives & Records Admin. v. Favish, 541 U.S. 157 (2004); Citizens for Responsibility & Ethics in Washington v. DOJ, 854 F.3d 675 (D.C. Cir. 2017)",
    principle: "The privacy interest under 7(C) yields when the requester demonstrates that the requested information is likely to advance a significant public interest in uncovering official government negligence, misconduct, or arbitrary exercise of regulatory authority.",
    statutoryText: "5 U.S.C. § 552(b)(7)(C)"
  },
  "Exemption 7(D)": {
    title: "Confidential Source Assurance Proof Burden",
    citation: "U.S. Dep't of Justice v. Landano, 508 U.S. 165 (1993)",
    principle: "The government is not entitled to a universal presumption that all sources supplying information to a law enforcement agency are 'confidential'. The agency must establish either that the source spoke under an express grant of confidentiality or demonstrate specific circumstances supporting an implied assurance.",
    statutoryText: "5 U.S.C. § 552(b)(7)(D)"
  },
  "Exemption 7(E)": {
    title: "Non-Exemption of Common or Standard Investigative Techniques",
    citation: "Allard K. Lowenstein Intern. Human Rights Project v. DHS, 626 F.3d 678 (2d Cir. 2010); Blackwell v. FBI, 646 F.3d 37 (D.C. Cir. 2011)",
    principle: "Exemption 7(E) only protects techniques and procedures that are not commonly known to the public, or where disclosure creates a real risk of circumvention of the law. Routine surveillance methods, public database lookups, and standardized interview procedures are non-exempt.",
    statutoryText: "5 U.S.C. § 552(b)(7)(E)"
  },
  "Glomar Defense": {
    title: "Challenge to 'Neither Confirm Nor Deny' (Glomar) Refusal",
    citation: "Phillippi v. CIA, 546 F.2d 1009 (D.C. Cir. 1976); Wolf v. CIA, 473 F.3d 370 (D.C. Cir. 2007); ACLU v. CIA, 710 F.3d 422 (D.C. Cir. 2013)",
    principle: "A Glomar response is unlawful when the existence of agency records or interest in the subject matter has been officially acknowledged in congressional testimony, prior agency press releases, public contracts, or authorized public statements by executive branch officials.",
    statutoryText: "5 U.S.C. § 552 / Glomar Doctrine"
  }
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body: AppealRequest = await req.json();
    const { 
      agency = "Department of Justice (DOJ)", 
      trackingNumber = "FOIA-2026-009412",
      requesterName = user.name || "Requester",
      requesterOrg = "Exultia Public Records & Legal Discovery",
      exemptionCodes = ["Exemption 4", "Exemption 7(A)"],
      requestSubject = "Records concerning algorithmic security compliance audits and procurement contracts",
      denialDate = new Date().toLocaleDateString(),
      appealArgumentFocus = "Failure to establish foreseeable harm and lack of factual segregability"
    } = body;

    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const deadlineDays = 90; // 5 U.S.C. § 552(a)(6)(A)(i) administrative appeal window

    // Compile precedent analysis
    const precedentsUsed = exemptionCodes.map(code => STATUTORY_PRECEDENTS[code] || {
      title: `${code} Procedural Challenge`,
      citation: "5 U.S.C. § 552(a)(8)(A); Reporters Comm. for Freedom of the Press v. FBI, 3 F.4th 350 (D.C. Cir. 2021)",
      principle: `The agency bears the affirmative legal burden under 5 U.S.C. § 552(a)(8)(A) to prove that disclosure will cause foreseeable harm to an interest protected by ${code}. Generalized assertions are insufficient as a matter of law.`,
      statutoryText: code
    });

    const briefMarkdown = `# ADMINISTRATIVE FOIA APPEAL PURSUANT TO 5 U.S.C. § 552(a)(6)(A)

**DATE:** ${dateStr}  
**TO:** Principal FOIA Appeals Officer, ${agency}  
**FROM:** ${requesterName} (${requesterOrg})  
**RE:** Administrative Appeal of Denial / Adverse Determination  
**AGENCY TRACKING NO:** \`${trackingNumber}\`  
**ORIGINAL REQUEST SUBJECT:** "${requestSubject}"  
**DATE OF ADVERSE DETERMINATION:** ${denialDate}  

---

### I. PRELIMINARY STATEMENT & TIMELINESS

Appellant hereby timely appeals the adverse determination rendered by ${agency} in connection with Freedom of Information Act (FOIA) Request No. \`${trackingNumber}\`. This appeal is filed within the 90 calendar day administrative appeal window established by 5 U.S.C. § 552(a)(6)(A)(i).

The agency's determination improperly withheld responsive records citing **${exemptionCodes.join(', ')}**. For the statutory and jurisprudential reasons set forth below, the agency has failed to meet its statutory burden of proof under the FOIA Improvement Act of 2016, 5 U.S.C. § 552(a)(8)(A), and has failed to comply with the mandatory segregability requirements of 5 U.S.C. § 552(b).

---

### II. STATUTORY ARGUMENTS & CIRCUIT PRECEDENTS

${precedentsUsed.map((prec, idx) => `
#### ${idx + 1}. Challenge to Withholdings Under ${prec.statutoryText}: ${prec.title}

* **Controlling Authorities:** *${prec.citation}*
* **Statutory Principle:** ${prec.principle}

**Argument:**  
In its initial response dated ${denialDate}, ${agency} failed to provide the necessary evidentiary basis required to substantiate withholdings under ${prec.statutoryText}. Pursuant to *Reporters Committee for Freedom of the Press v. FBI*, 3 F.4th 350 (D.C. Cir. 2021), an agency cannot merely recite statutory boilerplate or reiterate the terms of the exemption. The agency must explain with particularity *how* disclosure would impair a protected interest in this specific instance. No such showing was made.
`).join('\n')}

---

### III. VIOLATION OF MANDATORY REASONABLY SEGREGABLE PROVISION

Pursuant to 5 U.S.C. § 552(b), "[a]ny reasonably segregable portion of a record shall be provided to any person requesting such record after deletion of the portions which are exempt." 

Under long-standing D.C. Circuit precedent, non-exempt factual narratives, administrative metadata, dates, organizational structures, and historical context must be severed and produced. *See Mead Data Central, Inc. v. U.S. Dep't of the Air Force*, 566 F.2d 242, 260 (D.C. Cir. 1977); *Stolt-Nielsen Transp. Grp. Ltd. v. United States*, 534 F.3d 728, 734 (D.C. Cir. 2008). The agency's blanket withholding of entire records constitutes reversible legal error.

---

### IV. CONCLUSION & RELIEF REQUESTED

WHEREFORE, Appellant respectfully requests that the Appellate Authority:
1. Vacate the initial adverse determination and order a comprehensive de novo re-review of all withheld records;
2. Disclose all reasonably segregable non-exempt portions of the requested records;
3. In the event any withholdings are affirmed, provide an individualized *Vaughn* index describing each document with sufficient specificity to enable meaningful judicial review pursuant to 5 U.S.C. § 552(a)(4)(B).

Respectfully submitted,

**${requesterName}**  
*${requesterOrg}*  
*Electronic Filing via Inquest Legal Discovery Suite*
`;

    return NextResponse.json({
      success: true,
      brief: {
        agency,
        trackingNumber,
        generatedDate: dateStr,
        exemptionCodes,
        precedentsUsed,
        markdown: briefMarkdown,
        statutoryDeadline: `${deadlineDays} Days`,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate brief' }, { status: 500 });
  }
}
