import { Component , OnInit , Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { D3Service, ForceDirectedGraph } from './d3';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

interface MyData {
  data: Keyword[];
}

interface Keyword {
  KEYWORD: string;
  CNT: number;
  relKeywords: RelKeyword[];
  totalLinkCnt: number;
}

interface RelKeyword {
  KEYWORD: string;
  COUNT: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent  implements OnInit{
  nodes: Node[] = [];
  links: Link[] = [];

  graph: ForceDirectedGraph;

  n: number = 100;

  private _options: { width, height } = { width: 1024, height: 768 };

  myColorScale: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //this.graph.initSimulation(this.options);
  }
  keywordList: Keyword[] = [];
  
  constructor(private http:HttpClient , private d3Service: D3Service, private ref: ChangeDetectorRef){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  setGraphData(keywords: Keyword[]){
    
    this.nodes = [];
    this.links = [];

    
    keywords.sort(function complare(a,b){
      return b.CNT - a.CNT;
    })

    //APP_CONFIG.N = keywords.length;

    //const N = APP_CONFIG.N;
    APP_CONFIG.NN = this.keywordList.length;

    let max = 0;
    // var sumLink = new Array();
    for (let i=0; i<this.n ; i++) {
      this.keywordList[i].totalLinkCnt = 0;
        for(let j=0; j < this.keywordList[i].relKeywords.length; j ++){
          if(this.keywordList[i].relKeywords[j].COUNT != NaN) this.keywordList[i].totalLinkCnt += this.keywordList[i].relKeywords[j].COUNT;
        }
        // this.nodes[i].totalLinkCnt = this.keywordList[i].totalLinkCnt;
        max = (max < this.keywordList[i].totalLinkCnt) ? this.keywordList[i].totalLinkCnt : max;
    }
    // console.log(max + " ##");
    APP_CONFIG.MAXLINK = max;
    this.myColorScale = d3.scaleLinear().domain([1,APP_CONFIG.MAXLINK])
    .range([0,10]);

    for (let i=0; i<this.n ; i++) {
      this.nodes.push(new Node(i, this.keywordList[i].KEYWORD, this.keywordList[i].CNT, this.myColorScale(this.keywordList[i].totalLinkCnt), this.keywordList[i].totalLinkCnt));
    }
    //alert(JSON.stringify(this.keywordList));
    for (let i = 0; i < this.n-1; i++) {
      for (let m = i+1; m < this.n; m++) {
        for(let k = 0; k < this.keywordList[i].relKeywords.length; k ++ ){
          if(this.keywordList[i].relKeywords[k].KEYWORD == this.keywordList[m].KEYWORD){
            this.nodes[i].linkCount++;
            this.nodes[m].linkCount++;

            if(this.keywordList[i].relKeywords[k].COUNT > 4){
              this.links.push(new Link(i, m, this.keywordList[i].relKeywords[k].COUNT));
              this.nodes[i].linked.push(this.nodes[m]);
              this.nodes[m].linked.push(this.nodes[i]);
            }
            break;
          }
        } 
      }
    }
  }

  ngAfterViewInit() {
    //this.graph.initSimulation(this.options);
  }

  get options() {
    //return this._options
    if(window.innerHeight <= 382){
      return this._options = {
        width: window.innerWidth,
        height: window.innerHeight-117 - 120
      };
    }else if(window.innerHeight <= 767){
      return this._options = {
        width: window.innerWidth,
        height: window.innerHeight-117 - 60
      };
    }else{
      return this._options = {
        width: window.innerWidth,
        height: window.innerHeight-117
      };
    }
  }

  myClick(nn){
   
    this.http.get('/api/v1/mykeywords')
    .subscribe(
      (ret: any) => {
        this.keywordList = ret.data;
        
        this.n = nn;

        this.setGraphData(this.keywordList);

        this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

        /** Binding change detection check on each tick
         * This along with an onPush change detection strategy should enforce checking only when relevant!
         * This improves scripting computation duration in a couple of tests I've made, consistently.
         * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
         */
        this.graph.ticker.subscribe((d) => {
          this.ref.markForCheck();
        });
      }
    )
  }

}