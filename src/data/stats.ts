export interface Stat {
  value: string;
  label: string;
  detail?: string;
}

export const programStats: Stat[] = [
  { value: '252', label: 'declared students' },
  { value: '8', label: 'new courses' },
  { value: '17%', label: 'of Mines ME track declarations' },
  { value: '126:1', label: 'student-to-faculty ratio' }
];

export const secondaryStats: Stat[] = [
  { value: '4', label: 'flagship competition teams', detail: 'FSAE, Shell Eco, BWC, EcoCAR' },
  { value: '3', label: 'departments contributing courses', detail: 'MEGN, EBGN, EDS' },
  { value: '2', label: 'core faculty', detail: 'Duran and Brodsky' }
];
