import { FT } from "~/utils/models/FT";

export interface FA {
  count?: number;
  status: string;
  general?: {
    name: string;
    type: string;
  };
  equipments: { _id: string; name: string; required: number }[];
  timeframes: { start: Date; end: Date; name: string }[];
  validated: String[];
  refused: String[];
  comments: { time: Date; text: string; validator: string; topic?: string }[];
  FTs: FT[];
  isValid: boolean;
  securityPasses: SecurityPass[];
  signalisation: Signalisation[];
  electricityNeeds: ElectricityNeed[];
}

export interface ElectricityNeed {
  connectionType: string;
  power: number;
}

export interface Signalisation {
  name: string;
  type: string;
  number: number;
  text: string;
}

export interface SecurityPass {
  fullname: string;
  phone: string;
  email: string;
  comment: string;
  licensePlate: string;
  timeslots: string[];
}

export enum EquipmentTypes {
  BARS = "BARS",
  BOIS = "BOIS",
  BRICOLAGE = "BRICOLAGE",
  CANAP = "CANAPE/FAUTEUIL",
  CUISINE = "CUISINE",
  DECO = "DECO",
  FRIGO = "FRIGO",
  LITTERIE = "LITTERIE",
  PROPRETE = "PROPRETE",
  SCENE = "SCENE",
  SECU = "SECU",
  TENTE = "TENTE",
  AUTRE = "AUTRES MATOS",
}

export enum BarrieresTypes {
  BARRIERE = "BARRIERE",
}

export enum ElecTypes {
  ALIM = "ALIMENTATION ELECTRIQUE",
  ECLAIRAGE = "ECLAIRAGE",
  AUTRE = "AUTRES ELEC",
}
