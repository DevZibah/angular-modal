import { InMemoryDbService } from 'angular-in-memory-web-api';
import { IForm } from './form-Interface';

export class formBackData implements InMemoryDbService {
  createDb(): { data: IForm[] } {
    let data: IForm[] = [
      {
        id: 1,
        firstName: 'Emma',
        lastName: 'Lukemon',
        bodySize: 10,
        description: 'I love art',
      },
      {
        id: 2,
        firstName: 'Cyndy',
        lastName: 'Eli',
        bodySize: 14,
        description: 'skating is what i probably do with most of my time',
      },
      {
        id: 3,
        firstName: 'hilda',
        lastName: 'tules',
        bodySize: 18,
        description: 'photography is literally world best art',
      },
      {
        id: 4,
        firstName: 'Vera',
        lastName: 'Empenada',
        bodySize: 12,
        description: 'italian pasta is the best',
      },
    ];

    return { data };
  }
}
