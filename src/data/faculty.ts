export interface FacultyMember {
  slug: string;
  name: string;
  title: string;
  credentials: string;
  bio: string;
  headshot?: string;
  email: string;
  expertise: string[];
  courses: string[];
  links: {
    linkedin?: string;
    orcid?: string;
    website?: string;
    googleScholar?: string;
  };
}

export const faculty: FacultyMember[] = [
  {
    slug: 'adam-duran',
    name: 'Adam W. Duran',
    title: 'Assistant Teaching Professor of Mechanical Engineering',
    credentials: 'P.E. Colorado, PMP',
    bio: 'Co-Founder and Co-Director of the Mines Automotive Engineering Program. Twelve years at NREL including Fleet DNA principal investigator and GCxN co-founder. Former senior engineer at QuantumScape working on automated driving systems. Teaches MEGN 301, 300, and the automotive-track core courses.',
    headshot: '/images/faculty/adam-duran.jpg',
    email: 'aduran@mines.edu',
    expertise: [
      'Automotive powertrains',
      'Battery systems',
      'Electric and hybrid vehicles',
      'Vehicle-level energy modeling',
      'Connected and automated vehicles'
    ],
    courses: ['MEGN 301', 'MEGN 300', 'MEGN 200'],
    links: {
      linkedin: 'https://www.linkedin.com/in/adamduran/',
      orcid: 'https://orcid.org/0000-0002-7776-3896',
      website: 'https://adamwduran.com',
      googleScholar: 'https://scholar.google.com/citations?user=ADAM_SCHOLAR_ID'
    }
  },
  {
    slug: 'polina-brodsky',
    name: 'Polina Brodsky',
    title: 'Assistant Teaching Professor of Mechanical Engineering',
    credentials: '',
    bio: 'Co-Lead of the Mines Automotive Engineering Program. Advises FSAE and Shell Eco-marathon and co-leads the Battery Workforce Challenge and EcoCAR Innovation Challenge. Focus on curriculum, hands-on engineering instruction, and student teams.',
    headshot: '/images/faculty/polina-brodsky.jpg',
    email: 'pbrodsky@mines.edu',
    expertise: [
      'Vehicle dynamics',
      'Mechanical design',
      'Hands-on engineering education',
      'Student competition teams'
    ],
    courses: ['MEGN 417', 'MEGN 200'],
    links: {}
  }
];
