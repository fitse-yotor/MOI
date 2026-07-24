# Manufacturing Business Information System

## External Integration Clients and Data Exchange Matrix

**Version:** 1.0  
**Status:** Draft for integration-discovery workshops  

---

## 1. Important Clarification

The integration targets listed in the TOR are primarily **government institutions and public data providers**, not private companies.

The TOR identifies:

1. Ministry of Industry.
2. Ethiopian Enterprise Development.
3. Ethiopian Customs Commission.
4. Ethiopian Investment Commission.
5. Digital Market Platform.
6. National Bank of Ethiopia.
7. Ministry of Labor and Skills-related system.
8. International data sources.

The precise system name, vendor, API, database, endpoint, and technical contact are not defined for most integrations. These details must be collected during inception.

---

## 2. Integration Priority Summary

| Priority | Integration | Reason |
|---|---|---|
| P0 | Ministry of Industry existing information system | Core existing manufacturing repository and project owner data |
| P0 | Ethiopian Enterprise Development MIS | Core SMLE and woreda-level operational data |
| P1 | Customs import/export system | Trade and raw-material/export performance |
| P1 | Ethiopian Investment Commission | Investment permits, projects, ownership, and FDI |
| P1 | National Bank of Ethiopia | Official FDI, exchange-rate, and external-sector indicators |
| P1 | Ministry of Labor and Skills / E-LMIS | Workforce, employer, occupation, and skills information |
| P2 | Digital Market Platform | Market, buyer, supplier, and product opportunity data |
| P2 | International data providers | Benchmarking and comparative analysis |
| Optional | Identity, tax/TIN, registration, SMS, maps, payment | Subject to formal scope approval |

---

## 3. Ministry of Industry Integration

### Business Purpose

- Reuse existing manufacturing information.
- avoid duplicate enterprise registration.
- consolidate sector and survey data.
- preserve historical records.
- publish consistent official indicators.

### Expected Data Inbound

- Enterprise identifiers and profiles.
- manufacturer contact and location.
- sector/subsector and product.
- large and medium manufacturing survey datasets.
- import/export files previously loaded by MoI.
- investment information previously loaded by MoI.
- performance indicators.
- existing reports and publications.
- data-source metadata.

### Possible Data Outbound

- Cleaned enterprise identifiers.
- approved consolidated registry.
- data-quality results.
- official aggregated indicators.
- new warehouse reporting APIs.
- correction and reconciliation status.

### Recommended Integration Method

1. REST API when a stable API exists.
2. Secure scheduled data export/import.
3. Read-only database view only when formally approved.
4. Initial bulk migration followed by incremental updates.

### Key Matching Fields

- Enterprise internal ID.
- TIN.
- registration/license number.
- legal name.
- location.
- owner/manager.
- sector and product.

### Open Questions

- Is the existing system NIIS, IIS, or another application?
- Is it being replaced, extended, or retained?
- Which system is the authoritative enterprise master?
- Does it expose APIs?
- What is the database and version?
- How many records and years exist?
- Who approves corrections?
- What data can be published?
- What vendor currently supports it?

---

## 4. Ethiopian Enterprise Development Integration

### Business Purpose

- Consolidate SMLE data.
- receive regional, city, zone, and woreda information.
- support enterprise development and monitoring.
- measure training, market linkage, cluster, infrastructure, finance, and technology services.
- improve data from more than one thousand woreda sites.

### Expected Data Inbound

- Manufacturing SME registry.
- enterprise location.
- owner/manager.
- employment and assets.
- production and performance.
- business development services.
- training.
- cluster and infrastructure support.
- market linkage.
- financing/leasing support.
- enterprise challenges.
- regional and woreda reporting.

### Possible Data Outbound

- Consolidated and cleaned enterprise master.
- duplicate/correction results.
- national indicator values.
- approved benchmark and market information.
- feedback on submitted data.
- service outcome dashboards.

### Recommended Integration Method

- Two-way REST API where possible.
- Initial bulk migration.
- periodic incremental synchronization.
- controlled file import for legacy woreda data.
- event or scheduled feedback for corrected records.

### Key Matching Fields

- EED enterprise ID.
- TIN.
- license/registration.
- name and location.
- owner contact.
- sector/product.
- regional/woreda code.

### Open Questions

- Exact MIS name and architecture.
- Coverage and status of all woreda sites.
- whether records are centralized or distributed.
- record counts and data quality.
- API availability.
- authoritative fields.
- duplicate resolution.
- update ownership.
- required synchronization direction.
- existing vendor and support contact.

---

## 5. Ethiopian Customs Commission Integration

### Business Purpose

- Analyze manufacturers’ imports and exports.
- measure raw-material dependency.
- measure export performance.
- map products to sectors and enterprises.
- support import-substitution and market analysis.

### Expected Data Inbound

- Declaration reference.
- importer/exporter TIN.
- trader name.
- HS code.
- product description.
- quantity.
- unit.
- customs value.
- currency.
- origin country.
- destination country.
- declaration/clearance date.
- customs office or port.
- import/export type.
- transport mode where authorized.

### Recommended Direction

Primarily inbound, analytical integration.

### Recommended Integration Method

- Secure API or scheduled extract.
- daily, weekly, or monthly frequency depending on approval.
- staging and reconciliation.
- HS-code-to-product/sector mapping.
- aggregate output for unauthorized users.

### Key Matching Fields

- TIN.
- enterprise registration.
- trader name.
- address.
- customs trader identifier.

### Privacy and Governance

- Customs data may be confidential.
- enterprise-level access must be explicitly approved.
- public outputs should normally be aggregated.
- purpose, retention, and redistribution must be documented.

### Open Questions

- Exact customs platform.
- API and sandbox availability.
- enterprise-level data permission.
- historical years.
- frequency.
- data volume.
- corrected/amended declaration handling.
- HS-code version.
- confidentiality classification.
- technical and legal contacts.

---

## 6. Ethiopian Investment Commission Integration

### Business Purpose

- identify manufacturing investments.
- connect enterprises with investment permits and projects.
- analyze domestic and foreign investment.
- track planned versus operational investments.
- support investor and opportunity information.

### Expected Data Inbound

- Investment project ID.
- permit/license number.
- investor/company identity.
- TIN.
- sector/subsector.
- project description.
- project location.
- ownership nationality.
- domestic/foreign status.
- planned/registered capital.
- project status.
- approval and renewal dates.
- expansion project.
- industrial park or SEZ.
- incentives where authorized.

### Possible Data Outbound

- corrected manufacturing classification.
- approved enterprise registry reference.
- sector/location validation.
- aggregate sector performance.
- business-linkage opportunities.

### Recommended Integration Method

- REST API with approved service account.
- scheduled synchronization.
- initial historical import.
- event or periodic status refresh.

### Key Matching Fields

- EIC project ID.
- permit/license.
- TIN.
- legal name.
- location.
- investor identity.

### Open Questions

- EIC e-service API.
- historical data.
- investment identifier.
- enterprise matching.
- capital-field confidentiality.
- project status definitions.
- refresh frequency.
- outbound data needs.
- vendor/technical contact.

---

## 7. National Bank of Ethiopia Integration

### Business Purpose

- provide official FDI and external-sector indicators.
- normalize monetary indicators.
- support economic and industry reports.
- provide approved exchange-rate references.
- support international and time-series comparison.

### Expected Data Inbound

- Direct investment by indicator.
- direct investment by country.
- external-sector statistics.
- imports and exports by major category.
- exchange rates.
- balance-of-payments indicators.
- other approved macroeconomic series.

### Recommended Direction

Inbound analytical integration.

### Recommended Integration Method

- Official API if available.
- approved bulk statistical download.
- scheduled file import.
- metadata and revision-date capture.

### Important Distinction

NBE may provide aggregate official statistics rather than enterprise-level records. Enterprise-level FDI data should not be assumed available.

### Open Questions

- public versus restricted datasets.
- API or file delivery.
- enterprise-level availability.
- frequency and revision policy.
- approved exchange-rate series.
- methodology.
- redistribution permissions.
- source citation requirements.

---

## 8. Ministry of Labor and Skills / E-LMIS Integration

### Business Purpose

- analyze manufacturing employment.
- connect employer information.
- measure occupation and skill demand.
- use labor-market indicators.
- improve training and human-capital analysis.

### Expected Data Inbound

- Employer registry.
- employment indicators.
- vacancy and demand indicators.
- occupation classifications.
- skills classifications.
- training institutions/programmes.
- labor-market statistics.
- verified employer/labor identifiers where lawful.

### Possible Data Outbound

- Manufacturing skill-demand indicators.
- approved employer references.
- sector workforce trends.
- regional employment demand.
- training-needs analysis.

### Recommended Integration Method

- API using institutional service accounts.
- aggregate or employer-level exchange.
- avoid person-level exchange unless legally required and approved.
- scheduled synchronization.

### Critical TOR Ambiguity

The TOR refers to an “Industry Information System at the Ministry of Labor,” while other sections refer to the Ministry of Industry. The client must confirm whether the intended target is:

1. Ministry of Industry information system.
2. E-LMIS.
3. Another Ministry of Labor and Skills application.
4. Multiple systems.

### Open Questions

- exact target system.
- API.
- employer identifier.
- PII scope.
- consent/legal basis.
- aggregate versus person-level data.
- data frequency.
- skill/occupation classification.
- technical contact.

---

## 9. Digital Market Platform Integration

### Business Purpose

Potential purposes include:

- discovering buyers and suppliers.
- publishing products.
- receiving market opportunities.
- exchanging demand and supply information.
- enabling B2B referrals.
- measuring market engagement.

### Potential Data Inbound

- Seller/company profile.
- buyer profile.
- product listing.
- price or range.
- demand request.
- supply offer.
- location.
- sector/product category.
- inquiries or expressions of interest.
- opportunity dates.

### Potential Data Outbound

- Approved manufacturer profile.
- product catalogue.
- production capacity.
- sector/location.
- selected market opportunities.
- referral links.

### Recommended Direction

Potentially two-way.

### Mandatory Questions

- What is the platform’s official name?
- Is it government owned or private?
- Does it currently exist?
- Who operates and supports it?
- Does it have API documentation?
- Which data may be exchanged?
- Are prices or transactions included?
- What consent is needed?
- Who owns user accounts?
- How are duplicate profiles managed?
- Is there a sandbox?
- What service-level agreement exists?

No development estimate should assume this integration until those questions are answered.

---

## 10. International Benchmark Sources

The TOR requires international data but does not select providers.

### Recommended Provider Categories

#### UNIDO

Potential use:

- Manufacturing value added.
- industrial performance.
- sector and country manufacturing indicators.
- industrial competitiveness.

#### World Bank

Potential use:

- Development indicators.
- enterprise surveys.
- infrastructure and business-environment indicators.
- macroeconomic comparison.

#### UN Comtrade

Potential use:

- Product-level international trade.
- country-to-country trade flows.
- import/export comparison.
- HS-code analysis.

#### International Trade Centre

Potential use:

- Market-access and trade analysis.
- export opportunity and diversification.
- product and partner-market analysis.

#### ILOSTAT

Potential use:

- Employment.
- wages.
- occupation.
- productivity.
- labor-force comparison.

#### Additional Approved Sources

- IMF.
- FAOSTAT for agro-processing.
- AfCFTA.
- COMESA.
- national statistical agencies.
- licensed commercial industry databases.

### Integration Controls

- Record provider and dataset.
- record license.
- record methodology.
- record period and release.
- preserve source citation.
- normalize unit and currency.
- map international classifications.
- flag estimated/provisional data.
- monitor revisions.
- restrict licensed redistribution.

---

## 11. Optional Integrations Requiring Change Approval

| Integration | Potential Purpose |
|---|---|
| National ID | Verified user and owner identity |
| Tax/TIN verification | Validate enterprise identity |
| Business registration/licensing | Validate legal registration and licenses |
| National statistical agency | Manufacturing surveys and official statistics |
| Industrial park systems | Park tenant, infrastructure, and location data |
| Standards/certification bodies | Product and management-system certifications |
| SMS gateway | Notifications and OTP |
| Email gateway | Transactional email |
| Maps/geospatial provider | Base maps, roads, routing, geocoding |
| Payment provider | Paid service/publication if required |
| Government interoperability layer | Secure cross-government API exchange |

These should not be treated as part of the base scope without written approval.

---

## 12. Integration Data Ownership Matrix

| Data Domain | Likely Primary Owner | New System Role |
|---|---|---|
| National manufacturing registry | MoI/EED, to be agreed | Consolidate and govern |
| SMLE operational/support data | EED | Integrate and analyze |
| Import/export declarations | Customs Commission | Consume and aggregate |
| Investment permits/projects | EIC | Consume and match |
| Official FDI/external statistics | NBE | Consume for analysis |
| Labor market/employer data | Ministry of Labor and Skills | Consume/exchange approved indicators |
| Marketplace opportunities | Digital Market Platform owner | Exchange approved profiles/opportunities |
| International benchmarks | Respective provider | Import, normalize, cite |
| User-generated enterprise updates | Enterprise plus approving institution | Collect, verify, retain |
| Official published indicators | MoI/EED | Calculate, approve, publish |

Final ownership must be signed in a data-governance agreement.

---

## 13. Integration Security Requirements

- TLS for all network exchange.
- approved service accounts.
- certificate or strong token authentication.
- network allowlisting where required.
- secrets stored securely.
- least-privilege scopes.
- request and response validation.
- rate limiting.
- replay protection where applicable.
- encryption at rest.
- field masking.
- log access without exposing secrets.
- data minimization.
- retention and secure disposal.
- incident notification.
- credential rotation.
- security testing.
- audit of extraction, import, correction, and export.

---

## 14. Integration Workflow

1. Register source and agreement.
2. receive technical specification and sample.
3. create mapping and quality rules.
4. connect to sandbox/test environment.
5. extract sample.
6. validate schema and data.
7. transform and match.
8. reconcile counts and totals.
9. obtain source-owner acceptance.
10. schedule production exchange.
11. monitor and alert.
12. handle errors and changes.
13. review data quality and performance.
14. renew agreement and credentials.

---

## 15. Required Integration Workshop Participants

For each institution:

- Business owner.
- data owner.
- data steward.
- legal/privacy representative.
- information-security representative.
- infrastructure/network representative.
- system administrator.
- API/database developer.
- existing vendor, where applicable.
- project business analyst.
- project architect.
- integration developer.
- data engineer.
- QA engineer.

---

## 16. Questions the Client Must Answer Before Integration Development

1. What is the exact system name?
2. Who owns it?
3. Who currently supports it?
4. Is there an API?
5. Is there a sandbox?
6. Which data fields are approved?
7. What is the legal basis for sharing?
8. Is the data enterprise-level or aggregate?
9. What is the authoritative identifier?
10. How are records corrected?
11. What is the expected frequency?
12. What is the historical period?
13. What are the data volumes?
14. What are the service hours and availability?
15. What are the security requirements?
16. What are the rate limits?
17. What are the reconciliation rules?
18. Who resolves failed records?
19. How are interface changes communicated?
20. Can data be published or redistributed?
21. What retention and deletion rules apply?
22. Which environment and network are provided?
23. Are VPN, allowlisting, or certificates required?
24. Who signs integration acceptance?
25. What support SLA applies after go-live?

---

## 17. Recommended First Integration Sequence

### Step 1: Internal Data Foundation

- MoI current system and files.
- EED MIS and woreda datasets.
- enterprise master matching.
- baseline migration.
- data-quality rules.

### Step 2: Trade and Investment

- Customs.
- EIC.
- NBE.
- product/HS and enterprise/TIN matching.

### Step 3: Labor and Market

- E-LMIS or confirmed labor system.
- Digital Market Platform.
- workforce and market-linkage data.

### Step 4: International Benchmarks

- approved international providers.
- methodology and licensing.
- normalization.
- benchmark dashboards.

This sequence reduces risk because the enterprise master and internal data governance are established before external records are matched.
