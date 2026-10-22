# I.3. External actors

<p class="chapter-lead">Who outside the organisation sets your requirements, supervises you and receives your reports. Two layers: the national cybersecurity system and the regulator of your sector.</p>

*Covers: ISO/IEC 27001:2022, clause 4.2 and controls A.5.5-A.5.6 · NIST CSF 2.0, GV.OC-02*

**Goal.** Turn the interested parties from I.2 into named bodies with their powers: who sets requirements, who checks them, who must be told about an incident and whom you contact in a crisis.

## The national cybersecurity system

The core law is [Law of Ukraine No. 2163-VIII of 05.10.2017](#/sources?act=ua-law-2163-viii). It sets up the national cybersecurity system, defines cyber protection objects and the duties of their owners, and gives state bodies their powers. Three more acts shape it:

| Act | What it sets |
|---|---|
| [CMU Resolution No. 1426 of 29.12.2021](#/sources?act=ua-cmu-1426-2021) | The organisational and technical model of cyber protection: the roles of the system's actors |
| [Law of Ukraine No. 4336-IX of 27.03.2025](#/sources?act=ua-law-4336-ix) | For state information resources and CII facilities: heads of cyber protection, security authorisation of systems, state control |
| [Law of Ukraine No. 1882-IX of 16.11.2021](#/sources?act=ua-law-1882-ix) | Critical infrastructure: sectors, categorisation of facilities, the register of facilities |

How these acts lead to the requirements you implement is shown by the [key chains](#/sources?scope=core&mode=chains). A map of the system's actors, their powers and contact points is being prepared for this chapter.

## The regulator of your sector

Most sector requirements come from one regulator, and the register shows it as the issuer of the acts that apply to you:

| Who you are | Regulator | Its acts in the register |
|---|---|---|
| A bank, a payment market participant, a non-bank financial service provider | The National Bank of Ukraine | [NBU resolutions](#/sources?type=nbu_resolution) |
| An owner of systems with state information resources or restricted information, a CII facility owner | The SSSCIP | [SSSCIP orders](#/sources?type=ssscip_order) |

For other sectors, open [Acts](#/sources) with your profile and look at who issued the acts on the list.

## What to record

For each actor: its role towards you (sets requirements, supervises, receives reports, coordinates response), the act that gives it that role, and the channel: whom to contact, how and by when. Reporting duties and deadlines go into incident response; contacts with authorities are themselves a control (A.5.5).

**Result.** A list of external actors with their powers and the acts behind them; contacts with authorities recorded, kept up to date and tested.

**Common mistakes**

- the regulator is known, but the reporting channel and deadlines are not;
- contacts with authorities live in one person's phone;
- the sector regulator's requirements are tracked and the national system's are not, or the other way round.
