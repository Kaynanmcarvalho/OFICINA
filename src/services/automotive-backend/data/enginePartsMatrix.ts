/**
 * TORQ - Matriz de Peças por Motor
 * 
 * Gerado automaticamente em: 2025-12-21T16:43:40.525Z
 * 
 * Esta matriz permite buscar peças para QUALQUER veículo baseado no motor.
 * Veículos com o mesmo motor compartilham as mesmas peças - assim funciona na indústria.
 */

import { PartCategory, PartOrigin } from '../types';

export interface EnginePart {
  name: string;
  oemCode: string;
  source: string;
  equivalents: { brand: string; code: string }[];
}

export interface EngineData {
  name: string;
  brands: string[];
  inherits: string | null;
  parts: EnginePart[];
}

export const ENGINE_PARTS_MATRIX: Record<string, EngineData> = {
  "EA211": {
    "name": "VW EA211 (1.0-1.6)",
    "brands": [
      "Volkswagen",
      "Audi",
      "Seat",
      "Skoda"
    ],
    "inherits": null,
    "partsCount": 17,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "04E 115 561 H",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/94"
          },
          {
            "brand": "MAHLE",
            "code": "OC 593/4"
          },
          {
            "brand": "FRAM",
            "code": "PH10757"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "04C 129 620 C",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 27 009"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3536"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "6Q0 201 051 J",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 69/2"
          },
          {
            "brand": "MAHLE",
            "code": "KL 756"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "6R0 819 653",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 26 009"
          },
          {
            "brand": "MAHLE",
            "code": "LAK 888"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "04E 905 612",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "PZFR6R"
          },
          {
            "brand": "BOSCH",
            "code": "FR6KPP33X"
          },
          {
            "brand": "DENSO",
            "code": "IXEH20TT"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "04E 905 110 K",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5015"
          },
          {
            "brand": "BOSCH",
            "code": "0 986 221 057"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "04C 109 119 F",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5578XS"
          },
          {
            "brand": "CONTINENTAL",
            "code": "CT1139"
          },
          {
            "brand": "DAYCO",
            "code": "94936"
          }
        ]
      },
      {
        "name": "Kit Tensor Correia",
        "oemCode": "04C 109 479 D",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKMA 01278"
          },
          {
            "brand": "INA",
            "code": "530 0639 10"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "04C 121 600 N",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81278"
          },
          {
            "brand": "DOLZ",
            "code": "A278"
          }
        ]
      },
      {
        "name": "Válvula Termostática",
        "oemCode": "04C 121 113 B",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MTE-THOMSON",
            "code": "289.87"
          },
          {
            "brand": "WAHLER",
            "code": "4170.87D"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "6R0 698 151 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1960"
          },
          {
            "brand": "BOSCH",
            "code": "BP1375"
          },
          {
            "brand": "COBREQ",
            "code": "N-1375"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "6R0 615 301 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6128"
          },
          {
            "brand": "FREMAX",
            "code": "BD-6128"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "6R0 413 031 AK",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G7378"
          },
          {
            "brand": "SACHS",
            "code": "315 378"
          }
        ]
      },
      {
        "name": "Amortecedor Traseiro",
        "oemCode": "6R0 513 025 R",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G7379"
          },
          {
            "brand": "SACHS",
            "code": "315 379"
          }
        ]
      },
      {
        "name": "Kit Embreagem",
        "oemCode": "04C 141 015 T",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "LUK",
            "code": "623 3478 00"
          },
          {
            "brand": "SACHS",
            "code": "3000 951 478"
          }
        ]
      },
      {
        "name": "Sonda Lambda",
        "oemCode": "04C 906 262 AD",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "BOSCH",
            "code": "0 258 017 178"
          },
          {
            "brand": "NGK",
            "code": "OZA670-EE4"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "VW 508 00",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "EDGE 0W20 LL IV"
          },
          {
            "brand": "MOBIL",
            "code": "1 ESP 0W20"
          }
        ]
      }
    ]
  },
  "DKLA": {
    "name": "VW 1.0 TSI (DKLA)",
    "brands": [
      "Volkswagen"
    ],
    "inherits": "EA211",
    "partsCount": 17,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "04E 115 561 H",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/94"
          },
          {
            "brand": "MAHLE",
            "code": "OC 593/4"
          },
          {
            "brand": "FRAM",
            "code": "PH10757"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "04C 129 620 C",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 27 009"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3536"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "6Q0 201 051 J",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 69/2"
          },
          {
            "brand": "MAHLE",
            "code": "KL 756"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "6R0 819 653",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 26 009"
          },
          {
            "brand": "MAHLE",
            "code": "LAK 888"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "04E 905 612",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "PZFR6R"
          },
          {
            "brand": "BOSCH",
            "code": "FR6KPP33X"
          },
          {
            "brand": "DENSO",
            "code": "IXEH20TT"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "04E 905 110 K",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5015"
          },
          {
            "brand": "BOSCH",
            "code": "0 986 221 057"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "04C 109 119 F",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5578XS"
          },
          {
            "brand": "CONTINENTAL",
            "code": "CT1139"
          },
          {
            "brand": "DAYCO",
            "code": "94936"
          }
        ]
      },
      {
        "name": "Kit Tensor Correia",
        "oemCode": "04C 109 479 D",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKMA 01278"
          },
          {
            "brand": "INA",
            "code": "530 0639 10"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "04C 121 600 N",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81278"
          },
          {
            "brand": "DOLZ",
            "code": "A278"
          }
        ]
      },
      {
        "name": "Válvula Termostática",
        "oemCode": "04C 121 113 B",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MTE-THOMSON",
            "code": "289.87"
          },
          {
            "brand": "WAHLER",
            "code": "4170.87D"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "6R0 698 151 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1960"
          },
          {
            "brand": "BOSCH",
            "code": "BP1375"
          },
          {
            "brand": "COBREQ",
            "code": "N-1375"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "6R0 615 301 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6128"
          },
          {
            "brand": "FREMAX",
            "code": "BD-6128"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "6R0 413 031 AK",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G7378"
          },
          {
            "brand": "SACHS",
            "code": "315 378"
          }
        ]
      },
      {
        "name": "Amortecedor Traseiro",
        "oemCode": "6R0 513 025 R",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G7379"
          },
          {
            "brand": "SACHS",
            "code": "315 379"
          }
        ]
      },
      {
        "name": "Kit Embreagem",
        "oemCode": "04C 141 015 T",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "LUK",
            "code": "623 3478 00"
          },
          {
            "brand": "SACHS",
            "code": "3000 951 478"
          }
        ]
      },
      {
        "name": "Sonda Lambda",
        "oemCode": "04C 906 262 AD",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "BOSCH",
            "code": "0 258 017 178"
          },
          {
            "brand": "NGK",
            "code": "OZA670-EE4"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "VW 508 00",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "EDGE 0W20 LL IV"
          },
          {
            "brand": "MOBIL",
            "code": "1 ESP 0W20"
          }
        ]
      }
    ]
  },
  "EA888": {
    "name": "VW EA888 (2.0 TSI)",
    "brands": [
      "Volkswagen",
      "Audi"
    ],
    "inherits": null,
    "partsCount": 9,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "06L 115 562",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "HU 7020 z"
          },
          {
            "brand": "MAHLE",
            "code": "OX 787D"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "5Q0 129 620 D",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 35 010"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3778"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "06K 905 601 B",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "PZFR6R"
          },
          {
            "brand": "BOSCH",
            "code": "FR7KPP33U+"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "06L 905 110",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5015"
          },
          {
            "brand": "BOSCH",
            "code": "0 221 604 115"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "06K 109 119 AA",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5650XS"
          },
          {
            "brand": "CONTINENTAL",
            "code": "CT1178"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "06L 121 111 H",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81310"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "5Q0 698 151 AA",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB2000"
          },
          {
            "brand": "BOSCH",
            "code": "BP1500"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "5Q0 615 301 F",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6200"
          },
          {
            "brand": "FREMAX",
            "code": "BD-6200"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "VW 504 00",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "EDGE 5W30 LL III"
          },
          {
            "brand": "MOBIL",
            "code": "1 ESP 5W30"
          }
        ]
      }
    ]
  },
  "AP": {
    "name": "VW AP (1.6-2.0)",
    "brands": [
      "Volkswagen"
    ],
    "inherits": null,
    "partsCount": 8,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "030 115 561 AN",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 719/30"
          },
          {
            "brand": "MAHLE",
            "code": "OC 264"
          },
          {
            "brand": "FRAM",
            "code": "PH3614"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "036 129 620 J",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 3880"
          },
          {
            "brand": "MAHLE",
            "code": "LX 1006"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "101 905 617 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "BKR6E"
          },
          {
            "brand": "BOSCH",
            "code": "FR7DC+"
          }
        ]
      },
      {
        "name": "Cabo de Vela",
        "oemCode": "032 905 409 E",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "RC-VW1201"
          },
          {
            "brand": "BOSCH",
            "code": "0 986 356 857"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "06A 109 119 C",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5184XS"
          },
          {
            "brand": "CONTINENTAL",
            "code": "CT637"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "026 121 005 H",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81205"
          },
          {
            "brand": "DOLZ",
            "code": "A165"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "357 698 151 E",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1350"
          },
          {
            "brand": "COBREQ",
            "code": "N-350"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "15W40 API SL",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "MOBIL",
            "code": "SUPER 1000 15W40"
          },
          {
            "brand": "CASTROL",
            "code": "GTX 15W40"
          }
        ]
      }
    ]
  },
  "EA111": {
    "name": "VW EA111 (1.0-1.6 8V)",
    "brands": [
      "Volkswagen"
    ],
    "inherits": null,
    "partsCount": 7,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "030 115 561 AB",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/73"
          },
          {
            "brand": "MAHLE",
            "code": "OC 264"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "036 129 620 H",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 3880"
          },
          {
            "brand": "MAHLE",
            "code": "LX 1006"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "101 905 617 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "BKR6E"
          },
          {
            "brand": "BOSCH",
            "code": "FR7DC+"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "030 109 119 AA",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5184XS"
          },
          {
            "brand": "CONTINENTAL",
            "code": "CT637"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "030 121 008 D",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81205"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "6Q0 698 151 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1550"
          },
          {
            "brand": "COBREQ",
            "code": "N-550"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "5W40 API SN",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "MAGNATEC 5W40"
          },
          {
            "brand": "MOBIL",
            "code": "SUPER 3000 5W40"
          }
        ]
      }
    ]
  },
  "Boxer": {
    "name": "VW Boxer (1.3-1.6)",
    "brands": [
      "Volkswagen"
    ],
    "inherits": null,
    "partsCount": 5,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "111 115 561",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 920/7"
          },
          {
            "brand": "MAHLE",
            "code": "OC 21"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "101 905 601",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "B6HS"
          },
          {
            "brand": "BOSCH",
            "code": "W8AC"
          }
        ]
      },
      {
        "name": "Platinado",
        "oemCode": "111 998 057",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "BOSCH",
            "code": "1 237 013 804"
          }
        ]
      },
      {
        "name": "Condensador",
        "oemCode": "111 905 295",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "BOSCH",
            "code": "1 237 330 037"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "20W50 API SF",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "GTX 20W50"
          },
          {
            "brand": "MOBIL",
            "code": "SUPER 20W50"
          }
        ]
      }
    ]
  },
  "Firefly": {
    "name": "Fiat Firefly (1.0-1.3)",
    "brands": [
      "Fiat",
      "Jeep",
      "Peugeot",
      "Citroën"
    ],
    "inherits": null,
    "partsCount": 17,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "55594651",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/95"
          },
          {
            "brand": "MAHLE",
            "code": "OC 1254"
          },
          {
            "brand": "FRAM",
            "code": "PH6811"
          },
          {
            "brand": "TECFIL",
            "code": "PSL 640"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "51937599",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 22 117"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3243"
          },
          {
            "brand": "FRAM",
            "code": "CA11945"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "51806073",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 58/1"
          },
          {
            "brand": "MAHLE",
            "code": "KL 583"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "52042739",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CU 22 011"
          },
          {
            "brand": "MAHLE",
            "code": "LA 1243"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "55249868",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "LKAR8A-9"
          },
          {
            "brand": "BOSCH",
            "code": "FR7KI332S"
          },
          {
            "brand": "DENSO",
            "code": "SKJ20DR-M11S"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "55579072",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5093"
          },
          {
            "brand": "BOSCH",
            "code": "0 221 504 100"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "55282037",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK1070"
          },
          {
            "brand": "CONTINENTAL",
            "code": "6PK1070"
          }
        ]
      },
      {
        "name": "Tensor Correia",
        "oemCode": "55243850",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKM 32043"
          },
          {
            "brand": "INA",
            "code": "534 0565 10"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "55268916",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 82254"
          },
          {
            "brand": "DOLZ",
            "code": "F254"
          }
        ]
      },
      {
        "name": "Válvula Termostática",
        "oemCode": "55250824",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MTE-THOMSON",
            "code": "297.87"
          },
          {
            "brand": "WAHLER",
            "code": "4174.87D"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "77367914",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB2166"
          },
          {
            "brand": "BOSCH",
            "code": "BP1648"
          },
          {
            "brand": "COBREQ",
            "code": "N-1648"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "51961809",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6509"
          },
          {
            "brand": "FREMAX",
            "code": "BD-6509"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "52078091",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8091"
          },
          {
            "brand": "COFAP",
            "code": "MP32091"
          }
        ]
      },
      {
        "name": "Amortecedor Traseiro",
        "oemCode": "52078092",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8092"
          },
          {
            "brand": "COFAP",
            "code": "MP32092"
          }
        ]
      },
      {
        "name": "Kit Embreagem",
        "oemCode": "55267006",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "LUK",
            "code": "623 3554 00"
          },
          {
            "brand": "SACHS",
            "code": "3000 954 554"
          },
          {
            "brand": "VALEO",
            "code": "826854"
          }
        ]
      },
      {
        "name": "Sonda Lambda",
        "oemCode": "55268629",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "BOSCH",
            "code": "0 258 010 437"
          },
          {
            "brand": "NGK",
            "code": "OZA659-EE92"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "SELENIA K 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "PETRONAS",
            "code": "SELENIA K 5W30"
          },
          {
            "brand": "MOBIL",
            "code": "SUPER 3000 5W30"
          }
        ]
      }
    ]
  },
  "Fire": {
    "name": "Fiat Fire (1.0-1.4 8V)",
    "brands": [
      "Fiat"
    ],
    "inherits": null,
    "partsCount": 7,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "46544820",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/22"
          },
          {
            "brand": "MAHLE",
            "code": "OC 232"
          },
          {
            "brand": "FRAM",
            "code": "PH5949"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "51775324",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 2201"
          },
          {
            "brand": "MAHLE",
            "code": "LX 1780"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "55188857",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "BKR6E-11"
          },
          {
            "brand": "BOSCH",
            "code": "FR7DC+"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "46524997",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5499XS"
          },
          {
            "brand": "DAYCO",
            "code": "94766"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "46515970",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 82250"
          },
          {
            "brand": "DOLZ",
            "code": "F150"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "77362236",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1550"
          },
          {
            "brand": "COBREQ",
            "code": "N-550"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "SELENIA K 15W40",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "PETRONAS",
            "code": "SELENIA K 15W40"
          },
          {
            "brand": "MOBIL",
            "code": "SUPER 1000 15W40"
          }
        ]
      }
    ]
  },
  "E.torQ": {
    "name": "Fiat E.torQ (1.6-1.8 16V)",
    "brands": [
      "Fiat"
    ],
    "inherits": null,
    "partsCount": 7,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "55223416",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/73"
          },
          {
            "brand": "MAHLE",
            "code": "OC 570"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "51885139",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 2201"
          },
          {
            "brand": "MAHLE",
            "code": "LX 2994"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "55227544",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "ILKAR7B11"
          },
          {
            "brand": "BOSCH",
            "code": "FR7KPP33U"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "55212965",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5578XS"
          },
          {
            "brand": "DAYCO",
            "code": "94936"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "55221397",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 82254"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "77362236",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1960"
          },
          {
            "brand": "BOSCH",
            "code": "BP1375"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "SELENIA K 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "PETRONAS",
            "code": "SELENIA K 5W30"
          }
        ]
      }
    ]
  },
  "VHCE": {
    "name": "GM VHCE (1.0-1.4 8V)",
    "brands": [
      "Chevrolet"
    ],
    "inherits": null,
    "partsCount": 9,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "93186856",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/73"
          },
          {
            "brand": "ACDelco",
            "code": "PF48"
          },
          {
            "brand": "FRAM",
            "code": "PH3614"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "93260085",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 2201"
          },
          {
            "brand": "ACDelco",
            "code": "A3181C"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "93303623",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 58/1"
          },
          {
            "brand": "ACDelco",
            "code": "GF831"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "55570064",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "BKR6E-11"
          },
          {
            "brand": "ACDelco",
            "code": "41-103"
          },
          {
            "brand": "BOSCH",
            "code": "FR7DC+"
          }
        ]
      },
      {
        "name": "Cabo de Vela",
        "oemCode": "93328536",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "RC-GM1201"
          },
          {
            "brand": "ACDelco",
            "code": "746S"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "93302094",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5499XS"
          },
          {
            "brand": "DAYCO",
            "code": "94766"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "24405895",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 85101"
          },
          {
            "brand": "DOLZ",
            "code": "O137"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "93277067",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1550"
          },
          {
            "brand": "ACDelco",
            "code": "171-1067"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "DEXOS1 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "ACDelco",
            "code": "DEXOS1 5W30"
          },
          {
            "brand": "MOBIL",
            "code": "1 ESP 5W30"
          }
        ]
      }
    ]
  },
  "SGE": {
    "name": "GM SGE Turbo (1.0-1.2)",
    "brands": [
      "Chevrolet"
    ],
    "inherits": null,
    "partsCount": 14,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "55594651",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/95"
          },
          {
            "brand": "ACDelco",
            "code": "PF64"
          },
          {
            "brand": "MAHLE",
            "code": "OC 1254"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "42607544",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 25 008"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3778"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "42607545",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 58/3"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "52042739",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CU 22 011"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "55591434",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "SILZKR7B11"
          },
          {
            "brand": "ACDelco",
            "code": "41-110"
          },
          {
            "brand": "BOSCH",
            "code": "FR7KPP33U+"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "55579072",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5093"
          },
          {
            "brand": "BOSCH",
            "code": "0 221 504 100"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "55282037",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK1070"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "55268916",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 82254"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "52098612",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB2166"
          },
          {
            "brand": "ACDelco",
            "code": "171-1167"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "52098613",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6509"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "52155066",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8091"
          }
        ]
      },
      {
        "name": "Amortecedor Traseiro",
        "oemCode": "52155067",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8092"
          }
        ]
      },
      {
        "name": "Kit Embreagem",
        "oemCode": "55267006",
        "source": "GM ACDelco",
        "equivalents": [
          {
            "brand": "LUK",
            "code": "623 3554 00"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "DEXOS1 GEN2 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "ACDelco",
            "code": "DEXOS1 5W30"
          },
          {
            "brand": "MOBIL",
            "code": "1 ESP 5W30"
          }
        ]
      }
    ]
  },
  "Kappa": {
    "name": "Hyundai Kappa (1.0 TGDI)",
    "brands": [
      "Hyundai",
      "Kia"
    ],
    "inherits": null,
    "partsCount": 15,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "26300-2B000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 811/80"
          },
          {
            "brand": "MAHLE",
            "code": "OC 500"
          },
          {
            "brand": "FRAM",
            "code": "PH6811"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "28113-S1100",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 26 017"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3778"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "31112-S1000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 6039"
          },
          {
            "brand": "MAHLE",
            "code": "KL 566"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "97133-S1000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 26 017"
          },
          {
            "brand": "MAHLE",
            "code": "LAK 875"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "18858-10080",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "SILZKR7B11"
          },
          {
            "brand": "BOSCH",
            "code": "FR7KPP33U+"
          },
          {
            "brand": "DENSO",
            "code": "IXEH22TT"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "27301-2B100",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5055"
          },
          {
            "brand": "BOSCH",
            "code": "0 221 504 035"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "25212-2B010",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK1780"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "25100-2B700",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 95895"
          },
          {
            "brand": "DOLZ",
            "code": "H235"
          }
        ]
      },
      {
        "name": "Válvula Termostática",
        "oemCode": "25500-2B000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MTE-THOMSON",
            "code": "282.82"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "58101-S1A00",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB3548"
          },
          {
            "brand": "BOSCH",
            "code": "BP1397"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "51712-S1000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6548"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "54651-S1000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8548"
          }
        ]
      },
      {
        "name": "Amortecedor Traseiro",
        "oemCode": "55311-S1000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8549"
          }
        ]
      },
      {
        "name": "Kit Embreagem",
        "oemCode": "41100-2B000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "LUK",
            "code": "623 3548 00"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "ACEA C5 0W20",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "SHELL",
            "code": "HELIX ULTRA 0W20"
          },
          {
            "brand": "MOBIL",
            "code": "1 ESP 0W20"
          }
        ]
      }
    ]
  },
  "Gamma": {
    "name": "Hyundai Gamma (1.6 16V)",
    "brands": [
      "Hyundai",
      "Kia"
    ],
    "inherits": null,
    "partsCount": 7,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "26300-35503",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 811/80"
          },
          {
            "brand": "MAHLE",
            "code": "OC 500"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "28113-2S000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 26 013"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "18855-10060",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "LKAR7B-11"
          },
          {
            "brand": "DENSO",
            "code": "IXEH20TT"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "24312-2B000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5578XS"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "25100-2B000",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 95890"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "58101-2SA00",
        "source": "Hyundai Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB3500"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "5W30 API SN",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "SHELL",
            "code": "HELIX HX8 5W30"
          }
        ]
      }
    ]
  },
  "2ZR-FXE": {
    "name": "Toyota 2ZR-FXE (2.0 Híbrido)",
    "brands": [
      "Toyota"
    ],
    "inherits": null,
    "partsCount": 12,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "90915-YZZD4",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 68/3"
          },
          {
            "brand": "MAHLE",
            "code": "OC 495"
          },
          {
            "brand": "DENSO",
            "code": "DXE1007"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "17801-21060",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 26 003"
          },
          {
            "brand": "MAHLE",
            "code": "LX 2994"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "77024-02100",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 614/46"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "87139-02020",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 2131"
          },
          {
            "brand": "DENSO",
            "code": "DCF467K"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "90919-01275",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "ILKAR7B11"
          },
          {
            "brand": "DENSO",
            "code": "SK20R11"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "90919-02276",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5065"
          },
          {
            "brand": "DENSO",
            "code": "099700-2760"
          }
        ]
      },
      {
        "name": "Corrente de Comando",
        "oemCode": "13506-37030",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "INA",
            "code": "559 0176 10"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "16100-29415",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 91845"
          },
          {
            "brand": "AISIN",
            "code": "WPT-190"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "04465-02390",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB3456"
          },
          {
            "brand": "AKEBONO",
            "code": "EUR1456"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "43512-02330",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6456"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "48510-02850",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G7456"
          },
          {
            "brand": "KYB",
            "code": "339456"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "TOYOTA 0W16",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "TOYOTA",
            "code": "GENUINE 0W16"
          }
        ]
      }
    ]
  },
  "1GD-FTV": {
    "name": "Toyota 1GD-FTV (2.8 Diesel)",
    "brands": [
      "Toyota"
    ],
    "inherits": null,
    "partsCount": 8,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "90915-YZZJ4",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 940/44"
          },
          {
            "brand": "MAHLE",
            "code": "OC 91"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "17801-0L040",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 31 014"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "23390-0L070",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 940/33 x"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "87139-0K010",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 2131"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "90916-02671",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK2120"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "16100-39545",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 91845"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "04465-0K290",
        "source": "Toyota EPC",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB3456"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "TOYOTA 5W30 DPF",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "TOYOTA",
            "code": "GENUINE 5W30 DPF"
          }
        ]
      }
    ]
  },
  "L15B": {
    "name": "Honda L15B (1.5 Turbo)",
    "brands": [
      "Honda"
    ],
    "inherits": null,
    "partsCount": 10,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "15400-RTA-003",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 610/6"
          },
          {
            "brand": "MAHLE",
            "code": "OC 617"
          },
          {
            "brand": "FRAM",
            "code": "PH7317"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "17220-5R0-008",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 2201"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3536"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "16010-5R0-008",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 69/2"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "80292-TBA-A11",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 21 003"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "12290-5R0-003",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "DILKAR7G11GS"
          },
          {
            "brand": "DENSO",
            "code": "IXEH22TT"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "30520-5R0-003",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5099"
          },
          {
            "brand": "DENSO",
            "code": "099700-2170"
          }
        ]
      },
      {
        "name": "Corrente de Comando",
        "oemCode": "14401-5R0-003",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "INA",
            "code": "559 0178 10"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "19200-5R0-003",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 93617"
          },
          {
            "brand": "AISIN",
            "code": "WPH-048"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "45022-T9A-T01",
        "source": "Honda Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB3617"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "HONDA 0W20",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "HONDA",
            "code": "GENUINE 0W20"
          }
        ]
      }
    ]
  },
  "SCe": {
    "name": "Renault SCe (1.0-1.6)",
    "brands": [
      "Renault"
    ],
    "inherits": null,
    "partsCount": 10,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "152089599R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 75/3"
          },
          {
            "brand": "MAHLE",
            "code": "OC 467"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "165467674R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 1858/2"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "172024388R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 6039"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "272773016R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CU 1829"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "224012331R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "LZKAR7A"
          },
          {
            "brand": "BOSCH",
            "code": "FR7DC+"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "224333529R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5055"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "117206746R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "4PK780"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "210108030R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 86619"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "410608481R",
        "source": "Renault Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1960"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "RN 0700 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "ELF",
            "code": "EVOLUTION 900 SXR 5W30"
          }
        ]
      }
    ]
  },
  "HR16DE": {
    "name": "Nissan HR16DE (1.6 16V)",
    "brands": [
      "Nissan"
    ],
    "inherits": null,
    "partsCount": 10,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "15208-65F0E",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 67/1"
          },
          {
            "brand": "MAHLE",
            "code": "OC 617"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "16546-3TA0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 2201"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "16400-3TA0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 69/2"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "27277-4BU0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CUK 21 003"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "22401-5RB1C",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "DILKAR7B11"
          },
          {
            "brand": "DENSO",
            "code": "IXEH22TT"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "22448-3TA0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5099"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "11720-3TA0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK1180"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "21010-3TA0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 93617"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "D1060-3TA0A",
        "source": "Nissan Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB3617"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "NISSAN 5W30 SN",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "MOBIL",
            "code": "SUPER 3000 5W30"
          }
        ]
      }
    ]
  },
  "Sigma": {
    "name": "Ford Sigma (1.6 16V)",
    "brands": [
      "Ford"
    ],
    "inherits": null,
    "partsCount": 7,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "1S7E-6714-BA",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/73"
          },
          {
            "brand": "MOTORCRAFT",
            "code": "FL-910S"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "7S71-9601-AA",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 2201"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "CYFS-12F-P",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "ITR6F13"
          },
          {
            "brand": "MOTORCRAFT",
            "code": "SP-411"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "1S7Z-6268-AA",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5578XS"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "1S7Z-8501-AA",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 84416"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "CV6Z-2001-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1960"
          },
          {
            "brand": "MOTORCRAFT",
            "code": "BR-1551"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "FORD 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "MOTORCRAFT",
            "code": "MERCON LV 5W30"
          }
        ]
      }
    ]
  },
  "EcoBoost": {
    "name": "Ford EcoBoost (1.0-1.5 Turbo)",
    "brands": [
      "Ford"
    ],
    "inherits": null,
    "partsCount": 8,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "CM5Z-6731-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/94"
          },
          {
            "brand": "MOTORCRAFT",
            "code": "FL-910S"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "CV6Z-9601-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 27 009"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "CYFS-12Y-2",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "PZFR6R"
          },
          {
            "brand": "MOTORCRAFT",
            "code": "SP-534"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "CM5Z-12029-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5015"
          }
        ]
      },
      {
        "name": "Correia Dentada",
        "oemCode": "CM5Z-6268-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "5578XS"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "CM5Z-8501-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81278"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "CV6Z-2001-A",
        "source": "Ford Parts",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB1960"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "FORD 5W20",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "MOTORCRAFT",
            "code": "MERCON LV 5W20"
          }
        ]
      }
    ]
  },
  "GSE-T4": {
    "name": "Jeep GSE-T4 (1.3 Turbo)",
    "brands": [
      "Jeep"
    ],
    "inherits": "Firefly",
    "partsCount": 17,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "55594651",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 712/95"
          },
          {
            "brand": "MAHLE",
            "code": "OC 1254"
          },
          {
            "brand": "FRAM",
            "code": "PH6811"
          },
          {
            "brand": "TECFIL",
            "code": "PSL 640"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "51937599",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 22 117"
          },
          {
            "brand": "MAHLE",
            "code": "LX 3243"
          },
          {
            "brand": "FRAM",
            "code": "CA11945"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "51806073",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 58/1"
          },
          {
            "brand": "MAHLE",
            "code": "KL 583"
          }
        ]
      },
      {
        "name": "Filtro de Cabine",
        "oemCode": "52042739",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "CU 22 011"
          },
          {
            "brand": "MAHLE",
            "code": "LA 1243"
          }
        ]
      },
      {
        "name": "Vela de Ignição",
        "oemCode": "55249868",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "LKAR8A-9"
          },
          {
            "brand": "BOSCH",
            "code": "FR7KI332S"
          },
          {
            "brand": "DENSO",
            "code": "SKJ20DR-M11S"
          }
        ]
      },
      {
        "name": "Bobina de Ignição",
        "oemCode": "55579072",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "NGK",
            "code": "U5093"
          },
          {
            "brand": "BOSCH",
            "code": "0 221 504 100"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "55282037",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK1070"
          },
          {
            "brand": "CONTINENTAL",
            "code": "6PK1070"
          }
        ]
      },
      {
        "name": "Tensor Correia",
        "oemCode": "55243850",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKM 32043"
          },
          {
            "brand": "INA",
            "code": "534 0565 10"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "55268916",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 82254"
          },
          {
            "brand": "DOLZ",
            "code": "F254"
          }
        ]
      },
      {
        "name": "Válvula Termostática",
        "oemCode": "55250824",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MTE-THOMSON",
            "code": "297.87"
          },
          {
            "brand": "WAHLER",
            "code": "4174.87D"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "77367914",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB2166"
          },
          {
            "brand": "BOSCH",
            "code": "BP1648"
          },
          {
            "brand": "COBREQ",
            "code": "N-1648"
          }
        ]
      },
      {
        "name": "Disco Freio Dianteiro",
        "oemCode": "51961809",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "DF6509"
          },
          {
            "brand": "FREMAX",
            "code": "BD-6509"
          }
        ]
      },
      {
        "name": "Amortecedor Dianteiro",
        "oemCode": "52078091",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8091"
          },
          {
            "brand": "COFAP",
            "code": "MP32091"
          }
        ]
      },
      {
        "name": "Amortecedor Traseiro",
        "oemCode": "52078092",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "MONROE",
            "code": "G8092"
          },
          {
            "brand": "COFAP",
            "code": "MP32092"
          }
        ]
      },
      {
        "name": "Kit Embreagem",
        "oemCode": "55267006",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "LUK",
            "code": "623 3554 00"
          },
          {
            "brand": "SACHS",
            "code": "3000 954 554"
          },
          {
            "brand": "VALEO",
            "code": "826854"
          }
        ]
      },
      {
        "name": "Sonda Lambda",
        "oemCode": "55268629",
        "source": "FIAT ePER",
        "equivalents": [
          {
            "brand": "BOSCH",
            "code": "0 258 010 437"
          },
          {
            "brand": "NGK",
            "code": "OZA659-EE92"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "SELENIA K 5W30",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "PETRONAS",
            "code": "SELENIA K 5W30"
          },
          {
            "brand": "MOBIL",
            "code": "SUPER 3000 5W30"
          }
        ]
      }
    ]
  },
  "CDCA": {
    "name": "VW 2.0 TDI (CDCA)",
    "brands": [
      "Volkswagen"
    ],
    "inherits": null,
    "partsCount": 7,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "03L 115 562",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "HU 719/7 x"
          },
          {
            "brand": "MAHLE",
            "code": "OX 188D"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "2H0 129 620 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 35 154"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "2H0 127 401 A",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 842/21 x"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "03L 903 137 G",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "6PK1880"
          }
        ]
      },
      {
        "name": "Bomba d'Água",
        "oemCode": "03L 121 011 PX",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "SKF",
            "code": "VKPC 81310"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "2H0 698 151",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB2000"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "VW 507 00",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "EDGE 5W30 LL III"
          }
        ]
      }
    ]
  },
  "DDXC": {
    "name": "VW 3.0 V6 TDI (DDXC)",
    "brands": [
      "Volkswagen"
    ],
    "inherits": null,
    "partsCount": 6,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "059 115 561 B",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "HU 8001 x"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "2H6 129 620",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 35 154"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "2H6 127 401",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 842/21 x"
          }
        ]
      },
      {
        "name": "Correia Poly-V",
        "oemCode": "059 903 137 AK",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "GATES",
            "code": "7PK2120"
          }
        ]
      },
      {
        "name": "Pastilha Freio Dianteira",
        "oemCode": "2H6 698 151",
        "source": "VW ETKA",
        "equivalents": [
          {
            "brand": "TRW",
            "code": "GDB2100"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "VW 507 00",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "CASTROL",
            "code": "EDGE 5W30 LL III"
          }
        ]
      }
    ]
  },
  "MWM": {
    "name": "MWM Diesel (Caminhões)",
    "brands": [
      "Volkswagen",
      "Ford"
    ],
    "inherits": null,
    "partsCount": 4,
    "parts": [
      {
        "name": "Filtro de Óleo",
        "oemCode": "2R0 115 403",
        "source": "MWM",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "W 1170/7"
          }
        ]
      },
      {
        "name": "Filtro de Ar",
        "oemCode": "2R0 129 620",
        "source": "MWM",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "C 30 850/2"
          }
        ]
      },
      {
        "name": "Filtro de Combustível",
        "oemCode": "2R0 127 177",
        "source": "MWM",
        "equivalents": [
          {
            "brand": "MANN",
            "code": "WK 940/20"
          }
        ]
      },
      {
        "name": "Óleo Motor",
        "oemCode": "15W40 CI-4",
        "source": "Manual",
        "equivalents": [
          {
            "brand": "MOBIL",
            "code": "DELVAC MX 15W40"
          }
        ]
      }
    ]
  }
};

export const VEHICLE_ENGINE_MAP: Record<string, string> = {
  "volkswagen_fusca": "Boxer",
  "volkswagen_brasilia": "Boxer",
  "volkswagen_kombi": "Boxer",
  "volkswagen_gol": "EA111",
  "volkswagen_voyage": "EA211",
  "volkswagen_saveiro": "EA211",
  "volkswagen_fox": "EA111",
  "volkswagen_crossfox": "EA211",
  "volkswagen_spacefox": "EA211",
  "volkswagen_golf": "EA211",
  "volkswagen_polo": "EA211",
  "volkswagen_virtus": "EA211",
  "volkswagen_jetta": "EA211",
  "volkswagen_passat": "EA888",
  "volkswagen_santana": "AP",
  "volkswagen_parati": "AP",
  "volkswagen_t-cross": "EA211",
  "volkswagen_tcross": "EA211",
  "volkswagen_nivus": "EA211",
  "volkswagen_taos": "EA211",
  "volkswagen_tiguan": "EA888",
  "volkswagen_amarok": "CDCA",
  "volkswagen_up": "EA211",
  "volkswagen_delivery": "MWM",
  "volkswagen_constellation": "MWM",
  "volkswagen_volksbus": "MWM",
  "fiat_uno": "Fire",
  "fiat_palio": "Fire",
  "fiat_siena": "Fire",
  "fiat_strada": "Firefly",
  "fiat_argo": "Firefly",
  "fiat_cronos": "Firefly",
  "fiat_mobi": "Firefly",
  "fiat_pulse": "Firefly",
  "fiat_fastback": "Firefly",
  "fiat_toro": "E.torQ",
  "fiat_fiorino": "Fire",
  "fiat_doblo": "E.torQ",
  "fiat_ducato": "E.torQ",
  "fiat_grand_siena": "E.torQ",
  "fiat_linea": "E.torQ",
  "fiat_bravo": "E.torQ",
  "fiat_punto": "E.torQ",
  "fiat_500": "Fire",
  "chevrolet_celta": "VHCE",
  "chevrolet_prisma": "VHCE",
  "chevrolet_corsa": "VHCE",
  "chevrolet_classic": "VHCE",
  "chevrolet_onix": "SGE",
  "chevrolet_tracker": "SGE",
  "chevrolet_spin": "VHCE",
  "chevrolet_cobalt": "VHCE",
  "chevrolet_cruze": "SGE",
  "chevrolet_equinox": "SGE",
  "chevrolet_s10": "VHCE",
  "chevrolet_trailblazer": "VHCE",
  "chevrolet_montana": "SGE",
  "chevrolet_agile": "VHCE",
  "chevrolet_astra": "VHCE",
  "chevrolet_vectra": "VHCE",
  "chevrolet_meriva": "VHCE",
  "chevrolet_zafira": "VHCE",
  "hyundai_hb20": "Kappa",
  "hyundai_hb20s": "Kappa",
  "hyundai_creta": "Kappa",
  "hyundai_tucson": "Gamma",
  "hyundai_ix35": "Gamma",
  "hyundai_santa_fe": "Gamma",
  "hyundai_azera": "Gamma",
  "hyundai_elantra": "Gamma",
  "hyundai_veloster": "Gamma",
  "hyundai_i30": "Gamma",
  "kia_picanto": "Kappa",
  "kia_rio": "Gamma",
  "kia_cerato": "Gamma",
  "kia_sportage": "Gamma",
  "kia_sorento": "Gamma",
  "kia_soul": "Gamma",
  "kia_stinger": "Gamma",
  "toyota_corolla": "2ZR-FXE",
  "toyota_yaris": "2ZR-FXE",
  "toyota_etios": "2ZR-FXE",
  "toyota_hilux": "1GD-FTV",
  "toyota_sw4": "1GD-FTV",
  "toyota_rav4": "2ZR-FXE",
  "toyota_camry": "2ZR-FXE",
  "toyota_prius": "2ZR-FXE",
  "honda_civic": "L15B",
  "honda_city": "L15B",
  "honda_fit": "L15B",
  "honda_hr-v": "L15B",
  "honda_hrv": "L15B",
  "honda_wr-v": "L15B",
  "honda_wrv": "L15B",
  "honda_cr-v": "L15B",
  "honda_crv": "L15B",
  "honda_accord": "L15B",
  "renault_kwid": "SCe",
  "renault_sandero": "SCe",
  "renault_logan": "SCe",
  "renault_duster": "SCe",
  "renault_captur": "SCe",
  "renault_oroch": "SCe",
  "renault_stepway": "SCe",
  "renault_fluence": "SCe",
  "renault_megane": "SCe",
  "renault_clio": "SCe",
  "nissan_kicks": "HR16DE",
  "nissan_versa": "HR16DE",
  "nissan_sentra": "HR16DE",
  "nissan_march": "HR16DE",
  "nissan_frontier": "HR16DE",
  "nissan_livina": "HR16DE",
  "nissan_tiida": "HR16DE",
  "ford_ka": "Sigma",
  "ford_fiesta": "Sigma",
  "ford_focus": "Sigma",
  "ford_ecosport": "EcoBoost",
  "ford_ranger": "EcoBoost",
  "ford_territory": "EcoBoost",
  "ford_fusion": "EcoBoost",
  "ford_edge": "EcoBoost",
  "jeep_renegade": "Firefly",
  "jeep_compass": "Firefly",
  "jeep_commander": "Firefly",
  "jeep_wrangler": "Firefly",
  "peugeot_208": "Firefly",
  "peugeot_2008": "Firefly",
  "peugeot_3008": "Firefly",
  "peugeot_308": "Firefly",
  "peugeot_408": "Firefly",
  "citroen_c3": "Firefly",
  "citroen_c4": "Firefly",
  "citroen_aircross": "Firefly",
  "citroen_c4_cactus": "Firefly"
};

/**
 * Busca o código do motor para um veículo
 */
export function getEngineCode(brand: string, model: string): string | null {
  const key = `${brand}_${model}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  if (VEHICLE_ENGINE_MAP[key]) {
    return VEHICLE_ENGINE_MAP[key];
  }
  
  // Busca parcial
  for (const [mapKey, engine] of Object.entries(VEHICLE_ENGINE_MAP)) {
    const [mapBrand, mapModel] = mapKey.split('_');
    if (brand.toLowerCase() === mapBrand && model.toLowerCase().includes(mapModel)) {
      return engine;
    }
  }
  
  // Fallback por marca
  const brandDefaults: Record<string, string> = {
    'volkswagen': 'EA211',
    'fiat': 'Firefly',
    'chevrolet': 'SGE',
    'hyundai': 'Kappa',
    'kia': 'Gamma',
    'toyota': '2ZR-FXE',
    'honda': 'L15B',
    'renault': 'SCe',
    'nissan': 'HR16DE',
    'ford': 'Sigma',
    'jeep': 'Firefly',
    'peugeot': 'Firefly',
    'citroen': 'Firefly',
    'citroën': 'Firefly',
  };
  
  return brandDefaults[brand.toLowerCase()] || null;
}

/**
 * Busca peças para um motor específico
 */
export function getPartsForEngine(engineCode: string): EnginePart[] {
  const engine = ENGINE_PARTS_MATRIX[engineCode];
  if (!engine) return [];
  
  if (engine.inherits && engine.parts.length === 0) {
    return getPartsForEngine(engine.inherits);
  }
  
  return engine.parts;
}

/**
 * Busca peças para um veículo (por marca/modelo)
 */
export function getPartsForVehicle(brand: string, model: string): EnginePart[] {
  const engineCode = getEngineCode(brand, model);
  if (!engineCode) return [];
  return getPartsForEngine(engineCode);
}

/**
 * Estatísticas da matriz
 */
export const MATRIX_STATS = {
  totalEngines: 24,
  totalParts: 238,
  totalEquivalents: 423,
  vehiclesMapped: 135,
};
