# Manufacturing Business Information System

## Classified Modules and Feature Catalogue

**Version:** 1.0  
**Purpose:** Complete module-based feature inventory with platform allocation  
**Platform codes:**  
- **WB:** Administrative Web Back Office  
- **CW:** Data Collection Web  
- **CM:** Enterprise and Data Collection Mobile App  
- **AW:** Industry Information and Analytics Web Portal  
- **AM:** Industry Information and Analytics Mobile App  
- **SV:** Server/Integration Service  

---

## 1. Identity and Access Management

### Features

- User registration and administrative user creation.
- Login and logout.
- Password reset and change.
- Email/phone verification.
- Multi-factor authentication.
- User-profile management.
- Account activation, suspension, and deactivation.
- Password and session policies.
- Failed-login lockout.
- Active-session management.
- Device/session history.
- Role-based access control.
- Permission-based access control.
- Organization-based access.
- Geographic access scope.
- Enterprise-level access.
- Dataset sensitivity restrictions.
- Temporary delegation.
- Service accounts for integration.
- Terms, privacy, and consent acceptance.
- Login and access audit.

**Platforms:** WB, CW, CM, AW, AM, SV  
**Mobile requirement:** Yes, user-facing functions only.

---

## 2. Organization and Geographic Hierarchy

### Features

- Federal organization setup.
- Region setup.
- Zone/sub-city setup.
- Woreda setup.
- Optional kebele setup.
- Parent-child relationships.
- Official geographic codes.
- Administrative-boundary versioning.
- Industrial park setup.
- Manufacturing-cluster setup.
- Government office setup.
- User assignment to administrative units.
- Enterprise transfer between units.
- Historical name/boundary tracking.
- Geographic master-data import.
- Activation/deactivation.
- Hierarchy audit.

**Platforms:** WB, CW, CM (selection/view), AW, AM (filter/view)  
**Mobile requirement:** Partial.

---

## 3. Enterprise Registry

### Features

#### Identification

- Enterprise legal name.
- Trade name.
- Previous name.
- Unique system identifier.
- TIN.
- registration number.
- business/manufacturing license.
- establishment year.
- start of production.
- legal form.
- ownership type.
- enterprise size.
- operational status.
- registration source.

#### Classification

- Sector and subsector.
- ISIC.
- product groups.
- micro/small/medium/large classification.
- domestic/foreign ownership.
- FDI classification.
- import/export status.
- industrial park/cluster.
- technology level.
- production scale.

#### Contact and Management

- Phone.
- email.
- website.
- physical and postal address.
- owner.
- manager.
- authorized representative.
- alternative contact.
- social links where approved.

#### Location

- Region, zone, woreda, kebele.
- locality and street.
- latitude/longitude.
- GPS capture.
- map selection.
- coordinate accuracy.
- head office.
- branches.
- production facilities.
- warehouses.
- multiple operating locations.

#### Documents

- Registration certificate.
- business license.
- investment permit.
- tax document.
- ownership evidence.
- sector certificates.
- other attachments.
- document verification.
- expiry tracking.
- versioning.

#### Administration

- Search and filters.
- duplicate detection.
- duplicate review and merge.
- golden record.
- source lineage.
- status management.
- correction request.
- dispute incorrect record.
- enterprise history.
- import/export of lists.
- authorized bulk update.

**Platforms:** WB, CW, CM, AW/AM for approved directory fields  
**Mobile requirement:** Yes.

---

## 4. Manufacturing Baseline and Periodic Data Collection

### 4.1 Establishment and Spatial Information

- Establishment identity.
- economic activity.
- ownership.
- operating status.
- working days and shifts.
- production capacity.
- utilization.
- GPS and address.
- operating sites.

### 4.2 Employment, Wages, and Salaries

- Total employment.
- permanent, temporary, and contract workers.
- gender.
- age groups.
- education.
- occupations.
- skill categories.
- local/foreign workers.
- disability indicators.
- payroll.
- wage/salary ranges.
- vacancies.
- turnover.
- jobs created.

### 4.3 Products, Sales, and Services

- Product catalogue.
- product code and category.
- units.
- quantity produced.
- capacity.
- quantity sold.
- local sales.
- export sales.
- price.
- revenue.
- customers.
- markets.
- export destination.

### 4.4 Stock and Cost of Sales

- Opening and closing stock.
- finished goods.
- work in progress.
- raw materials.
- spare parts.
- inventory value.
- stock loss.
- obsolete stock.
- cost of goods sold.

### 4.5 Raw Materials, Parts, and Inputs

- Input type and name.
- source country.
- local/imported.
- supplier.
- quantity and unit.
- unit and total cost.
- logistics and customs cost.
- shortage.
- alternatives.
- dependency indicators.

### 4.6 Other Industrial Costs

- Electricity.
- water.
- fuel.
- transportation.
- rent.
- maintenance.
- telecommunications.
- insurance.
- administration.
- licensing.
- taxes.
- waste management.
- other operating costs.

### 4.7 Fixed Assets and Investment

- Land.
- buildings.
- machinery.
- vehicles.
- ICT equipment.
- furniture.
- other assets.
- value.
- age.
- condition.
- depreciation.
- new investment.
- domestic/foreign investment.
- finance source.
- expansion.
- planned investment.

### 4.8 Major Problems Encountered

- Finance.
- market access.
- raw materials.
- foreign currency.
- power.
- water.
- logistics.
- regulation.
- tax.
- skills.
- technology.
- infrastructure.
- competition.
- import/export barriers.
- ranking and comments.

### 4.9 ICT Access and Use

- Internet access/type/reliability.
- computers and mobile devices.
- accounting software.
- ERP.
- e-commerce.
- digital payments.
- website.
- cloud services.
- cybersecurity.
- digital skills.

### 4.10 Training and Human Capital

- Training programme.
- subject.
- provider.
- participant count.
- duration.
- cost.
- skill gaps.
- planned training.
- internship.
- TVET/university partnerships.

### 4.11 Technology Licensing and Capability

- Technology type and source.
- supplier.
- license.
- technology transfer.
- patents.
- R&D.
- innovation.
- automation level.
- machinery origin.
- support needs.
- upgrade plans.

### 4.12 Sector-Specific Questions

- Dynamic sector questionnaires.
- conditional questions.
- sector-specific indicators.
- product and production fields.
- compliance questions.
- custom tables and attachments.

### General Collection Features

- Draft and resume.
- multi-step forms.
- dynamic fields.
- mandatory and conditional fields.
- calculations.
- validation.
- attachment/camera.
- GPS.
- periodic campaigns.
- copy previous period.
- compare prior submission.
- no-change declaration.
- submission progress.
- offline collection.
- synchronization.
- low-bandwidth support.
- multilingual forms.
- form and data versioning.

**Platforms:** CW, CM, WB  
**Mobile requirement:** Yes; offline mode strongly recommended.

---

## 5. Survey and Questionnaire Management

### Features

- Questionnaire builder.
- sections and pages.
- text, number, currency, percentage, date fields.
- single-select and multi-select.
- table/repeating groups.
- calculated fields.
- attachment and GPS.
- mandatory rules.
- validation rules.
- conditional and skip logic.
- assignment by sector, size, geography, and role.
- opening/closing dates.
- campaign schedules.
- preview/testing.
- versioning.
- publish/suspend/retire.
- completion monitoring.
- reopening.
- result export.

**Platforms:** WB for design; CW/CM for completion  
**Mobile requirement:** Partial.

---

## 6. Review and Approval Workflow

### Features

- Submission.
- automated validation.
- task assignment.
- reviewer queue.
- reassign.
- approve.
- partial approve.
- return for correction.
- reject.
- mandatory reason.
- comments and attachments.
- multi-level approval.
- enterprise confirmation.
- woreda review.
- zone review.
- regional approval.
- federal approval.
- data-quality approval.
- comparison with prior period/source.
- escalation.
- overdue tracking.
- record lock.
- authorized reopening.
- decision history.
- notifications.
- workflow dashboards.
- service-level reports.

**Platforms:** WB, CW, CM (submission/correction/status and selected review)  
**Mobile requirement:** Partial but important.

---

## 7. Enterprise Owner and Manager Self-Service

### Features

- View enterprise profile.
- update contact and management.
- update address/location.
- update product catalogue.
- update selected production/workforce information.
- upload documents.
- confirm collected data.
- dispute incorrect data.
- submit correction.
- periodic submission.
- status tracking.
- update reminders.
- previous submissions.
- initiate linkage.
- respond to linkage.
- browse opportunities.
- saved opportunities.
- notifications.
- feedback and support.

**Platforms:** CW, CM  
**Mobile requirement:** Mandatory.

---

## 8. B2B Matching and Business Linkage

### Features

#### Profiles

- Manufacturer profile.
- buyer profile.
- supplier profile.
- investor profile.
- partner profile.
- products/services.
- demand/supply.
- production capacity.
- certifications.
- market preferences.
- investment interest.
- regions and sectors.

#### Search and Matching

- Enterprise search.
- product search.
- buyer/supplier/investor search.
- sector/location/capacity/certification filters.
- matching recommendations.
- matching score.
- matching explanation.
- saved searches.
- suggested organizations.

#### Opportunities

- Buying opportunity.
- supplying opportunity.
- investment opportunity.
- partnership opportunity.
- export opportunity.
- expiry.
- eligibility.
- attachments.
- expression of interest.
- moderation.

#### Linkage Workflow

- Send request.
- accept.
- reject.
- request information.
- withdraw.
- expire.
- record meeting.
- record agreement.
- record result/value.
- complete/close.
- rate experience.
- report misuse.
- block organization.
- linkage history.
- conversion dashboard.

**Platforms:** WB, CW, CM, AW, AM  
**Mobile requirement:** Yes.

---

## 9. External Integration Management

### Features

- Source-system registry.
- system owner and contacts.
- legal/data-sharing basis.
- REST API.
- secure file transfer.
- CSV/Excel/XML/JSON imports.
- optional approved database view.
- authentication and certificates.
- source-to-target mapping.
- code mapping.
- transformation rules.
- schedule.
- manual run.
- monitoring.
- record counts.
- error logs.
- retry/reprocess.
- idempotency.
- duplicate handling.
- conflict rules.
- reconciliation.
- lineage.
- alerts.
- API versioning.
- OpenAPI documentation.
- sandbox/test environment.
- credential rotation.
- integration audit.

**Platforms:** WB, SV  
**Mobile requirement:** No.

---

## 10. ETL and Data Processing

### Features

- Extract/receive.
- raw staging.
- schema validation.
- profiling.
- standardization.
- cleaning.
- normalization.
- code mapping.
- unit conversion.
- currency conversion.
- enrichment.
- enterprise matching.
- duplicate detection.
- transformation.
- load operational database.
- load warehouse.
- scheduling.
- manual execution.
- pause/restart.
- quarantine failed records.
- correction and reprocessing.
- job history.
- reconciliation.
- source archive.
- lineage.
- ETL versioning.

**Platforms:** WB, SV  
**Mobile requirement:** No.

---

## 11. Data Quality Management

### Features

- Required-field checks.
- type/format/range validation.
- cross-field validation.
- reference-data validation.
- duplicate detection.
- outlier detection.
- historical consistency.
- completeness profiling.
- uniqueness profiling.
- distribution/pattern profiling.
- relationship analysis.
- anomaly detection.
- enrichment.
- data-quality score.
- score by enterprise/source/region/dataset.
- quality dashboard.
- quality issues.
- assignment and correction.
- verification.
- root cause.
- corrective action.
- trend analysis.
- recurring issues.
- quality rule versioning.
- threshold configuration.

**Platforms:** WB, CW, CM (own correction only)  
**Mobile requirement:** Partial.

---

## 12. Metadata and Data Catalogue

### Features

- Business glossary.
- data dictionary.
- indicator catalogue.
- dataset catalogue.
- source catalogue.
- API catalogue.
- report catalogue.
- field definitions.
- owner and steward.
- update frequency.
- sensitivity.
- intended use.
- lineage.
- source-to-target mapping.
- quality-rule reference.
- search.
- review and approval.
- versioning.
- export.
- official/provisional/estimated classification.

**Platforms:** WB, AW read-only selected definitions  
**Mobile requirement:** No, except contextual read-only definitions.

---

## 13. Manufacturing Data Warehouse

### Features

- Historical enterprise data.
- time-series and snapshots.
- enterprise dimension.
- geography dimension.
- sector/product dimensions.
- ownership/source/period dimensions.
- employment facts.
- production and sales facts.
- cost and raw-material facts.
- investment and asset facts.
- import/export facts.
- training and technology facts.
- linkage facts.
- aggregation.
- calculated KPIs.
- warehouse refresh.
- analytical views/APIs.
- archive and retention.
- performance optimization.
- controlled access.

**Platforms:** SV  
**Mobile requirement:** No.

---

## 14. Industry Analysis Dashboards

### Dashboard Groups

- Executive summary.
- enterprise registry.
- sector performance.
- geographic performance.
- employment and wages.
- production and capacity.
- sales and markets.
- raw materials and costs.
- assets and investment.
- FDI.
- import/export.
- ICT adoption.
- training and skills.
- technology capability.
- enterprise challenges.
- market opportunities.
- B2B linkage.
- data quality.
- source freshness.
- industry outlook.

### Interaction Features

- Date/period filters.
- region/zone/woreda filters.
- sector/subsector/product filters.
- size/ownership/status filters.
- drill down.
- drill through.
- comparisons.
- trend charts.
- maps.
- indicator definitions.
- source and refresh date.
- save view.
- share.
- export.
- presentation mode.
- mobile summaries.

**Platforms:** AW, AM, WB  
**Mobile requirement:** Yes.

---

## 15. Statistical and Non-Statistical Reporting

### Standard Reports

- Enterprise registry.
- sector.
- regional.
- employment.
- gender.
- wages.
- production.
- sales.
- capacity.
- raw materials.
- industrial costs.
- assets.
- investment.
- FDI.
- import/export.
- ICT.
- training.
- technology.
- constraints.
- data quality.
- business linkage.
- value chain.
- industry outlook.
- benchmark.
- GIS.

### Report Builder

- Dataset selection.
- measures and dimensions.
- filters.
- grouping and sorting.
- totals, averages, percentages.
- chart/table.
- saved templates.
- schedule.
- review/approval.
- publication.
- versioning.
- archive.
- PDF/Excel/CSV/image/print.
- access control.
- report catalogue.

**Platforms:** WB, AW, AM (standard view/download)  
**Mobile requirement:** Partial.

---

## 16. GIS and Spatial Reporting

### Features

- GPS capture.
- coordinate validation.
- map correction.
- geocoding/reverse geocoding.
- multiple enterprise locations.
- point map.
- marker clusters.
- heat maps.
- choropleth maps.
- region/zone/woreda boundaries.
- industrial parks and clusters.
- road and transport layers.
- logistics facilities.
- warehouses/dry ports where available.
- sector/size/product/employment/investment filters.
- density analysis.
- concentration analysis.
- proximity analysis.
- accessibility analysis.
- infrastructure-gap analysis.
- enterprise profile from map.
- map export/share/print.
- location privacy/generalization.
- GIS layer management.

**Platforms:** WB, CW, CM, AW, AM  
**Mobile requirement:** Yes.

---

## 17. Benchmark and International Data

### Features

- Source registration.
- country and sector indicators.
- methodology.
- reference period.
- unit and currency.
- normalization.
- exchange-rate application.
- peer-country selection.
- country comparison.
- sector comparison.
- productivity comparison.
- employment/wage comparison.
- production/export comparison.
- technology/capacity comparison.
- ranking.
- trend.
- gap analysis.
- source citation.
- refresh schedule.
- licensed-data restrictions.
- benchmark dashboard/report.

**Platforms:** WB, AW, AM, SV  
**Mobile requirement:** Partial.

---

## 18. Market Opportunity and Industry Outlook

### Features

- Local-market opportunity.
- export opportunity.
- import-substitution opportunity.
- investment opportunity.
- supplier-development opportunity.
- partnership opportunity.
- sector/product/geography.
- source and evidence.
- opening/expiry dates.
- eligibility.
- attachments.
- search/filter/save/share.
- expression of interest.
- matched-enterprise notification.
- views and responses.
- opportunity outcomes.
- industry trend.
- emerging sector.
- risk.
- policy-impact analysis.
- publication approval.
- official/unverified status.

**Platforms:** WB, CW, CM, AW, AM  
**Mobile requirement:** Yes.

---

## 19. Notification and Communication

### Features

- In-app notifications.
- mobile push.
- email.
- approved SMS.
- templates.
- multilingual notifications.
- submission and decision notices.
- correction and overdue reminders.
- campaign reminders.
- document expiry.
- linkage and opportunity alerts.
- report publication.
- integration failure.
- quality issue.
- system maintenance.
- targeted announcement.
- user preferences.
- read/unread.
- delivery status.
- history.
- failed-delivery log.

**Platforms:** WB, CW, CM, AW, AM, SV  
**Mobile requirement:** Yes.

---

## 20. Feedback, Complaint, and Support

### Features

- Feedback.
- suggestion.
- complaint.
- incorrect-data report.
- technical issue.
- misuse report.
- category and priority.
- screenshot/attachment.
- ticket number.
- assignment.
- escalation.
- response.
- resolution.
- reopen/close.
- status tracking.
- satisfaction rating.
- FAQ.
- help articles.
- contact support.
- support dashboard.
- common-issue analysis.
- response-time reporting.

**Platforms:** WB, CW, CM, AW, AM  
**Mobile requirement:** Yes.

---

## 21. Document and File Management

### Features

- Upload.
- camera capture.
- preview.
- download.
- categorize.
- associate with records.
- version.
- verification.
- expiry.
- search.
- archive/restore.
- file size/type validation.
- security scanning.
- access inheritance.
- secure download.
- audit.
- retention.
- deletion controls.

**Platforms:** WB, CW, CM, AW/AM for approved downloads  
**Mobile requirement:** Partial.

---

## 22. Public and Stakeholder Information Portal

### Features

- Public homepage.
- industry summary.
- approved dashboards.
- approved maps.
- publications.
- reports.
- enterprise directory.
- product directory.
- market opportunities.
- investor/buyer information.
- search and filters.
- featured sectors/enterprises.
- notices/news.
- downloadable public datasets.
- methodology.
- data sources.
- FAQ.
- contact.
- multilingual content.
- responsive design.
- accessibility.
- social sharing.
- public/private content separation.

**Platforms:** AW, AM  
**Mobile requirement:** Yes through analytics app and responsive web.

---

## 23. Configuration and Master Data

### Features

- Enterprise types/sizes.
- sectors/subsectors.
- ISIC.
- products.
- units.
- ownership.
- investment types.
- funding sources.
- employee categories.
- raw-material categories.
- cost categories.
- asset categories.
- problems.
- technology.
- training.
- countries.
- currencies.
- languages.
- report periods.
- fiscal years.
- workflow statuses.
- approval levels.
- quality thresholds.
- file restrictions.
- notification templates.
- system parameters.
- mobile versions.
- import/export.
- review/approval.
- versioning and effective dates.

**Platforms:** WB; synchronized to CW/CM/AW/AM  
**Mobile requirement:** No configuration.

---

## 24. Audit, Security, and Privacy

### Features

- Login audit.
- user action audit.
- data-change audit.
- old/new values.
- workflow audit.
- integration audit.
- report/publication audit.
- document audit.
- date, user, device, IP, outcome.
- search and export.
- tamper protection.
- RBAC and geographic restrictions.
- encryption in transit/at rest.
- MFA.
- secure APIs.
- password policies.
- suspicious-activity alerts.
- data masking.
- sensitivity classification.
- consent.
- retention.
- secure mobile storage.
- remote logout.
- vulnerability and security reports.
- incident response.

**Platforms:** WB, SV; controls apply to all apps  
**Mobile requirement:** Security controls only.

---

## 25. Backup, Recovery, and Disaster Recovery

### Features

- Daily incremental backup.
- weekly incremental backup.
- monthly full backup.
- source-code/configuration backup.
- document and GIS backup.
- offsite/cold backup.
- encryption.
- retention and rotation.
- success/failure monitoring.
- restore database/files/configuration.
- point-in-time recovery.
- recovery testing.
- RPO/RTO monitoring.
- recovery report.
- administrator guide.
- restricted recovery permissions.

**Platforms:** WB, SV  
**Mobile requirement:** No.

---

## 26. Technical Monitoring and Administration

### Features

- Application health.
- API health.
- database health.
- ETL/integration monitoring.
- CPU/memory/storage/network.
- uptime.
- centralized logging.
- error tracking.
- slow query.
- failed job.
- mobile error monitoring.
- service status.
- alerts.
- maintenance mode.
- release version.
- mobile minimum version.
- environment configuration.
- incident management.
- technical-support dashboard.

**Platforms:** WB, SV  
**Mobile requirement:** No.

---

## 27. Training, Help, and Knowledge

### Features

- User manuals.
- administrator manual.
- integration guide.
- backup/recovery guide.
- deployment guide.
- mobile guide.
- field collector guide.
- enterprise guide.
- videos.
- onboarding.
- contextual help.
- tooltips.
- FAQ.
- knowledge articles.
- training schedule.
- material download.
- attendance.
- assessment.
- release notes.
- system announcements.
- multilingual help.

**Platforms:** WB, CW, CM, AW, AM  
**Mobile requirement:** Partial.

---

## 28. Mobile Offline and Synchronization

### Features

- Secure offline session.
- assigned forms download.
- master-data download.
- offline drafts.
- offline create/edit.
- GPS/photo capture.
- upload queue.
- connectivity detection.
- automatic/manual sync.
- progress.
- retry.
- idempotency.
- duplicate prevention.
- conflict resolution.
- sync history.
- local encryption.
- cleanup after successful sync.
- remote logout.
- low-bandwidth mode.
- attachment compression.
- minimum-version control.

**Platforms:** CM, SV, WB monitoring  
**Mobile requirement:** Mandatory recommendation for nationwide collection.

---

# Platform Summary

| Module | WB | CW | CM | AW | AM | SV |
|---|---:|---:|---:|---:|---:|---:|
| Identity and access | Yes | Yes | Yes | Yes | Yes | Yes |
| Geographic hierarchy | Yes | Yes | Limited | Yes | Limited | No |
| Enterprise registry | Yes | Yes | Yes | Directory | Directory | No |
| Baseline collection | Yes | Yes | Yes | No | No | Yes |
| Questionnaire management | Yes | Complete | Complete | No | No | Yes |
| Review and approval | Yes | Yes | Partial | No | No | Yes |
| Enterprise self-service | Limited | Yes | Yes | Limited | Limited | No |
| B2B linkage | Yes | Yes | Yes | Yes | Yes | Yes |
| External integration | Yes | No | No | No | No | Yes |
| ETL | Yes | No | No | No | No | Yes |
| Data quality | Yes | Correction | Correction | Dashboard | Summary | Yes |
| Metadata | Yes | Read | Read | Read | Read | Yes |
| Warehouse | No | No | No | Consumer | Consumer | Yes |
| Dashboards | Admin | Limited | Limited | Yes | Yes | Yes |
| Reports | Yes | View | View | Yes | Yes | Yes |
| GIS | Yes | Yes | GPS/view | Yes | Yes | Yes |
| Benchmark | Yes | View | View | Yes | Yes | Yes |
| Opportunities | Yes | Yes | Yes | Yes | Yes | Yes |
| Notifications | Yes | Yes | Yes | Yes | Yes | Yes |
| Feedback/support | Yes | Yes | Yes | Yes | Yes | Yes |
| Documents | Yes | Yes | Yes | View | View | Yes |
| Public portal | Admin | No | No | Yes | Yes | Yes |
| Configuration | Yes | Consumer | Consumer | Consumer | Consumer | Yes |
| Audit/security | Yes | Controlled | Controlled | Controlled | Controlled | Yes |
| Backup/recovery | Yes | No | No | No | No | Yes |
| Monitoring | Yes | No | No | No | No | Yes |
| Training/help | Yes | Yes | Yes | Yes | Yes | No |
| Offline/sync | Monitor | No | Yes | No | Optional | Yes |

---

# Recommended Product Packaging

1. **Administrative Web Back Office**
2. **Enterprise and Data Collection Web Application**
3. **Enterprise and Data Collection Mobile App**
4. **Industry Information and Analytics Web Portal**
5. **Industry Information and Analytics Mobile App**
6. **Integration, ETL, Warehouse, GIS, Notification, Monitoring, and Backup Services**

A single role-based mobile application is technically possible, but two mobile applications provide clearer separation between sensitive data collection and wider information consumption.
