import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ID3Js } from "./quad2D3";

//https://observablehq.com/@xianwu/force-directed-graph-network-graph-with-arrowheads-and-lab
// https://www.d3indepth.com/force-layout/
//https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6/63693424#63693424
export default function GraphComponent({dataSet}:{dataSet:ID3Js}) {
    const graph = useRef<HTMLDivElement>(null);
    const colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
    .domain(dataSet.nodes.map(n=>n.prefix))
    .range(['#ff9e6d', '#86cbff', '#c2e5a0','#fff686','#9e79db','#6e7b8b','#d9534f','#e5c9b9','#bcd2ee'])

    useEffect(() => {
      console.log('graphcomponent')
      console.dir(dataSet)
     

      const margin = {
        top: 30,
        right: 80,
        bottom: 5,
        left: 5
      }
      let width = 905
      let height = 765

      const svg = d3.select(graph.current).append("svg")
      .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .call(d3.zoom().on("zoom", function (event:any) {
            svg.attr("transform", event.transform)
         }) as any)
      .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

      svg.append('defs').append('marker')
      .attr("id",'arrowhead')
      .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
       .attr('refX',22) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
       .attr('refY',0)
       .attr('orient','auto')
          .attr('markerWidth',8)
          .attr('markerHeight',8)
          .attr('xoverflow','visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke','none');
  
  
      // Initialize the links
      const link = svg.selectAll(".links")
      .data(dataSet.links)
      .enter()
      .append("line")
      .attr("class", "links")
      .attr('marker-end','url(#arrowhead)')
      .style('stroke', '#999')
      .style('stroke-opacity',0.6) //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.
      .style('stroke-width','2px');
      //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
  //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
  link.append("title")
  .text(d => d.name);
  
      const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
          .data(dataSet.links)
          .enter()
          .append('path')
          .attr('class', 'edgepath')
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .attr('id', function (d, i) {return 'edgepath' + i})
          .style("pointer-events", "none");
  
      const edgelabels = svg.selectAll(".edgelabel")
          .data(dataSet.links)
          .enter()
          .append('text')
          .style("pointer-events", "none")
          .attr('class', 'edgelabel')
          .attr('id', function (d, i) {return 'edgelabel' + i})
          .attr('font-size', 12)
          .attr('fill', '#000000');
  
      edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
      .attr('xlink:href', function (d, i) {return '#edgepath' + i})
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .text(d => d.name);
  
      //const width = +svg.attr("width");
      //const height = +svg.attr("height");
       //Listen for tick events to render the nodes as they update in your Canvas or SVG.
       console.log('dataset')
       console.dir(dataSet)
       const simulation = d3.forceSimulation(dataSet.nodes as any)
       .force("link", d3.forceLink().links(dataSet.links).strength(0.1))
       .force("charge", d3.forceManyBody().strength(-600))
       .force("center", d3.forceCenter(width / 2, height / 2));

      // Initialize the nodes
      function drag(simulation:any) {    
          function dragstarted(event:any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          }
          
          function dragged(event:any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          }
          /*
          function dragended(event:any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }*/
          
          return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            //.on("end", dragended);
        }
      
      const node = svg.selectAll(".nodes")
      .data(dataSet.nodes as any)
      .enter()
      .append("g")
      .attr("class", "nodes")
      .call(drag(simulation) as any);
  
      node.append("title")
      .text((d:any) => d.id + ": " + d.name + " - " + d.group)
      node.append("circle")
      .attr("r", d=> 20)//+ d.runtime/20 )
      .style("stroke", "grey")
      .style("stroke-opacity",0.3)
      .style("stroke-width", (d:any) => d.runtime/10)
      .style("fill", "#f5b042")
      .style("fill", (d:any) => colorScale(d.prefix)as string)

      node.append("text")
      .attr("dy", 4)
      .attr("dx", -6)
      .attr('font-size', 10)
      .html((d:any)=>{
        let newText = '';
        let name = d.name.split('');
        let chunk = 0;

        for(let i=0;name.length -1;i++){
          let step = Math.floor(i/13)
          let x = 0 // otherwise there is a line intendation of 12px
          let y = 0
          if(step>1){
            x= -6 ; y =13
          } 
          if(step > chunk){
            newText = `${newText}  <tspan x="${x}px" dy="${y}px">${name.splice(Math.max(0, chunk-1),(step + 13)).join('')}</tspan>`
            chunk = step
          }
          if( name.length - (step + 7) < 13){
            if(step === 1) y=13
            newText = `${newText}  <tspan x="${x}px" dy="${y}px">${name.splice(chunk-1,name.length - 1).join('')}</tspan> `
            break
          }
        }
        return newText
      })
     
      simulation
      .nodes(dataSet.nodes as any)
      .on("tick", ticked);
  
      (simulation?.force("link") as any)
      ?.links(dataSet.links);

      // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
      function ticked() {
        link.attr("x1", (d:any) => d.source.x)
        .attr("y1", (d:any) => d.source.y)
        .attr("x2", (d:any) => d.target.x)
        .attr("y2", (d:any) => d.target.y);
        
        node.attr("transform", (d:any) => `translate(${d.x},${d.y})`);
        
        edgepaths.attr('d', (d:any) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
      }
    })
   
    return(
        <div className="rdf-graph" ref={graph}></div>  
    )
}
