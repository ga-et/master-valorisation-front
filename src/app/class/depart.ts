import { Centrecout } from "./centrecout";
import { Departement } from "./departement";
import { Entite } from "./entite";
import { Raison } from "./raison";
import { Societe } from "./societe";

export interface Depart {
    id: Number;
    date: Date;
    hrbp: String;
    entree: Date;
    matricule: String;
    typecontrat: String;
    taux: Number;
    lieutravail: String;
    motif: String;
    anciennete: Number;
    raison: Raison;
    societe: Societe;
    departement: Departement;
    centrecout: Centrecout;
    entite: Entite;
}