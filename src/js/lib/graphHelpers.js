// takes a value between 0 and 100 and returns value of same percentage with diff base
const createPercentage = function(percentage, base){
  return (percentage * base) / 100
} 
// takes a value between 0 and 100 and returns the degree value for the endpoint of the arc bar fill
export const createArcFill = function(percentage, arc_settings){
  return createPercentage(percentage, arc_settings.length) - arc_settings.width
} 

export const make_chart_base = function(svg, title) {
    var bg = svg.append("g")
    bg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#FBFBFB")
    bg.append("text")
        .attr("dy", "0.32em")
        .attr("x", 30)
        .attr("y", 40)
        .attr("fill", "#4A4A4A")
        .attr("font-size", "14px")
        .attr("text-anchor", "start")  
        .text(title)
    return bg    
}

export const make_y_gridlines = function(y,ticks) {   
      return d3.axisLeft(y)
          .ticks(5)
}