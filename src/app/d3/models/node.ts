import APP_CONFIG from '../../app.config';
import { D3Service } from '../';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;

  keyword: string;
  totalCount: number = 0;

  linkCount: number = 0;
  linked: Node[] = [];

  clicked: boolean = false;

  colorAlpha: number = 0;

  constructor(id, keyword, totalCount) {
    this.id = id;
    this.keyword = keyword;
    this.totalCount = totalCount;
    this.colorAlpha = totalCount;
  }

  normal = () => {
    return Math.sqrt(this.totalCount / APP_CONFIG.N);
  }

  get r() {
    return 70 * this.normal() + 10;
  }

  get fontSize() {
    return (10 * this.normal() + 10) + 'px';
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * Math.sqrt(this.colorAlpha / APP_CONFIG.NN));
    return APP_CONFIG.SPECTRUM[index];
  }
}
