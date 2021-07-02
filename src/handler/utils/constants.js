export const PROJECT_NAME = "Skill Booster";
export const HOME = "Accueil";
export const PROFILE = "Mon compte";
export const MYCV = "Mes CV";
export const SHARE_CV = "CV Partagés";
export const MY_OFFERS = "Mes offres";
export const SETTINGS = "Paramètres";
export const PASSWORD = "Modification du mot de pesse";
export const ADD_OFFER = "CREATION D'UNE OFFRE";
export const ADD_ACTUALITE = "CREATION D'UNE ACTUALITE";
const LOGIN = "Connexion";

export const titles = {
  LOGIN,
};

export const work_timeConst = [
  {
    id: 1,
    value: "FULL",
    label: "Temps plein",
  },
  {
    id: 2,
    value: "HALF",
    label: "Mi-temps",
  },
  {
    id: 3,
    value: "ANY",
    label: "Autres",
  },
];

export const contratConst = [
  {
    id: 1,
    value: "CDD",
    label: "CDD",
  },
  {
    id: 2,
    value: "CDI",
    label: "CDI",
  },
  {
    id: 3,
    value: "STAGE",
    label: "STAGE",
  },
  {
    id: 4,
    value: "FREELENCE",
    label: "FREELANCE",
  },
  {
    id: 5,
    value: "ALTERNANCE",
    label: "ALTERNANCE",
  },
];

export const etudeConst = [
  {
    id: 1,
    value: "ONE",
    label: "BAC+1",
  },
  {
    id: 2,
    value: "TWO",
    label: "BAC+2",
  },
  {
    id: 3,
    value: "THREE",
    label: "BAC+3",
  },
  {
    id: 4,
    value: "FOUR",
    label: "BAC+4",
  },
  {
    id: 5,
    value: "FIVE",
    label: "BAC+5",
  },
  {
    id: 6,
    value: "MORE_THAN_FIVE",
    label: "> BAC+5",
  },
];
export const typeFormation = [
  {
    id: 1,
    value: "Alternance",
    label: "Alternance",
  },
  {
    id: 2,
    value: "Continue",
    label: "Continue",
  },
];
export const dureeFormation = [
  {
    id: 1,
    value: "TWO",
    label: "BAC+2",
  },
  {
    id: 4,
    value: "THREE",
    label: "LICENCE",
  },
  {
    id: 5,
    value: "FOUR",
    label: "BAC+4",
  },
  {
    id: 6,
    value: "FIVE",
    label: "BAC+5",
  },
];

export const statusConst = [
  {
    id: 1,
    value: "DRAFT",
    label: "Brouillons",
  },
  {
    id: 3,
    value: "PUBLISHED",
    label: "Mes offres publiées",
  },
  {
    id: 4,
    value: "ARCHIVED",
    label: "Mes offres archivées",
  },
];

export const sortApplicationsConst = [
  {
    id: 1,
    value: "recent",
    label: "Date de candidature",
  },
  {
    id: 2,
    value: "experience",
    label: "Expérience",
  },
  {
    id: 3,
    value: "disponibility",
    label: "Disponibilité",
  },
];
export const ActualiteStatusConst = [
  {
    id: 0,
    value: "TOUT",
    label: "Toutes les Actus RH",
  },
  {
    id: 1,
    value: "ACTIF",
    label: "Actus RH actives",
  },
  {
    id: 2,
    value: "EXPIRED",
    label: "Actus RH expirées",
  },
];
export const sortOffersConst = [
  {
    id: 1,
    value: "name;1",
    label: "A-Z",
  },
  {
    id: 2,
    value: "name;-1",
    label: "Z-A",
  },
  {
    id: 3,
    value: "createdAt;-1",
    label: "Les plus récentes",
  },
  {
    id: 4,
    value: "createdAt;1",
    label: "Les plus anciennes",
  },
];
export const sortFormationsConst = [
  {
    id: 0,
    value: "one;1",
    label: "Niveau d'étude",
  },
  {
    id: 1,
    value: "TWO;-1",
    label: "BAC+2",
  },
  {
    id: 4,
    value: "THREE;-1",
    label: "LICENCE",
  },
  {
    id: 5,
    value: "FOUR;-1",
    label: "BAC+4",
  },
  {
    id: 6,
    value: "FIVE",
    label: "BAC+5",
  },
];
export const sortstudyConst = [
  {
    id: 0,
    value: "All;1",
    label: "Type de formation",
  },
  {
    id: 1,
    value: "Continue;-1",
    label: "Formation Continue",
  },
  {
    id: 2,
    value: "Alternance;-1",
    label: "Formation en Alternance",
  },
];
export const experienceConst = [
  {
    id: 1,
    value: "ONE",
    label: "< 1 an",
  },
  {
    id: 2,
    value: "TWO",
    label: "1-3 ans",
  },
  {
    id: 3,
    value: "THREE",
    label: "3-5 ans",
  },
  {
    id: 4,
    value: "FOUR",
    label: "5-7 ans",
  },
  {
    id: 5,
    value: "FIVE",
    label: "5-10 ans",
  },
  {
    id: 6,
    value: "MORE_THAN_FIVE",
    label: "> 10 ans",
  },
];

export const routeToTitle = {
  accueil: {
    title: HOME,
    icon: "home",
  },
  compte: {
    title: PROFILE,
    icon: "my-account",
  },
  "mes-cv": {
    title: MYCV,
    icon: "my-cv",
  },
  "cv-partages": {
    title: SHARE_CV,
    icon: "shared-cv",
  },
  "mes-offres": {
    title: MY_OFFERS,
    icon: "my-offers",
  },
  parametres: {
    title: SETTINGS,
    icon: "settings",
  },
  "changer-mot-de-passe": {
    title: PASSWORD,
    icon: "settings",
  },
  "creation-une-offre": {
    title: ADD_OFFER,
    icon: "my-offers",
  },
  "creation-une-actualité": {
    title: ADD_ACTUALITE,
    icon: "my-actualité",
  },
};

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NAME_REGEX = /^[a-zA-Z ]{2,50}$/;
export const REGEX_MOBILE = /^[0-9]{9,13}$/;
export const REGEX_WEBSITE = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const ALERT_WARNING = {
  type: "warning",
  icon: "fa fa-exclamation-triangle",
};

export const ALERT_ERROR = {
  type: "error",
  icon: "fa fa-exclamation-circle",
};

export const ALERT_INFO = {
  type: "info",
  icon: "fa fa-info",
};

export const ALERT_SUCCESS = {
  type: "success",
  icon: "fa fa-check",
};

export const ALERT_DEFAULT_CONFIG = {
  manyInstances: false,
  disableAutoClose: false,
  autoClose: 2500,
};

const isLocal = true;

const PROTOCOL = isLocal ? "http://" : "https://";
const WS_PROTOCOL = isLocal ? "ws://" : "wss://";
const HOST = isLocal ? "localhost:6520" : "api.boostmyjob.com";
//const PORT = "6500";
const WS_ENDPOINT = "/subscriptions";

export const BASE_URL = `${PROTOCOL}${HOST}`;
export const WS_URL = `${WS_PROTOCOL}${HOST}${WS_ENDPOINT}`;
