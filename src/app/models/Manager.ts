export class Manager {
  filename: string = "";
  script: string = "";
  repo: string = "";
  repos: object[] = [];
  searchInput: string = "";
  searchedPacks: any[] = [];
  selectedPacks: any[] = [];
  shared: any[] = [];
  displayOS: string = 'Linux';
  selectedOS: string = 'linux';
  os: any[] = ['Windows', 'Linux', 'MacOS'];
  review: number = 0;
}
