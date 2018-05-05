import APP_CONFIG from '../../app.config';

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

  constructor(id, keyword, totalCount) {
    this.id = id;
    this.keyword = keyword;
    this.totalCount = totalCount;
  }

  normal = () => {
    return Math.sqrt(this.totalCount / APP_CONFIG.N);
  }

  get r() {
    return 150 * this.normal() + 10;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[index];
  }
}
