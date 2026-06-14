import { Card, Deck } from '../types';

// Pronoun column order — must match the order of `forms` in every verb below.
export const PRONOUNS = ['yo', 'tú', 'él / ella', 'nosotros', 'ellos / ellas'] as const;

type RawVerb = {
  es: string;
  /** English meaning. */
  en: string;
  /** Present-tense forms: "yo,tú,él,nosotros,ellos". */
  forms: string;
};

type VerbGroup = {
  /** Fine-grained pattern label shown on each card. */
  pattern: string;
  /** Which verb deck this group rolls up into. */
  deck: 'stem' | 'irregular' | 'regular';
  verbs: RawVerb[];
};

// Source: the user's spanish_verbs_quiz Presente drill, regrouped into three
// learnable decks while keeping each verb's precise pattern as a card label.
const GROUPS: VerbGroup[] = [
  {
    pattern: 'e → ie',
    deck: 'stem',
    verbs: [
      { es: 'pensar', en: 'to think', forms: 'pienso,piensas,piensa,pensamos,piensan' },
      { es: 'querer', en: 'to want', forms: 'quiero,quieres,quiere,queremos,quieren' },
      { es: 'entender', en: 'to understand', forms: 'entiendo,entiendes,entiende,entendemos,entienden' },
      { es: 'empezar', en: 'to start', forms: 'empiezo,empiezas,empieza,empezamos,empiezan' },
      { es: 'sentir', en: 'to feel', forms: 'siento,sientes,siente,sentimos,sienten' },
      { es: 'cerrar', en: 'to close', forms: 'cierro,cierras,cierra,cerramos,cierran' },
      { es: 'mentir', en: 'to lie', forms: 'miento,mientes,miente,mentimos,mienten' },
      { es: 'preferir', en: 'to prefer', forms: 'prefiero,prefieres,prefiere,preferimos,prefieren' },
    ],
  },
  {
    pattern: 'o / u → ue',
    deck: 'stem',
    verbs: [
      { es: 'poder', en: 'to be able / can', forms: 'puedo,puedes,puede,podemos,pueden' },
      { es: 'recordar', en: 'to remember', forms: 'recuerdo,recuerdas,recuerda,recordamos,recuerdan' },
      { es: 'encontrar', en: 'to find', forms: 'encuentro,encuentras,encuentra,encontramos,encuentran' },
      { es: 'dormir', en: 'to sleep', forms: 'duermo,duermes,duerme,dormimos,duermen' },
      { es: 'jugar', en: 'to play', forms: 'juego,juegas,juega,jugamos,juegan' },
      { es: 'contar', en: 'to count / tell', forms: 'cuento,cuentas,cuenta,contamos,cuentan' },
      { es: 'probar', en: 'to try / taste', forms: 'pruebo,pruebas,prueba,probamos,prueban' },
      { es: 'soñar', en: 'to dream', forms: 'sueño,sueñas,sueña,soñamos,sueñan' },
      { es: 'volar', en: 'to fly', forms: 'vuelo,vuelas,vuela,volamos,vuelan' },
    ],
  },
  {
    pattern: 'e → i',
    deck: 'stem',
    verbs: [
      { es: 'pedir', en: 'to ask for', forms: 'pido,pides,pide,pedimos,piden' },
      { es: 'corregir', en: 'to correct', forms: 'corrijo,corriges,corrige,corregimos,corrigen' },
    ],
  },
  {
    pattern: 'irregular yo · -go',
    deck: 'irregular',
    verbs: [
      { es: 'hacer', en: 'to do / make', forms: 'hago,haces,hace,hacemos,hacen' },
      { es: 'salir', en: 'to go out / leave', forms: 'salgo,sales,sale,salimos,salen' },
      { es: 'traer', en: 'to bring', forms: 'traigo,traes,trae,traemos,traen' },
      { es: 'caer', en: 'to fall', forms: 'caigo,caes,cae,caemos,caen' },
      { es: 'poner', en: 'to put / place', forms: 'pongo,pones,pone,ponemos,ponen' },
    ],
  },
  {
    pattern: 'irregular yo · -zco',
    deck: 'irregular',
    verbs: [
      { es: 'reducir', en: 'to reduce', forms: 'reduzco,reduces,reduce,reducimos,reducen' },
      { es: 'conducir', en: 'to drive', forms: 'conduzco,conduces,conduce,conducimos,conducen' },
    ],
  },
  {
    pattern: 'irregular yo',
    deck: 'irregular',
    verbs: [
      { es: 'dar', en: 'to give', forms: 'doy,das,da,damos,dan' },
      { es: 'caber', en: 'to fit', forms: 'quepo,cabes,cabe,cabemos,caben' },
    ],
  },
  {
    pattern: 'irregular yo + stem',
    deck: 'irregular',
    verbs: [
      { es: 'tener', en: 'to have', forms: 'tengo,tienes,tiene,tenemos,tienen' },
      { es: 'venir', en: 'to come', forms: 'vengo,vienes,viene,venimos,vienen' },
      { es: 'oír', en: 'to hear', forms: 'oigo,oyes,oye,oímos,oyen' },
    ],
  },
  {
    pattern: 'fully irregular',
    deck: 'irregular',
    verbs: [
      { es: 'ser', en: 'to be (essence)', forms: 'soy,eres,es,somos,son' },
      { es: 'ir', en: 'to go', forms: 'voy,vas,va,vamos,van' },
      { es: 'estar', en: 'to be (state)', forms: 'estoy,estás,está,estamos,están' },
    ],
  },
  {
    pattern: 'regular',
    deck: 'regular',
    verbs: [
      { es: 'creer', en: 'to believe', forms: 'creo,crees,cree,creemos,creen' },
      { es: 'necesitar', en: 'to need', forms: 'necesito,necesitas,necesita,necesitamos,necesitan' },
      { es: 'hablar', en: 'to speak', forms: 'hablo,hablas,habla,hablamos,hablan' },
      { es: 'vivir', en: 'to live', forms: 'vivo,vives,vive,vivimos,viven' },
      { es: 'trabajar', en: 'to work', forms: 'trabajo,trabajas,trabaja,trabajamos,trabajan' },
      { es: 'buscar', en: 'to look for', forms: 'busco,buscas,busca,buscamos,buscan' },
      { es: 'esperar', en: 'to wait / hope', forms: 'espero,esperas,espera,esperamos,esperan' },
      { es: 'pagar', en: 'to pay', forms: 'pago,pagas,paga,pagamos,pagan' },
      { es: 'comprar', en: 'to buy', forms: 'compro,compras,compra,compramos,compran' },
    ],
  },
];

function cardsFor(deckKey: VerbGroup['deck']): Card[] {
  const cards: Card[] = [];
  for (const group of GROUPS) {
    if (group.deck !== deckKey) continue;
    for (const v of group.verbs) {
      cards.push({ en: v.en, es: v.es, meaning: v.en, pattern: group.pattern, forms: v.forms.split(',') });
    }
  }
  return cards;
}

export const VERB_DECKS: Deck[] = [
  {
    id: 'verbs-stem',
    title: 'Verbs · Stem-changing',
    titleEs: 'Verbos con cambio',
    emoji: '🔄',
    accent: '#EC4899',
    kind: 'verbs',
    cards: cardsFor('stem'),
  },
  {
    id: 'verbs-irregular',
    title: 'Verbs · Irregular',
    titleEs: 'Verbos irregulares',
    emoji: '⚡',
    accent: '#FF9F2E',
    kind: 'verbs',
    cards: cardsFor('irregular'),
  },
  {
    id: 'verbs-regular',
    title: 'Verbs · Regular',
    titleEs: 'Verbos regulares',
    emoji: '✏️',
    accent: '#22C06B',
    kind: 'verbs',
    cards: cardsFor('regular'),
  },
];
