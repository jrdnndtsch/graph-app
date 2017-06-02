// ============= chart prototyoes =============

// arc object prototype
// width should be a val between 50 and 140
function ArcSettings(width = 130, colors, target, base_color, title){
    this.width = width;
    this.start =  -Math.abs(this.width);
    this.end =  Math.abs(this.width);
    this.length = this.width * 2;
    this.colors = colors;
    this.target = target;
    this.base_color = base_color;
    this.title = title;
}

// map object prototype
function MapSettings(colors, target, title){
    this.colors = colors;
    this.target = target;
    this.title = title;
}

// stacked bar object prototype
function StackedBarSettings(target, colors, tick_num, title){
  this.target = target;
  this.colors = colors;
  this.tick_num = tick_num;
  this.title = title;
}





// ============= helper methods ============= 
ar.make_chart_base = function(svg, title) {
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

ar.make_y_gridlines = function(y,ticks) {   
    return d3.axisLeft(y)
        .ticks(5)
}
// takes a value between 0 and 100 and returns value of same percentage with diff base
ar.createPercentage = function(percentage, base){
  return (percentage * base) / 100
} 
// takes a value between 0 and 100 and returns the degree value for the endpoint of the arc bar fill
ar.createArcFill = function(percentage, arc_settings){
  return ar.createPercentage(percentage, arc_settings.length) - arc_settings.width
} 




// ============= chart methods ============= 
ar.stackedBar = function(bar_settings) {
  var svg = d3.select(bar_settings.target),
      margin = {top: 75, right: 30, bottom: 30, left: 60},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom
  
  // make a rectangle to act as the background        
  var bg = ar.make_chart_base(svg, bar_settings.title)
       
  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
      .rangeRound([0, width]) // set the range of the x-axis
      .paddingInner(0.30) // value btw 0 and 1 - ratio of range reserved for blank space
      .align(0.5);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(bar_settings.colors);

  d3.csv("stacked_bar_data.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t; // add up the total for each bar and add total to the bar data object
    return d;
  }, function(error, data) {
    if (error) throw error;
    var keys = data.columns.slice(1); // remove title of x-axis data
    var title = data.columns[0] // set title of the x-axis
    data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d[title]; })); // create array of all x-axis labels
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice(); // set range for y-axis

    z.domain([keys]);

    // the x-axis labels   
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "grid")
      .call(ar.make_y_gridlines(y, bar_settings.tick_num)
              .tickSize(-width)
              .tickFormat("")
        ) 
      .append("g")
        .call(d3.axisLeft(y).ticks(bar_settings.tick_num)) 
      
    // the bars
    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data[title]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())    
  });
}







ar.radialBar = function(arc_settings) {
  // set up chart base
   var svg = d3.select(arc_settings.target),
       margin = {top: 300, right: 30, bottom: 30, left: 300},
       width = +svg.attr("width") - margin.left - margin.right,
       height = +svg.attr("height") - margin.top - margin.bottom
   var bg = ar.make_chart_base(svg, arc_settings.title)
   var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 



   var z = d3.scaleOrdinal()
       .domain([0, 1, 2])
       .range(arc_settings.colors);


   var x = d3.scaleLinear()
     .domain([0, 1, 2])
     .range([160, 120, 80]);

  var legend = svg.append("g")
                  .attr("class", "legend")
                  .attr("transform","translate(0, 60)")

  legend.append("rect")
          .attr("width", '100%')
          .attr("height", 30)
          .attr("x", 0)
          .attr("fill", "#FBFBFB")
   d3.csv("radial_data.csv", function(d, i, columns) {
     var innerRad = x(i),
         outerRad = innerRad + 10
     return {data: d,innerRad: innerRad, outerRad: outerRad, columns: columns }
   }, function(error, data) {
     if (error) throw error;
     data.forEach(function(el, i) {
       var arc = d3.arc()
           .innerRadius(el.innerRad)
           .outerRadius(el.outerRad)
           .startAngle(arc_settings.start * (Math.PI/180)) //converting from degs to radians
           .endAngle(arc_settings.end * (Math.PI/180)) 
       var arcData = d3.arc()
             .innerRadius(el.innerRad)
             .outerRadius(el.outerRad)
             .startAngle(arc_settings.start * (Math.PI/180)) //converting from degs to radians
             .endAngle(ar.createArcFill(el.data[el.columns[1]], arc_settings) * (Math.PI/180))
       g.append("path")    
         .attr("d", arc) 
         .attr("fill", arc_settings.base_color)  
       g.append("path")    
         .attr("d", arcData) 
         .attr("fill", z(i))
      var legend_item = legend.append("g")
              .attr("class", "legend_item")        
      legend_item.append("circle")
                  .attr("r", 6)
                  .attr("fill", z(i))
      legend_item.append("text")
                    .attr("dx", 10)
                    .attr("dy", 5)
                    .attr("fill", "#4A4A4A")
                    .attr("font-size", "13px")
                    .attr("text-anchor", "start")
                    .text(el.data[el.columns[1]] + '%')
      legend_item.append("text")   
                    .attr("dx", 10)
                    .attr("dy", 20)
                    .attr("fill", "#4A4A4A")
                    .attr("font-size", "10px")
                    .text(el.data[el.columns[0]])
     })
     legend.selectAll("g")
         .attr("transform", function (d, i) {
              var lengend_width = legend.node().getBoundingClientRect().width
              var full = (lengend_width / data.length)
              var half = ((lengend_width / data.length)/2)
              var circle_width = d3.select(this).select("circle").node().getBoundingClientRect().width
              var text_width = d3.select(this).select("text").node().getComputedTextLength()
              var item_width = text_width + circle_width
              console.log(circle_width)
              return "translate(" + ((half + (full * i)) - (item_width / 2)) + ", 20)" 
     })
     
   });
}


// MAP


ar.map = function(map_settings) {
  var svg = d3.select(map_settings.target),
      // margin = {top: 200, right: 30, bottom: 30, left: 300},
      width = +svg.attr("width"),
      height = +svg.attr("height")
  var bg = ar.make_chart_base(svg, map_settings.title)        
  //Had to add projection to work in v4.0
  var projection = d3.geoMercator()
          .translate([width/2, (height + 140)/2])
          .scale([100]);

  // Define default path generator
  var path = d3.geoPath()
          .projection(projection);

  d3.json("world-reach-density.json", function(data){
    d3.json("world.json", function(json) {
      $.when(data.density.forEach(function(c) {
          json.features.forEach(function(val) {
            if(val.properties.name == c.name) {
              val.properties.value = c.density
            }
          })

      })).then(function(){
        var max_value = Math.max.apply(Math,json.features.map(function(o){return o.properties.value;}))
        var transform_value = d3.scaleLinear()
                                .domain([0,max_value])
                                .rangeRound([0,3])                             
        var value_color = d3.scaleOrdinal()                                  
                            .domain([0,3])
                            .range(map_settings.colors)
        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("id", function(d) {
                  return d.properties.name
                })
                .attr("fill", function(d){
                  return value_color(transform_value(d.properties.value))
                })
      })
    });
  })

}