export interface Stat {
  value: string;
  label: string;
  detail?: string;
}

export const programStats: Stat[] = [
  { value: '252', label: 'declared students' },
  { value: '2nd', label: 'largest elective track in ME', detail: 'behind only Aerospace' },
  { value: '17%', label: 'of Mines ME track declarations' },
  { value: '126:1', label: 'student-to-faculty ratio' }
];

export const secondaryStats: Stat[] = [
  { value: '4', label: 'flagship competition teams', detail: 'FSAE, Shell Eco, BWC, EcoCAR' },
  { value: '2', label: 'required track courses', detail: 'MEGN 391 + MEGN 417/527, plus curated electives' },
  { value: '2', label: 'core faculty', detail: 'Duran and Brodsky' }
];
