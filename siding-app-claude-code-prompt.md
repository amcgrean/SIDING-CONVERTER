# Claude Code Prompt: Beisser Lumber — Siding Estimator & Converter

## Project Overview

Build a production-ready web application for Beisser Lumber estimators with two core features in a tabbed interface:

1. **Calculator Tab** — Estimators enter building dimensions and parameters, the app calculates a complete siding material list, and outputs a CSV formatted for Agility ERP import.
2. **Converter Tab** — Estimators paste or upload an existing takeoff CSV and convert it between LP SmartSide, James Hardie, and Vinyl product lines, also outputting an Agility ERP import CSV.

This is an internal tool used daily by estimators. It must be fast, reliable, and forgiving of input variation.

---

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **papaparse** for CSV parsing
- **pdfjs-dist** for PDF text extraction in Converter tab
- Deploy to **Vercel**

---

## Design Direction

Industrial/utilitarian aesthetic — this is a professional trade tool, not a consumer app. Think blueprint paper, heavy typography, high contrast. Use a dark navy or slate base with a sharp amber or safety-orange accent. Avoid anything that looks generic or "AI-generated." The UI should feel like it belongs on a job site laptop.

---

## Tab 1: Calculator

### User Inputs (form fields)

| Field | Type | Options / Notes |
|---|---|---|
| Siding Type | Select | LP, Hardie, Vinyl |
| Building Width (ft) | Number | Gable-end width |
| Building Length (ft) | Number | |
| Wall Height (ft) | Number | User enters this — no hardcoded default |
| Roof Slope | Select | 4:12, 5:12, 6:12, 7:12, 8:12 |
| Roof Overhang | Select | 12", 16", 24" |
| Overhead Doors | Select | 0, 1, 2 |
| Service Doors | Select | 0, 1, 2 |
| Windows | Select | 0, 1, 2, 3, 4, 5, 6 |
| Wrap Windows | Toggle | Yes / No — only shown when windows > 0 |
| Job Number | Text | Optional — passed through to ERP CSV |
| Branch | Text | Optional — passed through to ERP CSV |

### Intermediate Calculated Values

These are intermediate values used in item formulas. Calculate them first, then use them to resolve each line item:

```
overhangFt       = roofOverhangInches / 12
roofRise         = roofSlope numerator (e.g. 4 for "4:12")
roofRun          = 12

soffitLF         = ROUNDUP(((length * 2) + 2) * 1.05)
                   — eave soffit LF for both long sides + 5% waste

gableSF          = (width / 2) * (roofRise / roofRun) * ((width + overhangFt) / 2) * 2
                   — area of both gable-end triangles

wallSheathingSF  = (((width + length) * 2) * wallHeight) + gableSF
                   — full wall perimeter * height, plus gable triangles

rakeLF           = SQRT((roofRise/roofRun * (width/2))^2 + ((width/2) + overhangFt)^2) * 4
                   — sloped rake edge length for all 4 rake edges
```

### Coverage Table (by siding type)

Use this table to resolve `boardLengthLF`, `sfPerBoard`, `piecesPerSq`, `tinShinglesPerBoard`, `zFlashLFPerPiece`, and `wasteFactor` for all formulas below.

| sidingType | boardLengthLF | sfPerBoard | piecesPerSq | tinShinglesPerBoard | zFlashLFPerPiece | wasteFactor |
|---|---|---|---|---|---|---|
| LP | 16 | 9.33 | 16 | 2 | 10 | 1.2 |
| Hardie | 12 | 7.00 | 12 | 2 | 10 | 1.2 |
| Vinyl | 12 | 8.33 | 50 | 0 | 0 | 1.05 |

---

### Line Item Formulas

Calculate each row and resolve the correct item code from the output table below. A quantity of 0 means the row should be hidden in the UI and excluded from CSV export.

**Row 35 — 8" Lap Siding** (LP, Hardie, Vinyl)
```
lapSidingBoards = ROUNDUP((wallSheathingSF + gableSF) / sfPerBoard)
```
> Note: store `lapSidingBoards` as an intermediate — it's reused in Row 50.

**Row 36 — 12" Soffit Vent** (only when roofOverhangInches === 12)
```
qty = ROUNDUP((soffitLF / boardLengthLF) * wasteFactor)
```

**Row 37 — 16" Soffit Vent** (only when roofOverhangInches === 16)
```
qty = ROUNDUP((soffitLF / boardLengthLF) * wasteFactor)
```

**Row 38 — 24" Soffit Vent** (only when roofOverhangInches === 24)
```
qty = ROUNDUP((soffitLF / boardLengthLF) * 1.2)
```

**Row 39 — 12" Rake Board** (LP, Hardie, Vinyl)
```
qty = ROUNDUP((rakeLF / boardLengthLF) * 1.2)
```

**Row 40 — Vinyl J-Channel** (Vinyl only)
```
qty = ROUNDUP((rakeLF + soffitLF + (serviceDoors + windows) * 15) / 12)
```

**Row 41 — Metal Starter Strip** (Vinyl only)
```
qty = ROUNDUP(((width + length) * 2) / 12)
```

**Row 42 — Single Under-Sill Trim** (Vinyl only)
```
qty = ROUNDUP((windows * 5) / 12)
```

**Row 43 — Rollex Starter** (Vinyl only)
```
qty = ROUNDUP((rakeLF + soffitLF) / 12)
```

**Row 44 — MD Divider** (Vinyl only)
```
qty = 1
```

**Row 45 — Steel Nails (Vinyl)** (Vinyl only)
```
qty = 1
```

**Row 46 — Vinyl Lineal (Window Wrap)** (Vinyl only, and only when wrapWindows === true)
```
qty = ROUNDUP(((serviceDoors + windows) * 15) / 20)
```

**Row 47 — 1x6 Fascia / Trim** (LP, Hardie, Vinyl)
```
qty = ROUNDUP((overheadDoors * 32) / boardLengthLF)
```

**Row 48 — 1x8 Soffit / Rake Trim** (LP, Hardie, Vinyl)
```
qty = ROUNDUP(((soffitLF + rakeLF) / boardLengthLF) * 1.2)
```

**Row 49 — 5/4x6 Corner / Door Trim** (LP, Hardie, Vinyl)
```
LP / Hardie:
  qty = ROUNDUP(8 + (serviceDoors * 17 + (wrapWindows ? windows * 16 : 0) + overheadDoors * 32) / boardLengthLF)

Vinyl:
  qty = 4
```

**Row 50 — Tin Step Flashing** (LP, Hardie only)
```
qty = ROUNDUP(lapSidingBoards / tinShinglesPerBoard)
```

**Row 51 — Z-Flashing** (LP, Hardie only)
```
qty = ROUNDUP((overheadDoors * 16 + windows * 4 + serviceDoors * 3) / zFlashLFPerPiece)
```

**Row 52 — Caulk** (LP, Hardie, Vinyl)
```
qty = 20
```

**Row 53 — 10d Galvanized Nails** (LP, Hardie, Vinyl)
```
qty = 5
```

**Row 54 — 16d Galvanized Nails** (LP, Hardie, Vinyl)
```
qty = 5
```

**Row 55 — Roofing Nails** (LP, Hardie, Vinyl)
```
LP or Hardie: qty = 10
Vinyl:        qty = 20
```

---

### Item Code Table (for Calculator output)

Resolve item codes at runtime using the selected `sidingType`. This is the source of truth for SKUs — do not hardcode anywhere else.

```json
[
  { "rowRef": "Row 35", "description": "8\" Lap Siding",           "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lpsidtxt0816",     "Hardie": "jhsidtxt081412",  "Vinyl": "vinclay1sidmsd4"   } },
  { "rowRef": "Row 36", "description": "12\" Soffit Vent",         "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lpsoftxt1216",     "Hardie": "jhsoftxt16144",   "Vinyl": "rollexwht316cv"    } },
  { "rowRef": "Row 37", "description": "16\" Soffit Vent",         "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lpsoftxt1616",     "Hardie": "jhsoftxt16144",   "Vinyl": "rollexwht316cv"    } },
  { "rowRef": "Row 38", "description": "24\" Soffit Vent",         "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lpsoftxt2416",     "Hardie": "jhsoftxt2496",    "Vinyl": "rollexwht316cv"    } },
  { "rowRef": "Row 39", "description": "12\" Rake Board",          "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lpsidtxt1216",     "Hardie": "jhsidtxt1212",    "Vinyl": "rollexwht316"      } },
  { "rowRef": "Row 40", "description": "Vinyl J-Channel",          "uom": "Each", "activeFor": ["Vinyl"],              "itemCodes": { "Vinyl": "vinclayjchan34"                                                              } },
  { "rowRef": "Row 41", "description": "Metal Starter Strip",      "uom": "Each", "activeFor": ["Vinyl"],              "itemCodes": { "Vinyl": "vinstarterm212"                                                              } },
  { "rowRef": "Row 42", "description": "Single Under-Sill Trim",   "uom": "Each", "activeFor": ["Vinyl"],              "itemCodes": { "Vinyl": "vinclayuss"                                                                  } },
  { "rowRef": "Row 43", "description": "Rollex Starter",           "uom": "Each", "activeFor": ["Vinyl"],              "itemCodes": { "Vinyl": "rollexwhtrs"                                                                 } },
  { "rowRef": "Row 44", "description": "MD Divider",               "uom": "Each", "activeFor": ["Vinyl"],              "itemCodes": { "Vinyl": "rollexwhtmd12"                                                               } },
  { "rowRef": "Row 45", "description": "Steel Nails (Vinyl)",      "uom": "Each", "activeFor": ["Vinyl"],              "itemCodes": { "Vinyl": "rollexwhtnal114"                                                             } },
  { "rowRef": "Row 46", "description": "Vinyl Lineal (Window Wrap)","uom": "Each", "activeFor": ["Vinyl"],             "itemCodes": { "Vinyl": "ct5natclaylin20"                                                             } },
  { "rowRef": "Row 47", "description": "1x6 Fascia / Trim",        "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lptrimtxt010616",  "Hardie": "jhtrimtx4405",    "Vinyl": "rollexbrzcl2450"   } },
  { "rowRef": "Row 48", "description": "1x8 Soffit / Rake Trim",   "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lptrimtxt010816",  "Hardie": "jhtrimtx44075",   "Vinyl": "rollexwhtsl6"      } },
  { "rowRef": "Row 49", "description": "5/4x6 Corner / Door Trim", "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "lptrimtxt540616",  "Hardie": "jhtrimtx5405",    "Vinyl": "vinclayoc"         } },
  { "rowRef": "Row 50", "description": "Tin Step Flashing",        "uom": "Each", "activeFor": ["LP","Hardie"],        "itemCodes": { "LP": "flashtsb611",       "Hardie": "flashtsb611"                                    } },
  { "rowRef": "Row 51", "description": "Z-Flashing",               "uom": "Each", "activeFor": ["LP","Hardie"],        "itemCodes": { "LP": "flashzgalvz110",    "Hardie": "flashzgalvz110"                                 } },
  { "rowRef": "Row 52", "description": "Caulk",                    "uom": "Each", "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "caulkquad461",     "Hardie": "caulkquad461",    "Vinyl": "caulkquad461"      } },
  { "rowRef": "Row 53", "description": "10d Galvanized Nails",     "uom": "lb",   "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "nailgalvbox10d",   "Hardie": "nailgalvbox10d",  "Vinyl": "nailgalvbox10d"    } },
  { "rowRef": "Row 54", "description": "16d Galvanized Nails",     "uom": "lb",   "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "nailgalvbox16d",   "Hardie": "nailgalvbox16d",  "Vinyl": "nailgalvbox16d"    } },
  { "rowRef": "Row 55", "description": "Roofing Nails",            "uom": "lb",   "activeFor": ["LP","Hardie","Vinyl"], "itemCodes": { "LP": "nailroofeg2",      "Hardie": "nailroofeg2",     "Vinyl": "nailroofeg2"       } }
]
```

### Calculator Output

Show a results table with columns: **Item Code | Description | Qty | UOM**

Rows with qty = 0 are hidden. Rows where the item's `activeFor` does not include the selected siding type are hidden.

Provide a **"Export to CSV"** button that downloads a file with these columns exactly:
```
ItemCode, Description, Quantity, UOM, JobNumber, Branch
```

---

## Tab 2: Converter

### Purpose

An estimator has a takeoff from one siding brand and needs to produce an equivalent list in a different brand. They paste or upload a CSV (or PDF) and get a converted material list back.

### Input

- **Paste CSV text** into a textarea, OR
- **Upload CSV or PDF file**
- Detect siding brand from the item codes in the pasted content (LP codes start with `lp`, Hardie codes start with `jh`, Vinyl codes start with `vin` or `rollex`)
- Allow user to override the detected source brand and set target brand via dropdowns

### Conversion Logic

Use the same item code table from the Calculator tab as the mapping reference. Each item code maps to a row + siding type. To convert:

1. Parse input — extract item codes and quantities (be tolerant: lowercase, strip whitespace, handle varied column orders)
2. Match each parsed item code to a row in the item code table
3. Look up the equivalent item code for the target siding type from the same row
4. If a row doesn't exist for the target type (e.g. Tin Step Flashing → Vinyl), flag as unmatched
5. If an item code can't be matched at all, flag as unmatched

### Converter Output

Show a side-by-side results table: **Source Item Code | Source Description | Qty | → | Target Item Code | Target Description | Qty | UOM**

Show unmatched items in an amber warning panel below.

**"Export to CSV"** downloads the target brand list in the same ERP format:
```
ItemCode, Description, Quantity, UOM, JobNumber, Branch
```

Job Number and Branch are optional inputs at the top of the Converter tab.

---

## Shared Requirements

### Calculation Accuracy
- All `ROUNDUP()` calls round up to the nearest whole number (Math.ceil in JS)
- The `lapSidingBoards` intermediate value from Row 35 must be stored and reused in Row 50 — do not recalculate it separately
- Soffit vent rows 36/37/38 are mutually exclusive — only the one matching `roofOverhangInches` is shown
- Row 46 (Vinyl Lineal) only appears when `sidingType === 'Vinyl'` AND `wrapWindows === true`

### All formulas and item codes must live in a single `/lib/sidingData.ts` file
This is the single source of truth. Never hardcode SKUs or formula constants anywhere else. When products change, only this file needs to be updated.

### CSV Export
- Use native JS to build CSV strings — no heavy libraries needed
- Filename format: `beisser-siding-[jobNumber || 'estimate']-[YYYY-MM-DD].csv`
- Always include a header row

### Error Handling
- Validate all numeric inputs before calculating (no NaN or Infinity in output)
- If any intermediate value is invalid, show a clear inline error near the relevant input
- Converter: if no items could be matched, show a prominent error state instead of an empty table

---

## Folder Structure

```
/app
  /page.tsx                    ← tab shell (Calculator | Converter)
  /api/parse-pdf/route.ts      ← server action for PDF text extraction
/lib
  /sidingData.ts               ← ALL formulas, item codes, coverage table (single source of truth)
  /calculator.ts               ← calculation engine (imports from sidingData)
  /converter.ts                ← conversion logic (imports from sidingData)
  /csvExport.ts                ← ERP CSV formatter
  /csvParser.ts                ← input CSV parser for Converter tab
/components
  /TabShell.tsx
  /CalculatorForm.tsx
  /CalculatorResults.tsx
  /ConverterInput.tsx
  /ConverterResults.tsx
  /UnmatchedPanel.tsx
  /ExportButton.tsx
```

---

## Deliverable

A working Next.js app I can run with `npm run dev` and deploy to Vercel. Include a `README.md` that explains:
- How to run locally
- How to update the item code table or formulas (point to `/lib/sidingData.ts`)
- How to add a new siding type in the future
