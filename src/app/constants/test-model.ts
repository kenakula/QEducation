import { Timestamp } from 'firebase/firestore';
import { Category } from './category-model';
import { UserRole } from './user-roles';

// eslint-disable-next-line no-shadow
export enum QuestionType {
  SingleAnswer,
  MultiAnswer,
  OpenAnswer,
}

export interface QuestionOption {
  title: string;
  isCorrect: boolean;
}

export interface QuestionModel {
  id: string;
  title: string;
  questionType: QuestionType;
  options?: QuestionOption[];
}

export interface TestModel {
  id: string;
  title: string;
  description?: string;
  created: Timestamp;
  roles: UserRole[];
  categories: string[];
  questions: QuestionModel[];
}

export const tests: TestModel[] = [
  {
    id: '1',
    title: 'Тест на знание чего-то важного',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
    created: Timestamp.now(),
    roles: [UserRole.Administrator, UserRole.Doctor],
    categories: ['Лайфхаки'],
    questions: [
      {
        id: '1',
        title:
          'tur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ',
        questionType: QuestionType.SingleAnswer,
        options: [
          {
            title: 'option1',
            isCorrect: false,
          },
          {
            title: 'option2',
            isCorrect: false,
          },
          {
            title: 'option3',
            isCorrect: true,
          },
          {
            title: 'option4',
            isCorrect: false,
          },
        ],
      },
      {
        id: '2',
        title:
          'tur adipin culpa qui officia deserunt mollit anim id ecididunt ut labore et dolore magna a',
        questionType: QuestionType.MultiAnswer,
        options: [
          {
            title: 'option1',
            isCorrect: false,
          },
          {
            title: 'option2',
            isCorrect: true,
          },
          {
            title: 'option3',
            isCorrect: true,
          },
          {
            title: 'option4',
            isCorrect: false,
          },
        ],
      },
      {
        id: '3',
        title:
          ' cupidatat non proident, sunt in culpa qui officia deserunt mollit anim i',
        questionType: QuestionType.OpenAnswer,
      },
    ],
  },
];
