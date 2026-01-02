import { Homework, Note, TeamsMessage } from './types';

export const MOCK_HOMEWORK: Homework[] = [
  {
    id: 'hw1',
    subject: 'Matematika',
    title: 'Analýza: Procvičování derivací',
    dueDate: '2023-10-28',
    description: 'Dokončete cvičení 5 až 20 na straně 142. Zaměřte se na řetízkové pravidlo.',
    platform: 'Bakaláři',
    completed: false,
  },
  {
    id: 'hw2',
    subject: 'Fyzika',
    title: 'Laboratorní práce: Kyvadlo',
    dueDate: '2023-10-30',
    description: 'Odevzdejte závěrečnou zprávu v PDF přes Teams. Zahrňte analýzu chyb.',
    platform: 'Teams',
    completed: false,
  },
  {
    id: 'hw3',
    subject: 'Dějepis',
    title: 'Esej: Průmyslová revoluce',
    dueDate: '2023-11-05',
    description: 'Napište esej o 1000 slovech na téma sociálních dopadů průmyslové revoluce.',
    platform: 'Bakaláři',
    completed: true,
  },
  {
    id: 'hw4',
    subject: 'Angličtina',
    title: 'Četba "1984" - Část 1',
    dueDate: '2023-10-29',
    description: 'Přečtěte si kapitoly 1-8 a připravte se na test.',
    platform: 'Bakaláři',
    completed: false,
  },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    subject: 'Biologie',
    topic: 'Buněčné dýchání',
    date: '2023-10-25',
    content: 'Glykolýza probíhá v cytoplazmě. Krebsův cyklus v mitochondriální matrix. Elektronový transportní řetězec produkuje nejvíce ATP.',
  },
  {
    id: 'n2',
    subject: 'Chemie',
    topic: 'Kovalentní vazba',
    date: '2023-10-24',
    content: 'Sdílení elektronových párů mezi atomy. Polární vs nepolární vazby závisí na rozdílu elektronegativity.',
  },
  {
    id: 'n3',
    subject: 'Informatika',
    topic: 'React Hooks',
    date: '2023-10-26',
    content: 'useState pro stav, useEffect pro vedlejší efekty. Vlastní hooky umožňují znovupoužití logiky. Virtuální DOM zvyšuje výkon.',
  },
];

export const MOCK_TEAMS_MESSAGES: TeamsMessage[] = [
  {
    id: 'tm1',
    sender: 'Pan Novák (Matika)',
    content: 'Nezapomeňte, že pololetní test je příští úterý! Doučování je v pondělí v 15:00.',
    timestamp: '2023-10-26 10:30',
    important: true,
  },
  {
    id: 'tm2',
    sender: 'Skupina 4.B',
    content: 'Už někdo dokončil ty otázky z fyziky?',
    timestamp: '2023-10-26 14:15',
    important: false,
  },
  {
    id: 'tm3',
    sender: 'Paní Dvořáková (Dějepis)',
    content: 'Nahrála jsem prezentaci z dnešní přednášky do záložky Soubory.',
    timestamp: '2023-10-25 16:00',
    important: false,
  },
];