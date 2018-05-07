import { Component , OnInit } from '@angular/core';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3';
import { HttpClient } from '@angular/common/http';

interface MyData {
  data: Keyword[];
}

interface Keyword {
  KEYWORD: string;
  CNT: number;
  relKeywords: RelKeyword[];
}

interface RelKeyword {
  KEYWORD: string;
  COUNT: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit{
  nodes: Node[] = [];
  links: Link[] = [];
  keywordList: Keyword[] = [];
  
  constructor(private http:HttpClient){}

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

    const N = APP_CONFIG.N;
    APP_CONFIG.NN = this.keywordList.length;
    for (let i=0; i<N ; i++) {
      this.nodes.push(new Node(i, this.keywordList[i].KEYWORD, this.keywordList[i].CNT));
    }
    //alert(JSON.stringify(this.keywordList));
    for (let i = 0; i < N-1; i++) {
      for (let m = i+1; m < N; m++) {
        for(let k = 0; k < this.keywordList[i].relKeywords.length; k ++ ){
          if(this.keywordList[i].relKeywords[k].KEYWORD == this.keywordList[m].KEYWORD){
            this.nodes[i].linkCount++;
            this.nodes[m].linkCount++;
            this.nodes[i].linked.push(this.nodes[m]);
            this.nodes[m].linked.push(this.nodes[i]);
            this.links.push(new Link(i, m, this.keywordList[i].relKeywords[k].COUNT));
            break;
          }
        } 
      }
    }
  }

  myClick(){
    this.http.get('/api/v1/mykeywords')
    .subscribe(
      (ret: any) => {
        this.keywordList = ret.data;
        this.setGraphData(this.keywordList);
      }
    )
  }
}