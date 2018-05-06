import { Component } from '@angular/core';
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

export class AppComponent {
  nodes: Node[] = [];
  links: Link[] = [];
  keywordList: Keyword[] = [];
  
  constructor(private httpClient:HttpClient) {
    const N = APP_CONFIG.N;
    /** constructing the nodes array */
    this.httpClient
    .get<MyData>("/api/v1/mykeywords")
    .subscribe(

      (ret:any) => {
        this.keywordList = ret.data;
        APP_CONFIG.N = this.keywordList.length;

        // for (let i=0; i<this.keywordList.length ; i++) {
        //   this.nodes.push(new Node(i, this.keywordList[i].KEYWORD, this.keywordList[i].CNT));
        // }
        // alert(JSON.stringify(this.keywordList));
        // for (let i = 0; i < N-1; i++) {
        //   for (let m = i+1; m < N; m++) {
        //     for(let k = 0; k < this.keywordList[i].relKeywords.length; k ++ ){
        //       if(this.keywordList[i].relKeywords[k].KEYWORD == this.keywordList[m].KEYWORD){
        //         this.nodes[i].linkCount++;
        //         this.nodes[m].linkCount++;
        //         this.links.push(new Link(i, m));
        //         break;
        //       }
        //     } 
        //   }
        // }
       }) 
       
      // for (let i = 1; i <= N; i++) {
      //   this.nodes.push(new Node(i, 'KEYWORD'+i, i));
      // }
  
      // for (let i = 1; i <= N; i++) {
      //   for (let m = 2; i * m <= N; m++) {
      //     /** increasing connections toll on connecting nodes */
      //     this.nodes[i-1].linkCount++;
      //     this.nodes[(i * m)-1].linkCount++;
  
      //     /** connecting the nodes before starting the simulation */
      //     this.links.push(new Link(i, i * m));
      //   }
      // }

      for (let i=0; i<this.keywordList.length ; i++) {
        this.nodes.push(new Node(i, this.keywordList[i].KEYWORD, this.keywordList[i].CNT));
      }
      alert(JSON.stringify(this.keywordList));
      for (let i = 0; i < N-1; i++) {
        for (let m = i+1; m < N; m++) {
          for(let k = 0; k < this.keywordList[i].relKeywords.length; k ++ ){
            if(this.keywordList[i].relKeywords[k].KEYWORD == this.keywordList[m].KEYWORD){
              this.nodes[i].linkCount++;
              this.nodes[m].linkCount++;
              this.links.push(new Link(i, m));
              break;
            }
          } 
        }
      }
  }

  myEvent(){

  }
}
