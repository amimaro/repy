export class Registry {
  name: string = "";
  url: string = "";
  description: string = "";
  publisher: string = "";
  github: string = "";
  repo: string = "";
  distro: string = "";
  arch: string = "";
  selectedRelease: string = "";
  releases: any[] = [];
  img: string = "";
  down: string = "";
  options: object = {
    'global': false,
    'save': false,
    'saveDev': false,
  };
  isSelected: boolean = false;
}
