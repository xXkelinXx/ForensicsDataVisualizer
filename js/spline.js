var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;


//Sets scales
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

//Creates x axis based on scale
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


//Change "scatterplot.xml" to the XML file you want to parse
d3.xml("sample data/spline.xml", function(error, data) {
    if (error) throw error;
    data = [].map.call(data.querySelectorAll("suspect"), function(suspect) {
        return {
            suspect: suspect.getAttribute("id"),
            ageProbability: +suspect.querySelector("ageProbability").textContent,
        }

    });



    var splineSVG = d3.select("#spline").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "outline: solid black;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    //Set domains
    x.domain([0, 100]).nice();
    y.domain([0, 100]).nice();

    //add x axis
    splineSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        //x axis label
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Age (years)");

    splineSVG.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        //x axis label
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Probability (%)");


      splineSVG.append("path")
          .data(data)
          .attr('d', d3.svg.line().interpolate('cardinal'))
          .attr("class", "line")
          .style("stroke", function(d) { return color(d.suspect);})
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .each(function() {
              var sel = d3.select(this);
              var state = false;
              sel.on('click', function() {
                  state = !state;
                  if (state) {
                      sel.style('stroke', 'gray');
                  } else {
                      sel.style("stroke", function(d) { return color(d.suspect);});
                  }
              });
            });

});
