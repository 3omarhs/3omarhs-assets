// User-supplied box taxonomy. Specialist descriptions are reference context, not certification.
export const boxLibrary = [
  {
    "name": "Corrugated Shipping Boxes",
    "items": [
      {
        "name": "Regular Slotted Container (RSC)",
        "description": "Standard shipping box where outer flaps meet in the center.",
        "template": "shipping"
      },
      {
        "name": "Full Overlap Container (FOL)",
        "description": "Flaps fully overlap for extra stacking strength.",
        "template": "full-overlap"
      },
      {
        "name": "Half Slotted Container (HSC)",
        "description": "A box with only one set of flaps, leaving the top open.",
        "template": "half-slotted"
      },
      {
        "name": "Overlap Slotted Container (OSC)",
        "description": "Flaps overlap by a specific width, usually one inch.",
        "template": "overlap"
      },
      {
        "name": "Center Special Slotted Container (CSSC)",
        "description": "Inner and outer flaps meet at the center for double-thickness protection.",
        "template": "center-special"
      },
      {
        "name": "Center Special Full Overlap Slotted Container (SFF)",
        "description": "Inner flaps meet in the center while outer flaps fully overlap.",
        "template": "special-full"
      },
      {
        "name": "Snap-Bottom Box",
        "description": "Interlocking bottom flaps assembled by hand. Auto-bottom is a distinct pre-glued construction.",
        "template": null
      },
      {
        "name": "Auto-Bottom Box",
        "description": "Pre-glued bottom pops into place instantly when squeezed.",
        "template": null
      },
      {
        "name": "Five-Panel Folder (FPF)",
        "description": "A single long piece of cardboard wrapped around long, narrow items.",
        "template": null
      },
      {
        "name": "One-Piece Folder (OPF)",
        "description": "A flat piece with a solid bottom and four flaps that fold up around flat items.",
        "template": null
      },
      {
        "name": "Two-Piece Telescope Box (FTD)",
        "description": "A separate lid fully covers the base for maximum wall strength.",
        "template": "full-telescope"
      },
      {
        "name": "Partial Telescope Box (PTD)",
        "description": "The lid only covers part of the box base height.",
        "template": "two-piece"
      },
      {
        "name": "Double Cover Container (DC)",
        "description": "A tube-style body with separate top and bottom caps.",
        "template": "double-cover"
      },
      {
        "name": "Interlocking Double Cover Container (IC)",
        "description": "Separate top and bottom caps that lock mechanically into the body.",
        "template": null
      },
      {
        "name": "C-Series Mailer",
        "description": "Standard self-locking corrugated mailer with dust flaps.",
        "template": null
      },
      {
        "name": "RETT Mailer (Roll End Tuck Top)",
        "description": "Mailer where sides roll over and the top tucks into the front.",
        "template": null
      },
      {
        "name": "RETT with Dust Flaps",
        "description": "Roll-end mailer with extra side wings to keep out dirt.",
        "template": null
      },
      {
        "name": "E-Commerce Variable Depth Box",
        "description": "Pre-scored lines allow the box height to be cut down easily.",
        "template": null
      },
      {
        "name": "Gaylord Box",
        "description": "Massive bulk cargo box used to ship raw materials on pallets.",
        "template": null
      },
      {
        "name": "Octagonal Bulk Bin",
        "description": "Eight-sided heavy corrugated box built to withstand outward pressure.",
        "template": null
      }
    ]
  },
  {
    "name": "Paperboard Folding Cartons (Retail Packaging)",
    "items": [
      {
        "name": "STE Carton (Straight Tuck End)",
        "description": "Top and bottom flaps fold into the box from the same side.",
        "template": "straight"
      },
      {
        "name": "RTE Carton (Reverse Tuck End)",
        "description": "Top and bottom flaps fold into the box from opposite sides.",
        "template": "reverse"
      },
      {
        "name": "TTSB Carton (Tuck Top Snap Bottom)",
        "description": "A tuck-in top closure paired with a hand-locked bottom.",
        "template": null
      },
      {
        "name": "TTAB Carton (Tuck Top Auto Bottom)",
        "description": "A tuck-in top closure paired with a pre-glued self-pop bottom.",
        "template": null
      },
      {
        "name": "1-2-3 Bottom Box",
        "description": "A hand-locked bottom style requiring three folds to secure.",
        "template": null
      },
      {
        "name": "Seal End Carton",
        "description": "Top and bottom flaps must be glued or taped shut mechanically.",
        "template": "seal-end"
      },
      {
        "name": "Gable Box",
        "description": "Box with a triangular top that forms a built-in carrying handle.",
        "template": null
      },
      {
        "name": "Pillow Box",
        "description": "Curved-edge carton that pops open into a pillow shape for small gifts.",
        "template": null
      },
      {
        "name": "Sleeve and Tray Box (Drawer Box)",
        "description": "An outer open sleeve with an inner sliding tray.",
        "template": "drawer"
      },
      {
        "name": "Hexagonal Carton",
        "description": "Six-sided folding box used for unique retail presentation.",
        "template": null
      },
      {
        "name": "Octagonal Carton",
        "description": "Eight-sided folding paperboard box.",
        "template": null
      },
      {
        "name": "Dispenser Box",
        "description": "Features a perforated tear-out section at the bottom for gravity feeding.",
        "template": null
      },
      {
        "name": "Counter Display Box (CDU)",
        "description": "A countertop display family. The editable version here is a single-level tray with a rear header; it does not include tiers or tear-away perforations.",
        "template": "display"
      },
      {
        "name": "Header Card Box",
        "description": "Retail carton with an extended back panel containing a pegboard hanging hole.",
        "template": "header-card"
      },
      {
        "name": "Windowed Carton",
        "description": "Paperboard box with a die-cut opening covered in clear plastic film.",
        "template": "window"
      },
      {
        "name": "Matchbox Style Carton",
        "description": "Sliding drawer box with a friction-fit outer wrap.",
        "template": "drawer"
      },
      {
        "name": "Double Wall Frame Tray",
        "description": "Tray with double-thickness side walls for a premium feel.",
        "template": null
      },
      {
        "name": "Pre-Glued Tray",
        "description": "Flat tray with pre-glued corners that pop up instantly.",
        "template": null
      },
      {
        "name": "Beer Box",
        "description": "Folding carton with an integrated six-pack bottle separator.",
        "template": null
      },
      {
        "name": "Cracker Box",
        "description": "Tall, narrow retail carton. The editable version uses tuck-end closures.",
        "template": "slim"
      }
    ]
  },
  {
    "name": "Rigid & Luxury Boxes (Setup Boxes)",
    "items": [
      {
        "name": "Lid and Base Box",
        "description": "Traditional two-piece box where the lid lifts completely off.",
        "template": null
      },
      {
        "name": "Shoulder Box (Neck Box)",
        "description": "Features an inner lip so the lid sits flush with the base.",
        "template": null
      },
      {
        "name": "Partial Shoulder Box",
        "description": "The inner neck remains visible when the lid is closed.",
        "template": null
      },
      {
        "name": "Hinged Flip-Top Box",
        "description": "The lid is permanently attached to one side of the base.",
        "template": null
      },
      {
        "name": "Book-Style Rigid Box",
        "description": "Opens like a hardcover book, often utilizing magnetic closures.",
        "template": null
      },
      {
        "name": "Clamshell Rigid Box",
        "description": "Double-hinged container that opens flat like a shell.",
        "template": null
      },
      {
        "name": "Magnetic Closure Box",
        "description": "Built-in magnets keep the flip-top lid securely shut.",
        "template": null
      },
      {
        "name": "Slide Rigid Box",
        "description": "Heavy chipboard drawer box with a fabric ribbon pull-tab.",
        "template": null
      },
      {
        "name": "Round Rigid Box (Hat Box)",
        "description": "Cylindrical rigid container used for luxury goods or flowers.",
        "template": null
      },
      {
        "name": "Heart-Shaped Box",
        "description": "Die-cut rigid box frequently used for Valentine's Day chocolates.",
        "template": null
      },
      {
        "name": "Triangular Rigid Box",
        "description": "Three-sided presentation box for premium boutique items.",
        "template": null
      },
      {
        "name": "Collapsible Rigid Box",
        "description": "High-end rigid box that utilizes sticky tape corners to assemble from flat.",
        "template": null
      }
    ]
  },
  {
    "name": "Specialized Moving & Storage Boxes",
    "items": [
      {
        "name": "Book Box",
        "description": "Small, dense box (1.5 cubic feet) built for heavy books or records.",
        "template": null
      },
      {
        "name": "Medium Moving Box",
        "description": "Multi-purpose box (3.0 cubic feet) for pots, pans, and toys.",
        "template": null
      },
      {
        "name": "Large Moving Box",
        "description": "Spacious box (4.5 cubic feet) for linens, clothing, and plasticware.",
        "template": null
      },
      {
        "name": "Extra-Large Moving Box",
        "description": "Maximum capacity box (6.0+ cubic feet) for comforters and pillows.",
        "template": null
      },
      {
        "name": "Wardrobe Box",
        "description": "Tall box equipped with a metal hanging bar for clothes on hangers.",
        "template": null
      },
      {
        "name": "Dish Pack Box",
        "description": "Heavy-duty, double-walled box designed for fragile kitchenware.",
        "template": null
      },
      {
        "name": "Mirror and Picture Box",
        "description": "Expandable, multi-piece box set designed to slide over flat glass frames.",
        "template": null
      },
      {
        "name": "Matte Box",
        "description": "Extra-long, slim boxes meant for rugs, mats, or rolled blueprints.",
        "template": null
      },
      {
        "name": "Bankers Box",
        "description": "Sturdy storage box with integrated handle cutouts and a removable lid.",
        "template": null
      },
      {
        "name": "File Storage Box",
        "description": "Specifically sized to hold letter or legal-sized hanging folders.",
        "template": null
      },
      {
        "name": "Archive Box",
        "description": "Heavy-duty storage box with an attached flip-open lid for record rooms.",
        "template": null
      }
    ]
  },
  {
    "name": "Food & Beverage Boxes",
    "items": [
      {
        "name": "Pizza Box",
        "description": "Flat square corrugated box with a hinged lid and steam vent slots.",
        "template": null
      },
      {
        "name": "Cake Box",
        "description": "Lock-corner paperboard box designed to open wide so cakes don't smudge.",
        "template": null
      },
      {
        "name": "Donut Box",
        "description": "Classic rectangular top-tuck box, often pink or white.",
        "template": null
      },
      {
        "name": "Chinese Takeout Box",
        "description": "Wax-coated folded paper box secured with a wire handle.",
        "template": null
      },
      {
        "name": "Egg Carton",
        "description": "Molded pulp or plastic box with individual protective cells.",
        "template": null
      },
      {
        "name": "Wine Shipper Box",
        "description": "Corrugated outer box fitted with molded pulp inserts for glass bottles.",
        "template": null
      },
      {
        "name": "Cereal Box",
        "description": "Classic thin cardstock box with a heat-sealed inner plastic liner.",
        "template": null
      },
      {
        "name": "Produce Crate Box",
        "description": "Heavily ventilated corrugated box made to withstand moisture and cooling.",
        "template": null
      },
      {
        "name": "Citrus Box",
        "description": "Open-top, hand-holed corrugated tray designed for high-density fruit stacking.",
        "template": null
      },
      {
        "name": "Banana Box",
        "description": "Two-piece heavy-duty telescoping box with a large bottom ventilation hole.",
        "template": null
      },
      {
        "name": "Popcorn Box",
        "description": "Open-top, tapered paperboard container.",
        "template": null
      },
      {
        "name": "Chocolate Assortment Box",
        "description": "Shallow rigid box with vacuum-formed plastic sorting trays.",
        "template": null
      },
      {
        "name": "Tea Box",
        "description": "Small folding carton with a flip-top lid and internal foil barrier.",
        "template": null
      }
    ]
  },
  {
    "name": "Industrial, Hazardous & Shipping Specialties",
    "items": [
      {
        "name": "UN-Certified Hazmat Box",
        "description": "Double or triple-wall boxes tested for shipping dangerous chemicals.",
        "template": null
      },
      {
        "name": "Insulated Shipping Box",
        "description": "Corrugated box lined with styrofoam or silver foil for cold-chain items.",
        "template": null
      },
      {
        "name": "IATA Air Cargo Box",
        "description": "Specifically sized containers optimized for airplane cargo holds.",
        "template": null
      },
      {
        "name": "Pallet Box (Gaylord Container)",
        "description": "Heavy octagonal or rectangular box built to match international pallet sizes.",
        "template": null
      },
      {
        "name": "Li-Ion Battery Box",
        "description": "Fire-retardant lined box certified to ship lithium batteries safely.",
        "template": null
      },
      {
        "name": "Retention Packaging Box",
        "description": "Box with a built-in elastic film sheet that holds items tight to the base.",
        "template": null
      },
      {
        "name": "Suspension Packaging Box",
        "description": "Keeps fragile items suspended in mid-air between two layers of film.",
        "template": null
      },
      {
        "name": "Ballistic Box",
        "description": "Heavily reinforced crate-style boxes used to transport military ammunition.",
        "template": null
      }
    ]
  },
  {
    "name": "Mail, Postal & Gift Styles",
    "items": [
      {
        "name": "Self-Sealing Mailer",
        "description": "Box featuring a peel-and-stick adhesive strip for tape-free packing.",
        "template": null
      },
      {
        "name": "Tear-Strip Mailer",
        "description": "Features an integrated zip-strip or pull-tab for easy, tool-free opening.",
        "template": null
      },
      {
        "name": "Front Lock Mailer",
        "description": "Flaps fold over the front wall and lock into designated slots.",
        "template": null
      },
      {
        "name": "Side Lock Mailer",
        "description": "Flaps lock into the left and right side walls instead of the front.",
        "template": null
      },
      {
        "name": "Bubble-Lined Box",
        "description": "Small mailing box with pre-attached interior bubble wrap lining.",
        "template": null
      },
      {
        "name": "Nesting Boxes",
        "description": "Sets of gift boxes scaled in size to fit perfectly inside one another.",
        "template": null
      },
      {
        "name": "Exploding Gift Box",
        "description": "Novelty box where all four sides drop flat outward when the lid is removed.",
        "template": null
      },
      {
        "name": "Pyramid Box",
        "description": "Four-sided triangular box that ties at the peak with a ribbon.",
        "template": null
      }
    ]
  }
];
