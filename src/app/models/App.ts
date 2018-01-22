import { Manager } from './Manager';

export class App {
  filename: string = "";
  script: string = "";
  manager: string = "";
  managers: Manager[] = [];
  searchInput: string = "";
  searchedPacks: any[] = [];
  selectedPacks: any[] = [];
  shared: any[] = [];
  displayOS: string = 'Linux';
  selectedOS: string = 'linux';
  os: any[] = ['Windows', 'Linux', 'MacOS'];
  review: number = 0;
  code: string = '';
}
