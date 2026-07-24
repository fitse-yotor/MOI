# Software Requirements Specification (SRS)

## Manufacturing Business Information System

**Document version:** 1.0  
**Prepared from:** Terms of Reference for the Development, Deployment, Operation and Support of Business Information System Interface  
**Target institutions:** Ministry of Industry (MoI) and Ethiopian Enterprise Development (EED)  
**Preferred implementation period:** Six months  
**Implementation support:** Two years  
**Document status:** Draft for requirements validation  

---

## 1. Document Purpose

This Software Requirements Specification defines the functional, data, integration, security, reporting, mobile, infrastructure, operational, and quality requirements for a national Manufacturing Business Information System.

The system will provide a centralized platform for:

1. Registering and maintaining manufacturing enterprise information.
2. Collecting data from federal, regional, zonal/sub-city, woreda, and enterprise users.
3. Integrating manufacturing, trade, investment, labor, market, and international benchmark data.
4. Validating, profiling, enriching, and managing data quality.
5. Storing historical and analytical information in a manufacturing data warehouse.
6. Producing industry dashboards, statistical reports, non-statistical reports, and GIS reports.
7. Supporting buyer, supplier, investor, and enterprise business linkages.
8. Providing mobile access for enterprise owners, managers, field officers, and information consumers.
9. Supporting policymakers, researchers, investors, buyers, and enterprises with reliable decision-support information.

---

## 2. Scope

### 2.1 In Scope

The system shall include:

- Administrative web back office.
- Enterprise and field-data collection web application.
- Enterprise and data-collection mobile application.
- Industry information and analytics web portal.
- Industry information and analytics mobile application.
- Enterprise registry.
- Manufacturing baseline-data collection.
- Survey and questionnaire management.
- Hierarchical review and approval.
- Data quality management.
- External-system integration.
- ETL and data-processing services.
- Manufacturing data warehouse.
- Metadata catalogue and data dictionary.
- Industry-analysis dashboards.
- Statistical and non-statistical reporting.
- GIS and spatial reporting.
- Benchmark and international-data analysis.
- B2B matching and business-linkage management.
- Notifications, feedback, complaints, and support.
- Audit, security, backup, monitoring, and technical administration.
- Data migration from existing baseline datasets.
- User and system-administrator documentation.
- User and administrator training.

### 2.2 Out of Scope Unless Approved Through Change Control

- Replacement or redevelopment of external source systems.
- Modification of Customs, EIC, NBE, E-LMIS, or other third-party systems.
- Procurement of commercial data subscriptions.
- National digital identity integration unless formally requested.
- Payment-gateway integration unless formally requested.
- Public disclosure of confidential enterprise-level records.
- Advanced artificial-intelligence forecasting unless approved.
- IoT or machine-level production-data collection.
- Enterprise ERP implementation.
- Direct tax administration.
- Direct customs declaration processing.
- Direct investment-permit processing.
- Unapproved cross-border exchange of personally identifiable information.

---

## 3. Business Objectives

The system shall:

- Improve accessibility to manufacturing and business information.
- Improve the completeness, accuracy, consistency, timeliness, and traceability of manufacturing data.
- Facilitate local and international market access.
- Enable B2B matching and long-term business linkages.
- provide benchmark data for comparative analysis.
- integrate data from local and international sources.
- produce comprehensive industry-analysis reports.
- provide spatial information about manufacturing enterprises and supporting infrastructure.
- improve evidence-based policy and investment decisions.
- reduce duplicate data collection across institutions.
- establish sustainable data-governance, backup, and operational processes.
- support continuous improvement through feedback and data-quality monitoring.

---

## 4. Stakeholders

| Stakeholder | Primary Interest |
|---|---|
| Ministry of Industry | National manufacturing policy, sector performance, enterprise data, dashboards, reports |
| Ethiopian Enterprise Development | SMLE registry, enterprise support, regional/woreda data, market linkage, training and performance |
| Regional administrations | Regional enterprise data, review, support, reporting |
| Zone/sub-city administrations | Local data collection, verification, monitoring |
| Woreda administrations | Enterprise registration, field data collection, periodic updates |
| Manufacturing owners/managers | Enterprise profile, data updates, business opportunities, linkage requests |
| Buyers | Product and supplier discovery |
| Suppliers | Enterprise demand and market-linkage opportunities |
| Investors | Investment opportunities and enterprise discovery |
| Policymakers | National and subnational indicators and analysis |
| Researchers | Approved aggregated datasets and reports |
| Customs Commission | Import/export data exchange |
| Ethiopian Investment Commission | Investment and FDI-related data exchange |
| National Bank of Ethiopia | Approved macroeconomic and FDI data exchange |
| Ministry of Labor and Skills | Labor-market and workforce information exchange |
| International data providers | Benchmark and comparative manufacturing data |
| System administrators | Configuration, security, monitoring, backup, support |
| Data stewards/quality officers | Definitions, validation rules, data-quality monitoring |

---

## 5. Definitions and Acronyms

| Term | Meaning |
|---|---|
| SMLE | Small, Medium, and Large Enterprises |
| SME | Small and Medium Enterprise |
| MoI | Ministry of Industry |
| EED | Ethiopian Enterprise Development |
| EIC | Ethiopian Investment Commission |
| NBE | National Bank of Ethiopia |
| ETL | Extract, Transform, Load |
| GIS | Geographic Information System |
| API | Application Programming Interface |
| RBAC | Role-Based Access Control |
| MFA | Multi-Factor Authentication |
| FDI | Foreign Direct Investment |
| NIIS | National Industry Information System |
| MIS | Management Information System |
| KPI | Key Performance Indicator |
| PII | Personally Identifiable Information |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| B2B | Business-to-Business |
| ISIC | International Standard Industrial Classification |
| HS Code | Harmonized System commodity classification |
| Data steward | Authorized person responsible for data definitions and quality |
| Source system | An external system supplying data |
| Golden record | Approved, consolidated enterprise record |
| Submission period | Time period for which enterprise data is collected |
| Data lineage | Traceable history from source to final analytical use |

---

## 6. Product Overview

### 6.1 Main Solution Components

1. **Administrative Web Back Office**
   - User, role, workflow, master-data, integration, data-quality, report, and system administration.

2. **Enterprise and Data Collection Web Application**
   - Enterprise registration, baseline data entry, review, approval, correction, and periodic updates.

3. **Enterprise and Data Collection Mobile App**
   - Enterprise self-service, field data collection, GPS capture, documents, offline entry, synchronization, and linkage requests.

4. **Industry Information and Analytics Web Portal**
   - Dashboards, reports, GIS, benchmarks, market opportunities, enterprise directory, and publications.

5. **Industry Information and Analytics Mobile App**
   - Mobile dashboards, maps, reports, benchmarks, alerts, opportunities, and enterprise discovery.

6. **Integration and ETL Layer**
   - APIs, scheduled jobs, file imports, staging, transformation, validation, reconciliation, and error handling.

7. **Manufacturer Operational Database**
   - Current enterprise records, submissions, workflows, users, documents, and transactional information.

8. **Manufacturing Data Warehouse**
   - Historical, aggregated, analytical, and benchmark data.

9. **Document/Object Storage**
   - Enterprise documents, evidence, imports, reports, and attachments.

10. **GIS Service**
    - Coordinates, administrative boundaries, enterprise locations, infrastructure layers, and spatial analysis.

11. **Notification Service**
    - In-app, push, email, and approved SMS notifications.

12. **Monitoring, Logging, Backup, and Recovery Services**
    - Technical health, audit, backup, restoration, security alerts, and operational support.

### 6.2 High-Level Data Flow

External systems and uploaded datasets shall flow through:

`Source Registration → Extraction/Import → Staging → Profiling → Validation → Transformation → Matching/Deduplication → Approval → Operational Database/Data Warehouse → Dashboards/Reports/GIS/APIs`

Data entered by users shall flow through:

`Draft → Submitted → Automated Validation → Assigned Review → Correction (when required) → Approval → Publication/Warehouse`

---

## 7. User Classes and Roles

### 7.1 Administrative Roles

- Super Administrator
- System Administrator
- Security Administrator
- Integration Administrator
- ETL Administrator
- GIS Administrator
- Report Administrator
- Metadata Administrator
- Data Quality Administrator
- Support Administrator

### 7.2 Government Business Roles

- Federal Administrator
- Federal Data Officer
- Federal Reviewer
- Federal Approver
- Regional Administrator
- Regional Data Officer
- Regional Reviewer
- Regional Approver
- Zone/Sub-city Officer
- Woreda Officer
- Data Collector
- Data Reviewer
- Data Approver
- Data Steward
- Data Quality Officer
- Policy Analyst
- Executive Viewer

### 7.3 Enterprise and External Roles

- Enterprise Owner
- Enterprise Manager
- Enterprise Data Representative
- Buyer
- Supplier
- Investor
- Researcher
- Development Partner
- Public User
- External-System Service Account

### 7.4 Access-Control Principles

The system shall enforce:

- Role-based access.
- Permission-based access.
- Organization-based access.
- Geographic scope.
- Enterprise-level scope.
- Dataset sensitivity.
- Workflow-stage restrictions.
- Data-period restrictions.
- Purpose-based access where applicable.
- Least-privilege access.
- Segregation of duties for submission, review, approval, and publication.

---

## 8. Functional Requirements

Requirement identifiers use the format `FR-<MODULE>-<NUMBER>`.

---

## 8.1 Identity and Access Management

- **FR-IAM-001:** The system shall allow authorized administrators to create, update, activate, suspend, and deactivate user accounts.
- **FR-IAM-002:** The system shall support username/email/phone-based login according to approved policy.
- **FR-IAM-003:** The system shall provide password reset and secure account recovery.
- **FR-IAM-004:** The system shall enforce configurable password rules.
- **FR-IAM-005:** The system shall support MFA for privileged and selected users.
- **FR-IAM-006:** The system shall assign one or more roles to a user.
- **FR-IAM-007:** The system shall assign organization and geographic scope to a user.
- **FR-IAM-008:** The system shall prevent users from accessing records outside their authorized scope.
- **FR-IAM-009:** The system shall record successful and failed login attempts.
- **FR-IAM-010:** The system shall lock accounts after a configurable number of failed attempts.
- **FR-IAM-011:** The system shall support session timeout and manual session termination.
- **FR-IAM-012:** The system shall allow users to manage their profiles and notification preferences.
- **FR-IAM-013:** The system shall provide service accounts for approved system-to-system integrations.
- **FR-IAM-014:** The system shall require acceptance of current terms and privacy notices.
- **FR-IAM-015:** The system shall record role, permission, and access-scope changes.

---

## 8.2 Organization and Geographic Hierarchy

- **FR-ORG-001:** The system shall maintain federal, regional, zone/sub-city, woreda, and optional kebele structures.
- **FR-ORG-002:** The system shall maintain parent-child relationships among administrative units.
- **FR-ORG-003:** The system shall maintain official administrative codes.
- **FR-ORG-004:** The system shall support historical boundary and name changes.
- **FR-ORG-005:** The system shall assign users to administrative units.
- **FR-ORG-006:** The system shall support industrial parks, clusters, and other manufacturing locations.
- **FR-ORG-007:** The system shall import approved geographic master data.
- **FR-ORG-008:** The system shall prevent unauthorized deletion of referenced geographic units.
- **FR-ORG-009:** The system shall support transfer of enterprises when geographic boundaries change.
- **FR-ORG-010:** The system shall record all hierarchy changes in an audit log.

---

## 8.3 Enterprise Registry

- **FR-ENT-001:** The system shall register manufacturing enterprises.
- **FR-ENT-002:** The system shall generate a unique internal enterprise identifier.
- **FR-ENT-003:** The system shall capture legal name, trade name, TIN, registration number, license information, ownership, legal form, establishment date, and operational status.
- **FR-ENT-004:** The system shall classify enterprises by size, sector, subsector, ISIC code, product group, export status, import status, ownership nationality, and FDI status.
- **FR-ENT-005:** The system shall capture owner, manager, and authorized representative details.
- **FR-ENT-006:** The system shall capture addresses and geographic coordinates.
- **FR-ENT-007:** The system shall support multiple facilities, branches, warehouses, and production sites.
- **FR-ENT-008:** The system shall upload and verify enterprise supporting documents.
- **FR-ENT-009:** The system shall detect potential duplicate enterprises using configured matching rules.
- **FR-ENT-010:** The system shall provide authorized duplicate review and merge.
- **FR-ENT-011:** The system shall maintain a golden enterprise record while preserving source records and lineage.
- **FR-ENT-012:** The system shall maintain active, inactive, suspended, closed, under-verification, and archived statuses.
- **FR-ENT-013:** The system shall display enterprise history and last-update information.
- **FR-ENT-014:** The system shall support enterprise search, filtering, export, and authorized bulk update.
- **FR-ENT-015:** The system shall allow an enterprise to dispute incorrect information and request correction.

---

## 8.4 Manufacturing Baseline and Periodic Data Collection

The system shall support collection of the following domains:

1. Establishment identification and spatial information.
2. Persons engaged, wages, and salaries.
3. Products, sales, and services.
4. Stock, purchases, and cost of sales.
5. Raw materials, parts, and inputs.
6. Other industrial costs.
7. Fixed assets and investment.
8. Major problems encountered.
9. ICT access and use.
10. Training and human capital.
11. Technology licensing and capabilities.
12. Sector-specific questions.

Core requirements:

- **FR-DAT-001:** The system shall support baseline, annual, quarterly, campaign-based, and ad hoc data collection.
- **FR-DAT-002:** The system shall allow authorized users to save drafts and resume incomplete forms.
- **FR-DAT-003:** The system shall support multi-step forms, repeating tables, calculated fields, attachments, and conditional fields.
- **FR-DAT-004:** The system shall allow data to be copied from the previous reporting period.
- **FR-DAT-005:** The system shall highlight differences from previous periods.
- **FR-DAT-006:** The system shall validate mandatory fields, data types, ranges, formats, and cross-field relationships.
- **FR-DAT-007:** The system shall record the source, collector, device, location, and submission date where permitted.
- **FR-DAT-008:** The system shall support photo and document evidence.
- **FR-DAT-009:** The system shall support a no-change declaration.
- **FR-DAT-010:** The system shall display submission progress and completion percentage.
- **FR-DAT-011:** The system shall support offline data entry and later synchronization in the mobile application.
- **FR-DAT-012:** The system shall prevent duplicate submissions for the same enterprise, dataset, and period unless authorized.
- **FR-DAT-013:** The system shall maintain form and submission versions.
- **FR-DAT-014:** The system shall support multilingual labels and guidance.
- **FR-DAT-015:** The system shall retain historical submissions.

---

## 8.5 Survey and Dynamic Questionnaire Management

- **FR-FRM-001:** Authorized users shall create questionnaire templates without source-code changes.
- **FR-FRM-002:** Templates shall support text, number, currency, percentage, date, select, multi-select, attachment, GPS, table, and calculated fields.
- **FR-FRM-003:** Administrators shall configure mandatory fields, validation, conditional logic, and skip logic.
- **FR-FRM-004:** Templates shall be assignable by sector, enterprise size, geography, user role, or campaign.
- **FR-FRM-005:** Questionnaires shall have draft, review, published, suspended, retired, and archived statuses.
- **FR-FRM-006:** Published questionnaires shall be versioned.
- **FR-FRM-007:** The system shall preserve the template version used for each submission.
- **FR-FRM-008:** The system shall provide questionnaire preview and test submission.
- **FR-FRM-009:** The system shall define opening, closing, reminder, and grace-period dates.
- **FR-FRM-010:** The system shall monitor assignment and completion status.

---

## 8.6 Review and Approval Workflow

- **FR-WFL-001:** The system shall route submitted records to authorized reviewers.
- **FR-WFL-002:** Workflow shall be configurable by dataset, geography, organization, and risk level.
- **FR-WFL-003:** The workflow may include enterprise confirmation, woreda review, zone review, regional approval, federal approval, and data-quality approval.
- **FR-WFL-004:** Reviewers shall approve, return for correction, reject, escalate, or reassign records.
- **FR-WFL-005:** Correction requests shall include mandatory reasons and optional attachments.
- **FR-WFL-006:** Submitters shall correct and resubmit returned records.
- **FR-WFL-007:** The system shall compare current, previous, and source-system values during review.
- **FR-WFL-008:** The system shall support maker-checker separation.
- **FR-WFL-009:** Approved records shall be locked against normal editing.
- **FR-WFL-010:** Reopening an approved record shall require authorization and a reason.
- **FR-WFL-011:** The system shall maintain full decision history.
- **FR-WFL-012:** The system shall track service-level and overdue tasks.
- **FR-WFL-013:** The system shall notify responsible users about pending and overdue actions.
- **FR-WFL-014:** The system shall provide workflow dashboards and task queues.
- **FR-WFL-015:** Final approval shall control release to the official warehouse and publication layer.

---

## 8.7 Enterprise Owner and Manager Self-Service

- **FR-ESS-001:** Owners/managers shall view their enterprise profile.
- **FR-ESS-002:** Owners/managers shall request changes to contact, address, ownership, management, product, workforce, and selected operational information.
- **FR-ESS-003:** Owners/managers shall upload documents and evidence.
- **FR-ESS-004:** Owners/managers shall confirm or dispute government-collected data.
- **FR-ESS-005:** Owners/managers shall submit periodic data assigned to them.
- **FR-ESS-006:** Owners/managers shall view submission and correction status.
- **FR-ESS-007:** Owners/managers shall receive update reminders.
- **FR-ESS-008:** Owners/managers shall initiate and respond to business-linkage requests.
- **FR-ESS-009:** Owners/managers shall view relevant market and investment opportunities.
- **FR-ESS-010:** Owners/managers shall submit feedback and support requests.

---

## 8.8 B2B Matching and Business Linkage

- **FR-B2B-001:** The system shall maintain profiles for manufacturers, buyers, suppliers, investors, and partners.
- **FR-B2B-002:** Profiles shall include sectors, products, capacity, demand, supply, location, certifications, market interest, and preferred linkage type.
- **FR-B2B-003:** Users shall search and filter approved profiles and opportunities.
- **FR-B2B-004:** The system shall provide configurable matching recommendations.
- **FR-B2B-005:** Matching shall consider approved criteria such as product, sector, capacity, geography, certification, market, and investment need.
- **FR-B2B-006:** The system shall display a matching score and understandable matching reasons.
- **FR-B2B-007:** Authorized users shall publish buying, supplying, investment, partnership, and export opportunities.
- **FR-B2B-008:** Users shall send, accept, reject, withdraw, or request more information for linkage requests.
- **FR-B2B-009:** The system shall track requested, under-discussion, accepted, agreement-reached, completed, rejected, withdrawn, and expired statuses.
- **FR-B2B-010:** Users shall record meetings, agreements, expected value, and outcomes where authorized.
- **FR-B2B-011:** The system shall support reporting, blocking, and moderation of misuse.
- **FR-B2B-012:** The system shall report linkage volume, conversion, sector, region, and outcome indicators.
- **FR-B2B-013:** Confidential contact information shall only be disclosed according to approved consent rules.
- **FR-B2B-014:** Opportunity expiry and automatic closure shall be supported.
- **FR-B2B-015:** Linkage recommendations and responses shall generate notifications.

---

## 8.9 External-System Integration

- **FR-INT-001:** The system shall register each external source, owner, technical contact, legal basis, data owner, update frequency, and supported interface.
- **FR-INT-002:** The system shall support REST APIs, scheduled APIs, secure file transfer, database views where approved, and CSV/Excel/XML/JSON imports.
- **FR-INT-003:** The system shall use secure authentication appropriate to each source.
- **FR-INT-004:** The system shall maintain source-to-target field mappings.
- **FR-INT-005:** The system shall stage imported records before approval.
- **FR-INT-006:** The system shall validate, transform, deduplicate, and reconcile imported data.
- **FR-INT-007:** The system shall record every integration job, record count, success, warning, rejection, and failure.
- **FR-INT-008:** Administrators shall retry or reprocess failed jobs.
- **FR-INT-009:** The system shall support idempotent processing to prevent duplicates.
- **FR-INT-010:** The system shall maintain data lineage to the source record and extraction time.
- **FR-INT-011:** The system shall alert administrators about failed, delayed, or abnormal integrations.
- **FR-INT-012:** The system shall support API versioning and OpenAPI documentation for APIs provided by this project.
- **FR-INT-013:** External data shall not overwrite approved records without configured conflict-resolution rules.
- **FR-INT-014:** The system shall provide reconciliation reports.
- **FR-INT-015:** Integration access shall be restricted to approved datasets and purposes.

Target integrations are detailed in Section 13 and in the separate Integration Matrix.

---

## 8.10 ETL and Data Processing

- **FR-ETL-001:** The system shall extract or receive data from registered sources.
- **FR-ETL-002:** Raw data shall be stored in a controlled staging area.
- **FR-ETL-003:** The system shall profile incoming datasets.
- **FR-ETL-004:** The system shall standardize names, codes, dates, units, currencies, and locations.
- **FR-ETL-005:** The system shall apply transformation and enrichment rules.
- **FR-ETL-006:** The system shall identify exact and probable duplicate records.
- **FR-ETL-007:** The system shall support automated and human-assisted record matching.
- **FR-ETL-008:** The system shall load approved operational and warehouse targets.
- **FR-ETL-009:** ETL jobs shall be scheduled and manually executable by authorized administrators.
- **FR-ETL-010:** Failed records shall be isolated with clear error reasons.
- **FR-ETL-011:** Administrators shall correct mapping or data errors and reprocess records.
- **FR-ETL-012:** ETL execution metrics and logs shall be retained.
- **FR-ETL-013:** Source files shall be archived according to retention policy.
- **FR-ETL-014:** Data reconciliation shall compare source, staging, accepted, rejected, and target counts.
- **FR-ETL-015:** ETL changes shall be versioned and tested before production deployment.

---

## 8.11 Data Quality Management

- **FR-DQ-001:** The system shall maintain configurable data-quality rules.
- **FR-DQ-002:** Rules shall support completeness, validity, uniqueness, consistency, accuracy, timeliness, and integrity checks.
- **FR-DQ-003:** The system shall perform data profiling by source, field, dataset, period, sector, and geography.
- **FR-DQ-004:** The system shall detect missing values, invalid formats, outliers, inconsistent relationships, and probable duplicates.
- **FR-DQ-005:** The system shall calculate data-quality scores.
- **FR-DQ-006:** Quality scores shall be available by enterprise, source, geography, dataset, field, and reporting period.
- **FR-DQ-007:** Quality failures shall create issues assignable to responsible users.
- **FR-DQ-008:** Issues shall have open, assigned, in-correction, resolved, verified, rejected, and closed statuses.
- **FR-DQ-009:** The system shall retain root cause and corrective action.
- **FR-DQ-010:** The system shall support data enrichment using approved external information.
- **FR-DQ-011:** The system shall provide trend and recurring-issue analysis.
- **FR-DQ-012:** The system shall provide completeness, duplicate, inconsistency, and timeliness reports.
- **FR-DQ-013:** Data-quality rules and thresholds shall be versioned.
- **FR-DQ-014:** Users shall only correct records within authorized scope.
- **FR-DQ-015:** Resolved issues shall require verification where configured.

---

## 8.12 Metadata and Data Catalogue

- **FR-MET-001:** The system shall maintain a business glossary.
- **FR-MET-002:** The system shall maintain field, indicator, dataset, API, report, and source definitions.
- **FR-MET-003:** Metadata shall include owner, steward, source, frequency, sensitivity, legal basis, quality rule, and intended use.
- **FR-MET-004:** The system shall maintain data lineage.
- **FR-MET-005:** The system shall maintain source-to-target mappings.
- **FR-MET-006:** Metadata shall be searchable.
- **FR-MET-007:** Metadata changes shall use review, approval, and versioning.
- **FR-MET-008:** Published reports shall reference approved indicator definitions.
- **FR-MET-009:** The system shall distinguish official, provisional, estimated, and archived data.
- **FR-MET-010:** Authorized users shall export the data dictionary and catalogue.

---

## 8.13 Data Warehouse

- **FR-DWH-001:** The system shall maintain historical manufacturing information.
- **FR-DWH-002:** The warehouse shall support enterprise, geography, sector, product, period, ownership, and source dimensions.
- **FR-DWH-003:** The warehouse shall support employment, production, sales, cost, investment, trade, training, technology, and linkage fact datasets.
- **FR-DWH-004:** The warehouse shall preserve historical changes.
- **FR-DWH-005:** The warehouse shall support snapshots and time-series analysis.
- **FR-DWH-006:** The warehouse shall provide aggregated indicators by approved dimensions.
- **FR-DWH-007:** The warehouse shall restrict direct access.
- **FR-DWH-008:** Analytical APIs and reporting views shall expose approved data only.
- **FR-DWH-009:** Refresh status and failures shall be monitored.
- **FR-DWH-010:** Warehouse performance shall support agreed dashboard and report response times.

---

## 8.14 Industry Analysis Dashboards

- **FR-DSH-001:** The system shall provide executive, sector, regional, enterprise, employment, production, sales, investment, trade, technology, ICT, training, market, and data-quality dashboards.
- **FR-DSH-002:** Dashboards shall support date, geography, sector, enterprise size, ownership, product, export status, and other approved filters.
- **FR-DSH-003:** Users shall drill from national to regional, zonal, woreda, sector, and approved enterprise-level detail.
- **FR-DSH-004:** Users shall compare periods, regions, sectors, and enterprise categories.
- **FR-DSH-005:** Dashboards shall show indicator definitions, source, reference period, and last refresh.
- **FR-DSH-006:** Users shall export approved charts and data.
- **FR-DSH-007:** Users shall save personalized dashboard views.
- **FR-DSH-008:** Dashboards shall display provisional and official status.
- **FR-DSH-009:** The mobile analytics app shall provide optimized dashboard summaries.
- **FR-DSH-010:** Sensitive data shall be aggregated or masked according to policy.

---

## 8.15 Statistical and Non-Statistical Reporting

- **FR-RPT-001:** The system shall provide standard reports defined by MoI and EED.
- **FR-RPT-002:** Reports shall include enterprise registry, sector, regional, employment, wages, production, sales, raw material, costs, assets, investment, FDI, capacity, ICT, training, technology, challenges, trade, data quality, linkage, benchmark, GIS, and outlook reports.
- **FR-RPT-003:** Authorized users shall build reports by selecting measures, dimensions, filters, grouping, sorting, and chart type.
- **FR-RPT-004:** Reports shall support PDF, Excel, CSV, image, and print output where appropriate.
- **FR-RPT-005:** Reports shall be saved as templates.
- **FR-RPT-006:** Reports shall be scheduled for approved recipients.
- **FR-RPT-007:** Official reports shall support review, approval, publication, versioning, and archiving.
- **FR-RPT-008:** Reports shall display source, period, generation date, definitions, and confidentiality classification.
- **FR-RPT-009:** The system shall support narrative/non-statistical reports and attachments.
- **FR-RPT-010:** Mobile users shall view and download approved reports.

---

## 8.16 GIS and Spatial Reporting

- **FR-GIS-001:** The system shall capture and maintain enterprise geographic coordinates.
- **FR-GIS-002:** The mobile app shall capture GPS coordinates and accuracy.
- **FR-GIS-003:** Authorized users shall correct locations using a map.
- **FR-GIS-004:** The system shall display enterprise points, clusters, heat maps, and administrative-area thematic maps.
- **FR-GIS-005:** The system shall support approved layers for roads, transport networks, industrial parks, logistics facilities, and other infrastructure.
- **FR-GIS-006:** Maps shall filter by sector, size, product, employment, investment, capacity, export status, and period.
- **FR-GIS-007:** The system shall support density, concentration, proximity, accessibility, and infrastructure-gap analysis.
- **FR-GIS-008:** Users shall open approved enterprise profiles from map results.
- **FR-GIS-009:** Users shall export maps and spatial reports.
- **FR-GIS-010:** Sensitive coordinates shall be generalized or hidden for unauthorized users.
- **FR-GIS-011:** GIS data shall use an approved coordinate reference system.
- **FR-GIS-012:** Administrative boundary versions shall be retained.

---

## 8.17 Benchmark and International Data

- **FR-BMK-001:** The system shall register benchmark sources and methodologies.
- **FR-BMK-002:** The system shall import approved international manufacturing and economic indicators.
- **FR-BMK-003:** Benchmark data shall record source, period, country, sector, unit, currency, methodology, and publication status.
- **FR-BMK-004:** The system shall normalize units and currencies using approved rules.
- **FR-BMK-005:** Users shall compare Ethiopia with selected peer countries.
- **FR-BMK-006:** Users shall compare sectors and approved enterprise groups with benchmarks.
- **FR-BMK-007:** The system shall show trends, rankings, gaps, and definitions.
- **FR-BMK-008:** Benchmark reports and dashboards shall identify source and refresh date.
- **FR-BMK-009:** Licensed data shall only be accessible under its permitted terms.
- **FR-BMK-010:** Source administrators shall schedule and monitor refreshes.

---

## 8.18 Market Opportunities and Industry Outlook

- **FR-MKT-001:** Authorized users shall publish local, export, import-substitution, investment, supplier-development, and partnership opportunities.
- **FR-MKT-002:** Opportunities shall include sector, product, geography, description, eligibility, source, contact rule, opening date, and expiry date.
- **FR-MKT-003:** Users shall search, filter, save, share, and express interest.
- **FR-MKT-004:** The system shall notify matched enterprises.
- **FR-MKT-005:** The system shall publish approved industry trends, risks, growth areas, and outlook analyses.
- **FR-MKT-006:** Publications shall support review and approval.
- **FR-MKT-007:** Expired opportunities shall close automatically.
- **FR-MKT-008:** The system shall report views, interest, matches, and outcomes.
- **FR-MKT-009:** Content shall be categorized by intended audience.
- **FR-MKT-010:** Unverified opportunities shall not be publicly presented as official.

---

## 8.19 Notification and Communication

- **FR-NOT-001:** The system shall support in-app notifications.
- **FR-NOT-002:** Mobile apps shall support push notifications.
- **FR-NOT-003:** The system shall support email and approved SMS notifications.
- **FR-NOT-004:** Notification templates shall be configurable by event and language.
- **FR-NOT-005:** Notifications shall support submission, correction, decision, overdue task, opportunity, linkage, report, document expiry, integration, quality, and maintenance events.
- **FR-NOT-006:** Users shall manage allowed notification preferences.
- **FR-NOT-007:** The system shall retain delivery and read status.
- **FR-NOT-008:** Administrators shall send targeted announcements by role, geography, sector, or organization.
- **FR-NOT-009:** Sensitive information shall not be included in insecure notification channels.
- **FR-NOT-010:** Failed delivery shall be logged.

---

## 8.20 Feedback, Complaint, and Support

- **FR-SUP-001:** Users shall submit feedback, suggestions, complaints, incorrect-data reports, and technical incidents.
- **FR-SUP-002:** Tickets shall include category, description, priority, attachment, and related record.
- **FR-SUP-003:** The system shall generate a reference number.
- **FR-SUP-004:** Tickets shall be assigned, escalated, responded to, resolved, reopened, and closed.
- **FR-SUP-005:** Users shall track ticket status.
- **FR-SUP-006:** The system shall provide FAQ, guides, and contextual help.
- **FR-SUP-007:** Users shall rate resolution satisfaction.
- **FR-SUP-008:** Administrators shall analyze common issues and service performance.
- **FR-SUP-009:** Incorrect-data reports shall route to the responsible data owner.
- **FR-SUP-010:** Complaint confidentiality shall follow approved policy.

---

## 8.21 Document and File Management

- **FR-DOC-001:** The system shall upload, preview, download, categorize, version, archive, and retrieve documents.
- **FR-DOC-002:** Files shall be associated with enterprises, submissions, reviews, opportunities, reports, tickets, or integrations.
- **FR-DOC-003:** File type and size restrictions shall be configurable.
- **FR-DOC-004:** Uploaded files shall be scanned using an approved security mechanism.
- **FR-DOC-005:** Documents shall inherit access controls from their parent record.
- **FR-DOC-006:** Document expiry and verification status shall be supported.
- **FR-DOC-007:** Mobile users shall capture documents using the camera.
- **FR-DOC-008:** The system shall maintain document audit history.
- **FR-DOC-009:** Deleted documents shall follow retention and recovery policy.
- **FR-DOC-010:** Confidential documents shall use secure download authorization.

---

## 8.22 Public and Stakeholder Portal

- **FR-PUB-001:** The system shall provide approved public industry information.
- **FR-PUB-002:** The portal shall include dashboards, reports, maps, publications, opportunities, enterprise directory, product directory, and methodology pages according to publication policy.
- **FR-PUB-003:** Public enterprise fields shall be configurable.
- **FR-PUB-004:** The portal shall support search and filtering.
- **FR-PUB-005:** The portal shall support multilingual content.
- **FR-PUB-006:** The portal shall be responsive and accessible.
- **FR-PUB-007:** Published datasets shall include license, source, period, and update date.
- **FR-PUB-008:** Private and restricted data shall not be exposed.
- **FR-PUB-009:** Content publication shall require approval.
- **FR-PUB-010:** The analytics mobile app shall display approved public and authenticated stakeholder content.

---

## 8.23 Configuration and Master Data

- **FR-CFG-001:** Authorized administrators shall configure sectors, subsectors, ISIC codes, products, units, enterprise sizes, ownership types, investment types, employee categories, raw-material categories, cost categories, asset categories, technology categories, training categories, and challenge categories.
- **FR-CFG-002:** The system shall maintain countries, currencies, languages, administrative codes, report periods, and fiscal years.
- **FR-CFG-003:** Master-data changes shall be versioned and audited.
- **FR-CFG-004:** Referenced master data shall be deactivated rather than deleted.
- **FR-CFG-005:** Master data shall support import and export.
- **FR-CFG-006:** Selected master-data changes shall require approval.
- **FR-CFG-007:** Mobile apps shall synchronize approved master data.
- **FR-CFG-008:** The system shall prevent invalid code combinations.
- **FR-CFG-009:** Effective-from and effective-to dates shall be supported.
- **FR-CFG-010:** Configurations shall differ by environment without source-code changes.

---

## 8.24 Audit, Security, and Privacy

- **FR-SEC-001:** The system shall maintain immutable or tamper-evident audit logs for critical actions.
- **FR-SEC-002:** Audit logs shall include user/service, action, record, old value, new value, date/time, outcome, and technical context.
- **FR-SEC-003:** Data shall be encrypted in transit.
- **FR-SEC-004:** Sensitive data shall be encrypted or otherwise protected at rest.
- **FR-SEC-005:** The system shall enforce least privilege and segregation of duties.
- **FR-SEC-006:** Privileged actions shall require reauthentication or enhanced control where configured.
- **FR-SEC-007:** Sensitive fields shall support masking.
- **FR-SEC-008:** Security events shall generate alerts.
- **FR-SEC-009:** APIs shall enforce authentication, authorization, validation, throttling, and logging.
- **FR-SEC-010:** Mobile apps shall secure local data and tokens.
- **FR-SEC-011:** Remote session invalidation shall be supported.
- **FR-SEC-012:** Data retention and disposal shall follow approved policy.
- **FR-SEC-013:** The system shall support consent and approved information-sharing rules.
- **FR-SEC-014:** Audit access shall be restricted and audited.
- **FR-SEC-015:** Security testing shall be completed before production release.

---

## 8.25 Backup, Recovery, Monitoring, and Administration

- **FR-OPS-001:** The system shall support daily and/or weekly incremental database backups.
- **FR-OPS-002:** The system shall support monthly full database backups.
- **FR-OPS-003:** Source code and configuration shall be backed up whenever approved changes occur.
- **FR-OPS-004:** A full cold/offsite backup shall be maintained securely.
- **FR-OPS-005:** Backups shall be encrypted and access controlled.
- **FR-OPS-006:** Backup success and failure shall be monitored and alerted.
- **FR-OPS-007:** Database, file, configuration, and GIS restoration shall be documented and tested.
- **FR-OPS-008:** RPO and RTO targets shall be approved during design.
- **FR-OPS-009:** The system shall monitor application, API, database, ETL, integration, storage, CPU, memory, and network health.
- **FR-OPS-010:** Centralized error and application logs shall be retained.
- **FR-OPS-011:** Administrators shall view service status and incidents.
- **FR-OPS-012:** The system shall support maintenance mode and planned-maintenance notices.
- **FR-OPS-013:** Mobile application version control and minimum-version enforcement shall be supported.
- **FR-OPS-014:** Recovery drills shall generate reports.
- **FR-OPS-015:** Administrators shall receive operational training.

---

## 8.26 Training and Help

- **FR-TRN-001:** The system shall provide contextual help and tooltips.
- **FR-TRN-002:** User manuals shall be provided for each major user class.
- **FR-TRN-003:** A system-administrator manual shall be provided.
- **FR-TRN-004:** Integration, backup, restoration, deployment, and monitoring guides shall be provided.
- **FR-TRN-005:** Training materials shall be downloadable.
- **FR-TRN-006:** The system may record training sessions, attendance, and assessment.
- **FR-TRN-007:** Mobile apps shall provide onboarding guidance.
- **FR-TRN-008:** Release notes shall be published for approved changes.
- **FR-TRN-009:** Help content shall support approved languages.
- **FR-TRN-010:** User introduction and administrator handover shall be completed before final acceptance.

---

## 9. Mobile Application Requirements

### 9.1 Mobile App A: Enterprise and Data Collection

Required capabilities:

- Authentication and profile.
- Enterprise registration and profile.
- Assigned questionnaires.
- Draft, submit, correct, and track.
- GPS capture.
- Camera and document upload.
- Offline forms and secure local storage.
- Synchronization and conflict handling.
- Enterprise owner/manager confirmation.
- Business-linkage requests.
- Market opportunities.
- Notifications.
- Feedback and support.
- Help and onboarding.

### 9.2 Mobile App B: Industry Information and Analytics

Required capabilities:

- Authentication where required.
- Public and restricted dashboards.
- GIS maps.
- Standard reports.
- Benchmark comparisons.
- Market and investment opportunities.
- Enterprise and product directory.
- Saved content.
- Push notifications.
- Feedback and support.

### 9.3 Mobile Technical Requirements

- Android support is mandatory unless the client approves another priority.
- iOS support shall be confirmed during inception.
- Cross-platform development is recommended.
- Mobile APIs shall use secure transport and token-based authorization.
- Sensitive local data shall be encrypted.
- Offline data shall be scoped to the logged-in user and assigned work.
- Synchronization shall be idempotent.
- Attachment compression shall support low-bandwidth environments.
- The app shall display synchronization errors clearly.
- Remote logout and token revocation shall be supported.
- Accessibility and multilingual presentation shall be considered.
- The system shall capture device information for support without collecting unnecessary personal data.

---

## 10. Core Business Workflows

### 10.1 Enterprise Registration

1. Authorized user starts registration.
2. User enters identification, classification, contact, location, ownership, product, and document information.
3. System checks mandatory fields and probable duplicates.
4. User saves draft or submits.
5. Submission is routed to reviewer.
6. Reviewer approves, returns, or rejects.
7. Approved enterprise receives a unique approved registry status.
8. Record becomes eligible for data collection and approved publication.

### 10.2 Periodic Data Collection

1. Administrator publishes a campaign/questionnaire.
2. System assigns enterprises and responsible users.
3. User downloads or opens assignment.
4. User enters data, optionally offline.
5. System validates and synchronizes.
6. User submits.
7. Review hierarchy evaluates data.
8. Corrections are resolved.
9. Final approved data is loaded into official reporting structures.

### 10.3 External Data Import

1. Integration scheduler or administrator initiates extraction.
2. Raw data is received in staging.
3. Schema and security checks execute.
4. Data profiling and quality validation execute.
5. Mapping and transformation rules execute.
6. Enterprise matching and duplicate checks execute.
7. Exceptions enter an issue queue.
8. Approved records load to operational and/or analytical stores.
9. Reconciliation and lineage records are produced.
10. Dashboards refresh according to schedule.

### 10.4 Business Linkage

1. Authorized organization publishes a profile or opportunity.
2. Matching rules identify relevant parties.
3. User reviews match and sends request/expression of interest.
4. Receiving party accepts, rejects, or requests more information.
5. Parties record interaction and outcome.
6. System closes or expires the linkage.
7. Aggregate outcome metrics feed the dashboard.

### 10.5 Data Quality Issue Resolution

1. Rule or user identifies an issue.
2. System classifies and assigns it.
3. Responsible user investigates and corrects.
4. Data-quality officer verifies.
5. Issue is closed or returned.
6. Root cause and corrective action remain available for analysis.

---

## 11. Data Requirements

### 11.1 Key Entities

- User
- Role
- Permission
- Organization
- AdministrativeUnit
- Enterprise
- EnterpriseSite
- EnterpriseContact
- EnterpriseOwner
- EnterpriseManager
- EnterpriseDocument
- Sector
- Subsector
- Product
- UnitOfMeasure
- ReportingPeriod
- Questionnaire
- QuestionnaireVersion
- Question
- Assignment
- Submission
- SubmissionValue
- ReviewDecision
- WorkflowInstance
- WorkflowTask
- DataQualityRule
- DataQualityResult
- DataQualityIssue
- ExternalSource
- IntegrationDefinition
- IntegrationJob
- StagingRecord
- MappingRule
- ETLJob
- MetadataItem
- Indicator
- Dataset
- WarehouseSnapshot
- Opportunity
- LinkageRequest
- LinkageInteraction
- LinkageOutcome
- Notification
- FeedbackTicket
- Publication
- Report
- Dashboard
- GISLayer
- AuditEvent
- BackupJob
- SystemIncident

### 11.2 Enterprise Data Domains

- Identification and registration.
- Ownership and management.
- Contact and location.
- Sector and product classification.
- Employment and wages.
- Products, production, sales, and services.
- Stock and raw materials.
- Industrial costs.
- Assets and investment.
- Problems and constraints.
- ICT.
- Training and human capital.
- Technology licensing and capability.
- Imports and exports.
- FDI and investment.
- Business linkages.
- Supporting documents.
- Data-quality status.
- Source and lineage.

### 11.3 Data Retention

Retention periods shall be approved by the client. At minimum:

- Official historical statistical data shall not be overwritten.
- Audit records shall be retained according to security and legal policy.
- Raw source files shall be retained according to integration agreements.
- Documents shall follow document type and legal requirements.
- Temporary mobile data shall be removed after successful synchronization according to mobile security policy.
- Backups shall follow approved retention and rotation.

---

## 12. Integration Architecture Principles

- API-first where source systems provide stable APIs.
- File-based controlled integration where APIs are unavailable.
- No direct uncontrolled access to external production databases.
- Staging before official use.
- Source-to-target mapping and lineage.
- Idempotent processing.
- Secure service accounts.
- Versioned interfaces.
- Schema validation.
- Retry with controlled limits.
- Reconciliation.
- Monitoring and alerting.
- Data-sharing agreements before production exchange.
- Minimum-data principle.
- Aggregation where enterprise-level exchange is not authorized.
- Test/sandbox environment before production.

---

## 13. Target Integration Clients and Organizations

The TOR identifies external institutions and data sources. Most are government institutions, not private companies.

### 13.1 Ministry of Industry

**Expected source/system:** Existing Industry Information System / National Industry Information System, subject to client confirmation.

**Expected data:**

- Manufacturing enterprise master records.
- Sector and subsector classifications.
- Large and medium manufacturing survey data.
- Industrial performance indicators.
- Existing imported datasets.
- Manufacturer locations.
- Policy and programme classifications.
- Existing publications and reports.

**Direction:** Primarily inbound to the new data warehouse; selected validated data may be returned to the existing system if approved.

**Required clarification:**

- Exact system name and owner.
- Whether the new solution replaces, extends, or only integrates the existing system.
- API availability.
- Database technology.
- enterprise identifier.
- data refresh frequency.
- record ownership.
- publication rules.

### 13.2 Ethiopian Enterprise Development

**Expected source/system:** Existing EED Management Information System and manufacturing SME datasets.

**Expected data:**

- Manufacturing SME registry.
- Regional, city, zone, and woreda records.
- Enterprise support services.
- Training and business-development services.
- Market-linkage activities.
- Cluster and infrastructure support.
- Finance and leasing support indicators.
- Employment, assets, and enterprise-performance data.

**Direction:** Two-way integration is recommended because EED is both a major data provider and operational user.

**Required clarification:**

- Exact MIS architecture and interface.
- Status of data from all woreda sites.
- authoritative fields.
- duplicate-identification method.
- update ownership between EED and MoI.
- required feedback from the new platform.

### 13.3 Ethiopian Customs Commission

**Expected source/system:** Customs import/export information system; the exact production platform must be confirmed.

**Expected data:**

- Import/export declarations relevant to manufacturers.
- Trader/importer/exporter TIN.
- HS codes.
- product descriptions.
- quantities and units.
- customs values.
- origin and destination countries.
- declaration and clearance dates.
- customs office/port.
- transport mode where authorized.

**Direction:** Primarily inbound analytical integration.

**Required clarification:**

- Exact platform and API.
- enterprise-level access authorization.
- historical-data availability.
- HS-to-manufacturing-product mapping.
- frequency and latency.
- confidentiality and customs restrictions.
- whether only aggregated data may be shared.

### 13.4 Ethiopian Investment Commission

**Expected source/system:** EIC e-service and investment registry, subject to technical confirmation.

**Expected data:**

- Investment permits.
- investor and project information.
- sector and location.
- planned and actual capital where authorized.
- ownership nationality.
- project status.
- expansion information.
- investment incentives.
- industrial park or SEZ association.
- domestic/foreign investment classification.

**Direction:** Primarily inbound; validated manufacturing-sector classifications may be shared back if approved.

**Required clarification:**

- E-service API availability.
- authoritative investment identifier.
- enterprise/TIN matching.
- data-sharing restrictions.
- update frequency.
- access to historical and status data.

### 13.5 National Bank of Ethiopia

**Expected source/system:** Official statistical datasets and approved FDI/external-sector information.

**Expected data:**

- Direct-investment indicators.
- direct investment by country.
- external-sector statistics.
- exchange rates where required.
- macroeconomic indicators used in reports.
- approved aggregated FDI series.

**Direction:** Inbound analytical and benchmark integration.

**Required clarification:**

- Enterprise-level versus aggregate data.
- licensed/public datasets.
- update schedule.
- revision policy.
- approved exchange-rate source.
- data-use restrictions.

### 13.6 Ministry of Labor and Skills / E-LMIS

**Expected source/system:** E-LMIS and other approved labor/skills systems.

**Expected data:**

- Employer records.
- employment and vacancy indicators.
- occupation and skill classifications.
- training and skill-development information.
- workforce statistics.
- labor-market indicators.
- verified employer/labor identifiers where legally authorized.

**Direction:** Primarily inbound; selected manufacturing employer and skill-demand indicators may be exchanged back.

**Required clarification:**

- The TOR contains inconsistent wording about an “Industry Information System at the Ministry of Labor”; the client must confirm whether it means MoI, E-LMIS, or another system.
- API and identity-matching method.
- PII-sharing restrictions.
- aggregate versus person-level data.
- legal basis and consent.
- update frequency.

### 13.7 Digital Market Platform

**Expected source/system:** Not identified precisely in the TOR.

**Potential data:**

- Product listings.
- buyer and supplier profiles.
- demand and supply opportunities.
- transaction or inquiry indicators.
- market prices where authorized.
- enterprise marketplace links.

**Direction:** Potentially two-way.

**Mandatory clarification before design:**

- Platform name.
- owning institution or company.
- technical contact.
- whether the platform currently exists.
- API documentation.
- data ownership.
- authentication method.
- approved datasets.
- whether transaction data is included.
- matching and privacy rules.

### 13.8 International Data Sources

The TOR does not name specific providers. Candidate sources should be approved during inception.

**Recommended candidates:**

- UNIDO for manufacturing value added, industrial performance, and sector indicators.
- World Bank for enterprise, economic, infrastructure, and development indicators.
- UN Comtrade for international trade statistics.
- International Trade Centre for trade and market-access analysis.
- ILOSTAT for labor and employment benchmarks.
- IMF or approved central-bank sources for selected macroeconomic indicators.
- FAOSTAT where agro-processing benchmarks are relevant.
- Regional organizations such as AfCFTA or COMESA where suitable and legally available.

**Required clarification:**

- Free versus licensed source.
- API or bulk-download method.
- permitted redistribution.
- country and sector coverage.
- update frequency.
- methodology compatibility.
- citation requirements.
- currency and unit normalization.

### 13.9 Recommended Additional Integrations Subject to Client Approval

These are not explicitly required in the TOR:

- National digital identity for verified users.
- Tax/TIN verification.
- Business registration and licensing.
- National address or geospatial services.
- SMS and email gateways.
- Map and routing data providers.
- Government interoperability platform.
- Payment service for optional paid publications or services.
- Statistical agency datasets.
- Industrial park administration systems.
- Standards and certification bodies.

They shall not be treated as mandatory until formally approved.

---

## 14. Integration Readiness Checklist

For every target institution, the client and vendor shall obtain:

- Business owner.
- data owner.
- technical owner.
- legal/data-sharing agreement.
- exact system name.
- test and production endpoints.
- API or file specification.
- authentication method.
- IP/network requirements.
- field definitions and samples.
- identifier and matching rules.
- data volume.
- update frequency.
- expected availability.
- rate limits.
- error codes.
- historical-data scope.
- confidentiality classification.
- retention requirements.
- reconciliation process.
- incident-escalation contact.
- change-notification process.
- test cases and acceptance criteria.

---

## 15. Non-Functional Requirements

### 15.1 Performance

- Standard page responses should normally complete within three seconds under agreed load.
- Standard dashboard filters should normally complete within five seconds.
- Long-running reports shall show progress or run asynchronously within the application.
- Bulk imports shall not block interactive use.
- Mobile screens shall be optimized for low bandwidth.
- Performance targets shall be validated through load testing.

### 15.2 Availability and Reliability

- Production availability target shall be agreed during design.
- Critical services shall restart automatically where technically appropriate.
- Integration failures shall not corrupt accepted data.
- All data-changing operations shall use transactional integrity.
- Background jobs shall support safe restart.

### 15.3 Scalability

The design shall support growth in:

- enterprises.
- users.
- woreda sites.
- historical reporting periods.
- documents.
- integration records.
- indicators.
- dashboard users.
- geographic layers.

### 15.4 Usability

- Interfaces shall be consistent and role appropriate.
- Forms shall provide clear validation messages.
- Users shall see workflow and synchronization status.
- Complex forms shall use logical sections.
- Mobile applications shall minimize typing where possible.
- Help and definitions shall be available near unfamiliar fields.

### 15.5 Accessibility

- Web interfaces should conform to an agreed accessibility target.
- Keyboard navigation, focus indicators, readable contrast, labels, and scalable text shall be supported.
- Charts shall provide textual values or accessible alternatives where practical.

### 15.6 Localization

- The system shall support English and Amharic at minimum if approved.
- Additional languages shall be configurable.
- Labels, help, notifications, and master data shall support translation.
- Dates and number formats shall be configurable.

### 15.7 Compatibility

Required baseline stack from the TOR:

- Ubuntu 20.04.2 LTS.
- PostgreSQL 15.
- .NET 7 with upgrade to .NET 8 by final delivery.
- React.js or Angular for web interfaces.
- Open-source tools and technologies.

The final production versions shall be agreed after compatibility and support review.

### 15.8 Maintainability

- Source code shall follow documented standards.
- Automated tests shall cover critical logic.
- APIs shall be documented.
- Deployment shall be repeatable.
- Configuration shall be externalized.
- Logs shall support diagnosis.
- Database migrations shall be version controlled.
- Administrator and developer documentation shall be delivered.

### 15.9 Security

- Secure coding practices.
- Dependency and vulnerability scanning.
- Input validation.
- output encoding.
- protection against common web and API attacks.
- encrypted transport.
- secure secrets management.
- privileged-access controls.
- audit logging.
- security testing before go-live.
- incident response procedures.

---

## 16. Reporting and KPI Catalogue

Initial KPI categories:

- Number of registered enterprises.
- active/inactive enterprises.
- enterprise distribution by size and sector.
- enterprise distribution by geography.
- employment and gender composition.
- wages and payroll.
- production volume and value.
- sales and export value.
- raw-material dependence.
- industrial costs.
- capacity utilization.
- asset and investment value.
- FDI indicators.
- ICT adoption.
- training and skills.
- technology capability.
- major enterprise constraints.
- enterprise survival/growth.
- business-linkage requests.
- linkage conversion and outcomes.
- data completeness and quality.
- submission timeliness.
- review turnaround.
- source-system freshness.
- GIS concentration and infrastructure access.
- international benchmark gaps.

Exact formulas, units, sources, disaggregation, and publication status shall be defined in the indicator catalogue.

---

## 17. Migration Requirements

- Inventory all existing MoI and EED datasets.
- Profile structure, quality, duplicates, and completeness.
- define source priority and golden-record rules.
- map legacy fields to target fields.
- clean and standardize identifiers, names, locations, sectors, and units.
- perform trial migration.
- reconcile source and target counts.
- review exceptions.
- obtain business sign-off.
- execute final migration.
- retain migration logs and source lineage.
- archive source extracts securely.
- prohibit silent overwriting of approved data.

---

## 18. Testing Requirements

The vendor shall provide:

- Unit testing.
- integration testing.
- API testing.
- ETL testing.
- data-quality rule testing.
- migration testing.
- workflow testing.
- security testing.
- role/access testing.
- mobile testing.
- offline/synchronization testing.
- GIS testing.
- performance/load testing.
- backup and restoration testing.
- browser and device compatibility testing.
- user acceptance testing.
- regression testing.
- production verification.

Each requirement shall be traceable to one or more test cases.

---

## 19. Deployment Environments

Recommended environments:

- Development.
- Integration/Test.
- User Acceptance Testing.
- Training.
- Production.
- Disaster Recovery where approved.

Environment access, data masking, credentials, integration endpoints, backup, and release controls shall be documented.

---

## 20. Deliverables

- Inception report.
- Requirements specification.
- Process and workflow models.
- Data model and dictionary.
- Integration assessment and specifications.
- Architecture and security design.
- UI/UX designs and prototypes.
- Configured web systems.
- Mobile application(s).
- Integration and ETL services.
- Data warehouse.
- GIS and reporting capabilities.
- Initial release using backlog/baseline data.
- Final production release.
- Source code.
- Database scripts and migrations.
- API documentation.
- Test plans and reports.
- Data-migration plan and report.
- Deployment and operations guide.
- Backup and recovery guide.
- User manuals.
- Administrator manuals.
- Training materials and training.
- Progress reports every two weeks.
- Two-year implementation support according to contract.

---

## 21. Acceptance Criteria

The solution will be considered functionally acceptable when:

- Approved user roles and geographic restrictions operate correctly.
- Enterprise registry and baseline forms meet signed requirements.
- Mobile data collection works under agreed online/offline scenarios.
- Review and approval workflows are complete and auditable.
- Approved external integrations pass reconciliation tests.
- Data-quality rules and dashboards are operational.
- Data warehouse refreshes approved datasets.
- Standard dashboards, reports, and GIS views match approved indicators.
- B2B linkage workflows meet approved privacy and business rules.
- Public and restricted information are correctly separated.
- Security, performance, backup, and recovery tests pass.
- Baseline data is migrated and reconciled.
- Documentation, source code, and training are delivered.
- UAT issues classified as critical or high are resolved or formally accepted.

---

## 22. Assumptions and Open Decisions

The following require confirmation:

1. Official project/product name.
2. Exact relationship between NIIS, MoI IIS, EED MIS, and the new platform.
3. Mobile delivery as two apps or one role-based app.
4. Android/iOS requirements.
5. Required languages.
6. Offline operating requirements.
7. Data ownership and approval authority.
8. Publication and confidentiality policy.
9. Enterprise identifier and TIN-verification approach.
10. Exact external system names and interface availability.
11. Digital Market Platform owner.
12. GIS provider and infrastructure datasets.
13. Approved international benchmark providers.
14. Data-retention periods.
15. Hosting and disaster-recovery responsibilities.
16. Availability, RPO, and RTO targets.
17. SMS/email providers.
18. Identity and payment integration.
19. Report and KPI formulas.
20. B2B matching and contact-disclosure rules.
21. Personal-data and cross-institution sharing controls.
22. Scope of historical data migration.
23. Whether external systems can consume APIs from the new platform.
24. Data-sharing agreements and technical contacts.
25. Warranty/support service levels.

---

## 23. Requirements Traceability Approach

A traceability matrix shall link:

`TOR Objective → Business Requirement → SRS Requirement → Design Component → User Story → Test Case → UAT Result → Release`

Each change shall include:

- Change request.
- impact analysis.
- approval.
- requirement update.
- design and test update.
- release reference.

---

## 24. Recommended Implementation Priorities

### Phase 1 — Foundation

- Identity and access.
- geographic hierarchy.
- enterprise registry.
- master data.
- baseline forms.
- workflows.
- audit.
- initial mobile data collection.
- migration preparation.

### Phase 2 — Data Integration and Quality

- MoI and EED integration.
- ETL.
- data profiling.
- quality rules.
- warehouse.
- metadata.
- initial dashboards.

### Phase 3 — Analytics and Spatial Information

- full dashboards.
- reports.
- GIS.
- benchmark data.
- public/stakeholder portal.
- analytics mobile app.

### Phase 4 — Market Linkage and Optimization

- B2B profiles.
- matching.
- opportunities.
- outcomes.
- advanced monitoring.
- additional integrations.
- continuous improvement.

---

## 25. Final Note

This draft translates the TOR into a structured software specification. It should be validated through workshops with MoI, EED, regional and woreda representatives, enterprise users, data owners, and every external integration institution before being baselined for development.
