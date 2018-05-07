import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
import APP_CONFIG from '../app.config';
import * as d3 from 'd3';

@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
    * while maintaining the d3 simulations physics
    */


  constructor() { }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    }

    zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom);
  }

  applyClickBehaviour(element, node: Node, graph: ForceDirectedGraph) {

    const d3element = d3.select(element);
    // alert(APP_CONFIG.MAXLINK);

    function myClick(){
      let colorAlphaToChange = 0;
      let newFillStr = 'rgb(255,255,255)';
      let newStrokeStr = 'rgb(255,255,255)';
      if(!node.clicked){
        colorAlphaToChange = APP_CONFIG.NN;
        newFillStr = 'rgb(0,0,0)';
        newStrokeStr = 'rgb(0,0,0)';
      }
      node.clicked = !node.clicked;
      var scale = d3.scaleLinear().domain([1,APP_CONFIG.MAXLINK])
      .range([0,10]);
     
      node.colorAlpha = (colorAlphaToChange == 0 ? scale(node.totalLinkCnt) : colorAlphaToChange);
      node.fontFillStr = newFillStr;
      node.fontStrokeStr = newStrokeStr;
      for(let i = 0 ; i < node.linked.length; i ++){
        node.linked[i].colorAlpha = (colorAlphaToChange == 0 ? scale(node.linked[i].totalLinkCnt) : colorAlphaToChange);
        node.linked[i].fontFillStr = newFillStr;
        node.linked[i].fontStrokeStr = newStrokeStr;
        node.linked[i].clicked = !node.linked[i].clicked;
      }
    }
    d3element.on('click', myClick);
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);

    function started() {
      /** Preventing propagation of dragstart to parent elements */
      d3.event.sourceEvent.stopPropagation();

      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      d3.event.on('drag', dragged).on('end', ended);

      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call(d3.drag()
      .on('start', started));
  }

  /** The interactable graph we will simulate in this article
  * This method does not interact with the document, purely physical calculations with d3
  */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
    const sg = new ForceDirectedGraph(nodes, links, options);
    return sg;
  }
}
