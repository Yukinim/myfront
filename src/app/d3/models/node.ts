import APP_CONFIG from '../../app.config';
import { D3Service } from '../';
import * as d3 from 'd3';

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
  totalLinkCnt: number = 0;

  linkCount: number = 0;
  linked: Node[] = [];

  clicked: boolean = false;

  colorAlpha: number;

  fontFillStr: string = 'rgb(255,255,255)';
  fontStrokeStr: string = 'rgb(255,255,255)';

  constructor(id, keyword, totalCount, color, totalLinkCnt) {
    this.id = id;
    this.keyword = keyword;
    this.totalCount = totalCount;
    this.colorAlpha = color;
    this.totalLinkCnt = totalLinkCnt;
  }

  normal = () => {
    return Math.sqrt(this.totalCount / APP_CONFIG.N);
  }

  get r() {
    return 70 * this.normal() + 10;
  }

  get fontSize() {
    return (20 * this.normal() + 10) + 'px';
  }
  get fontFill() {
    return this.fontFillStr;
  }
  get fontStroke() {
    return this.fontStrokeStr;
  }
  get color() {
    //let index = Math.floor(APP_CONFIG.SPECTRUM.length * Math.sqrt(this.colorAlpha / APP_CONFIG.NN));
    // console.log(this.colorAlpha);
    
    // if(this.keyword=="김성태") console.log((this.colorAlpha));
    return APP_CONFIG.SPECTRUM[Math.round(this.colorAlpha)];
  }
}
