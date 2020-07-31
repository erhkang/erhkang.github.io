
      // Global Variables
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      var margin = {top:0, right:30, bottom:0, left:30},
          width =  vw - margin.left - margin.right,
          height = 1600 - margin.top - margin.bottom;
      var gold = "#fdb927",
          purple = "#552583";

      document.querySelector(".p-wrapper").style.width = width + "px";
      console.log("aa is " + document.querySelector(".p-wrapper").style.width);


      
      
      // Court Variables
      // full width of basketball court (ft)
      var scale = 25;
      var courtWidth = 50 * scale,                            // full width of basketball court (ft)
          courtLength = 94 * scale,                            // full length of basketball court (ft)
          visibleCourtLength = courtLength / 2,
          keyWidth = 16 * scale,                              // width the key (paint) (ft)
          threePointRadius = 23.75 * scale,                   // distance of three point line from basket (ft)
          threePointSideRadius = 22 * scale,                  // distance of corner three point line from basket (ft)
          threePointCutoffLength = 14 * scale,                // distance from baseline where three point line because circular (ft)
          freeThrowLineLength = 19 * scale,                   // distance from baseline to free throw line (ft)
          freeThrowCircleRadius = 6 * scale,                  // radius of free throw line circle (ft)
          basketProtrusionLength = 4 * scale,                 // distance from baseline to backboard (ft)
          basketDiameter = 1.5 * scale,                       // basketball hoop diameter (ft) 
          basketWidth = 6 * scale,                            // backboard width (ft)
          restrictedCircleRadius = 4 * scale,                 // radius of restricted circle (ft)   
          keyMarkWidth = .5 * scale;                          // width of key marks (dashes on side of the paint) (ft)
      var chart_width = courtWidth + 100;
      var bar_width = 30;
      
      // helper to create an arc path
      function appendArcPath (base, radius, startAngle, endAngle) {
        var points = 30;

        var angle = d3.scaleLinear()
            .domain([0, points - 1])
            .range([startAngle, endAngle]);

        /*var line = d3.svg.line.radial()
            .interpolate("basis")
            .tension(0)
            .radius(radius)
            .angle(function(d, i) { return angle(i); });
        */
       var line = d3.radialLine()
            .radius(radius)
            .angle(function(d, i) { return angle(i); });
        
        return base.append("path").datum(d3.range(points))
            .attr("d", line);
      }    
      
      // Define svg
      var svg = d3.select(document.getElementById('chart')).select('svg');
      svg.attr('width', width)
         .attr('height', height)
         //.attr('viewBox', "0 0 " + courtWidth + " " + visibleCourtLength)
         .style("background-color", "white");
      
      // Create Shots Legends
    
      var shot_legends = svg.append('g').attr('class', 'shot-legends').attr('transform', 'translate('+(width - courtWidth)/4+','+(visibleCourtLength - freeThrowLineLength)+')');
      shot_legends.append('circle').attr('cx',0).attr('cy',0).attr('r', 20).style('fill',gold);
      shot_legends.append('text').attr('x', 30).attr('y',10).text('Missed');
      shot_legends.append('circle').attr('cx',0).attr('cy',60).attr('r', 20).style('fill',purple);
      shot_legends.append('text').attr('x', 30).attr('y',67).text('Made');



      // Draw Court
      var court_g = svg.append('g').attr('class', 'shot-chart-court').attr('transform', 'translate('+(width - courtWidth)/2+','+0+')');   //(height - visibleCourtLength)/2
      court_g.append("rect")
              .attr('class', 'shot-chart-court-key')
              .attr("x", (courtWidth / 2 - keyWidth / 2))
              .attr("y", (visibleCourtLength - freeThrowLineLength))
              .attr("width", keyWidth)
              .attr("height", freeThrowLineLength)
              .style("stroke-width", 1);

      court_g.append("line")
              .attr('class', 'shot-chart-court-baseline')
              .attr("x1", 0)
              .attr("y1", visibleCourtLength)
              .attr("x2", courtWidth)
              .attr("y2", visibleCourtLength)
              .style("stroke-width", 1);
                  
      var tpAngle = Math.atan(threePointSideRadius / 
        (threePointCutoffLength - basketProtrusionLength - basketDiameter/2));
        
      appendArcPath(court_g, threePointRadius, -1 * tpAngle, tpAngle)
        .style("stroke-width", 1)
        .attr('class', 'shot-chart-court-3pt-line')
        .attr("transform", "translate(" + (courtWidth / 2) + ", " + 
          (visibleCourtLength - basketProtrusionLength - basketDiameter / 2) + 
          ")");
         
      [1, -1].forEach(function (n) {
        court_g.append("line")
          .attr('class', 'shot-chart-court-3pt-line')
          .style("stroke-width", 1)
          .attr("x1", courtWidth / 2 + threePointSideRadius * n)
          .attr("y1", visibleCourtLength - threePointCutoffLength)
          .attr("x2", courtWidth / 2 + threePointSideRadius * n)
          .attr("y2", visibleCourtLength);
      });
        
      appendArcPath(court_g, restrictedCircleRadius, -1 * Math.PI/2, Math.PI/2)
        .style("stroke-width", 1)
        .attr('class', 'shot-chart-court-restricted-area')
        .attr("transform", "translate(" + (courtWidth / 2) + ", " + 
          (visibleCourtLength - basketProtrusionLength - basketDiameter / 2) + ")");
                                                         
      appendArcPath(court_g, freeThrowCircleRadius, -1 * Math.PI/2, Math.PI/2)
        .style("stroke-width", 1)
        .attr('class', 'shot-chart-court-ft-circle-top')
        .attr("transform", "translate(" + (courtWidth / 2) + ", " + 
          (visibleCourtLength - freeThrowLineLength) + ")");
                                                          
      appendArcPath(court_g, freeThrowCircleRadius, Math.PI/2, 1.5 * Math.PI)
        .style("stroke-width", 1)
        .attr('class', 'shot-chart-court-ft-circle-bottom')
        .attr("transform", "translate(" + (courtWidth / 2) + ", " + 
          (visibleCourtLength - freeThrowLineLength) + ")");

      [7 * scale, 8* scale, 11* scale, 14* scale].forEach(function (mark) {
        [1, -1].forEach(function (n) {
          court_g.append("line")
            .style("stroke-width", 1)
            .attr('class', 'shot-chart-court-key-mark')
            .attr("x1", courtWidth / 2 + keyWidth / 2 * n + keyMarkWidth * n)
            .attr("y1", visibleCourtLength - mark)
            .attr("x2", courtWidth / 2 + keyWidth / 2 * n)
            .attr("y2", visibleCourtLength - mark);
        });
      });    

      court_g.append("line")
        .style("stroke-width", 3)
        .attr('class', 'shot-chart-court-backboard')
        .attr("x1", courtWidth / 2 - basketWidth / 2)
        .attr("y1", visibleCourtLength - basketProtrusionLength)
        .attr("x2", courtWidth / 2 + basketWidth / 2)
        .attr("y2", visibleCourtLength - basketProtrusionLength);
                                     
        court_g.append("circle")
        .style("stroke-width", 3)
        .attr('class', 'shot-chart-court-hoop')
        .attr("cx", courtWidth / 2)
        .attr("cy", visibleCourtLength - basketProtrusionLength - basketDiameter / 2)
        .attr("r", basketDiameter / 2);


      // Set up tooltip
      var tooltip_circle = d3.select('body')
                      .append('div')
                      .attr('class', 'tooltip_circle')
                      .style('opacity', 0);
      var tooltip_bar = d3.select('body')
                      .append('div')
                      .attr('class', 'tooltip_bar')
                      .style('opacity', 0);
      

      // Stacked Chart
      var chart_g = svg.append('g').attr('class', 'stacked-chart').attr('transform', 'translate('+(width - chart_width)/2+','+(visibleCourtLength+50)+')');


      //Load Data
      //var data = [{"LOC_X":"100","LOC_Y":"100"},{"LOC_X":"-100","LOC_Y":"100"}];
      var data;
      var shotX = d3.scaleLinear().domain([-250, 250]).range([-25 * scale, 25 * scale]);
      var shotY = d3.scaleLinear().domain([-47.5, 422.5]).range([visibleCourtLength, 0]);


      async function init() {
      data = await d3.csv('../kobe_all_shots_reg_and_playoffs_oppo.csv');
      //console.log(data);
      data.forEach(function(d) {
        d.LOC_X = 0-(+d.LOC_X);
        d.LOC_Y = +d.LOC_Y;
        //d.GAME_DATE2 = parseDate(d.GAME_DATE);
        //console.log("game date is: "+d.GAME_DATE2);
      });
      drawPlot(data);
      drawTimeline();
      //drawChart();

      }//init function

        
    

      function drawPlot(data) {
        var locations = d3.select("body")
                        .select("svg")
                        .append("g")
                            .attr("transform", "translate("+(width)/2+","+0+")")
                        .selectAll("circle")
                        .data(data);
      
        // if filtered dataset has more circles than already existing, transition new ones in
        locations.enter()
            .append("circle")
            .attr('class', 'shot-circles')
            .attr("cx", function(d) {return shotX(d.LOC_X);})
            .attr("cy", function(d) {return shotY(d.LOC_Y);})
            .style("fill", function(d) { 
            if (d.SHOT_MADE_FLAG == "0") {return gold;} else {return purple;}
          })
          .style('opacity', 1)
          .style("display", "true")
          .attr("r", 2.2);
      
        // if filtered dataset has less circles than already existing, remove excess
        //locations.exit()
        //  .remove();
        
        
      }
      // Set up Timeline
      // Set up Slider
      var formatDateIntoYear = d3.timeFormat("%Y");
      var formatDate = d3.timeFormat("%b %Y");
      var parseDate = d3.timeParse("%Y%m%d");
      var startDate = new Date("1996-01-01");
      var endDate = new Date("2016-12-31");

      var debutDate = new Date("1996-11-06");
      var twelve3pointersDate = new Date("2003-01-07");
      var eightyoneDate = new Date("2006-01-22");
      var sunsDate = new Date("2006-04-30");
      var achillesDate = new Date("2013-04-12");
      var finaleDate = new Date("2016-04-13");


            
      function drawTimeline () {
      var timescale = d3.scaleTime()
            .domain([startDate, endDate])
            .range([0, chart_width])
            .clamp(true);

      svg.append("g").attr("transform", "translate("+(width - chart_width)/2+","+(visibleCourtLength+100)+")").call(d3.axisBottom(timescale));
      .style("font-size", "18px")
      svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+(width)/2+","+(visibleCourtLength+140)+")")  // centre below axis
        .style("font-size", "20px").style("font-weight", "bold")
        .text("Year");


      var events_legends = svg.append('g').attr('transform', 'translate('+((width - courtWidth)/4+30)+','+(1600)+')');
      
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "text-debut events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .text("1996-11-06 vs. CHA");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "text-debut events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(20)+')')
                    .text("Distance: 23 feet");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "text-debut events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(40)+')')
                    .text("Jump Shot");

      /////////////////////////////////////////////
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "three-pointer events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .text("2003-01-07 vs. SEA");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "three-pointer events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(20)+')')
                    .text("Distance: 25 feet");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "three-pointer events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(40)+')')
                    .text("Jump Shot");

      /////////////////////////////////////////////
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "eightyone events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .text("2006-01-22 vs. TOR");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "eightyone events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(20)+')')
                    .text("Distance: 4 feet");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "eightyone events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(40)+')')
                    .text("Running Jump Shot");
      /////////////////////////////////////////////
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "suns events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .text("2006-04-30 vs. PHX");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "suns events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(20)+')')
                    .text("Distance: 17 feet");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "suns events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(40)+')')
                    .text("Jump Shot");
      /////////////////////////////////////////////
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "achilles events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .text("2013-04-12 vs. GSW");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "achilles events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(20)+')')
                    .text("Distance: 14 feet");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "achilles events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(40)+')')
                    .text("Free Throw");
      /////////////////////////////////////////////
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "finale events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .text("2016-04-13 vs. UTA");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "finale events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(20)+')')
                    .text("Distance: 19 feet");
      events_legends.append("text")
                    .attr("display", "none")
                    .attr("class", "finale events-legends")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr('transform', 'translate('+0+','+(40)+')')
                    .text("Pullup Jump Shot");

      var circle_legends = d3.select("body")
                    .select("svg")
                    .append("g")
                    .attr("transform", "translate("+(width)/2+","+0+")");
      
      circle_legends.append("line")
                    .attr("display", "none")
                    .attr("class", "text-debut circle_legends")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("x1", shotX(142))
                    .attr("y1", shotY(181))
                    .attr("x2", -courtWidth/2-70)
                    .attr("y2", (visibleCourtLength-basketProtrusionLength-70));
      circle_legends.append("circle")
                    .attr("display", "true")
                    .attr("class", "text-debut circle_legends")
                    .attr("opacity", 0)
                    .attr("cx", shotX(142))
                    .attr("cy", shotY(181))
                    .attr("r", 10)
                    .style("fill", purple);

      circle_legends.append("line")
                    .attr("display", "none")
                    .attr("class", "three-pointer circle_legends")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("x1", shotX(-113))
                    .attr("y1", shotY(224))
                    .attr("x2", -courtWidth/2-70)
                    .attr("y2", (visibleCourtLength-basketProtrusionLength-70));
      circle_legends.append("circle")
                    .attr("display", "true")
                    .attr("class", "three-pointer circle_legends")
                    .attr("opacity", 0)
                    .attr("cx", shotX(-113))
                    .attr("cy", shotY(224))
                    .attr("r", 10)
                    .style("fill", purple);
      
      circle_legends.append("line")
                    .attr("display", "none")
                    .attr("class", "eightyone circle_legends")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("x1", shotX(-23))
                    .attr("y1", shotY(40))
                    .attr("x2", -courtWidth/2-70)
                    .attr("y2", (visibleCourtLength-basketProtrusionLength-70));
      circle_legends.append("circle")
                    .attr("display", "true")
                    .attr("class", "eightyone circle_legends")
                    .attr("opacity", 0)
                    .attr("cx", shotX(-23))
                    .attr("cy", shotY(40))
                    .attr("r", 10)
                    .style("fill", purple);



      circle_legends.append("line")
                    .attr("display", "none")
                    .attr("class", "suns circle_legends")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("x1", shotX(-100))
                    .attr("y1", shotY(143))
                    .attr("x2", -courtWidth/2-70)
                    .attr("y2", (visibleCourtLength-basketProtrusionLength-70));

      circle_legends.append("circle")
                    .attr("display", "true")
                    .attr("class", "suns circle_legends")
                    .attr("opacity", 0)
                    .attr("cx", shotX(-100))
                    .attr("cy", shotY(143))
                    .attr("r", 10)
                    .style("fill", purple);

      circle_legends.append("line")
                    .attr("display", "none")
                    .attr("class", "achilles circle_legends")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("x1", 0)
                    .attr("y1", visibleCourtLength-freeThrowLineLength)
                    .attr("x2", -courtWidth/2-70)
                    .attr("y2", (visibleCourtLength-basketProtrusionLength-70));

      circle_legends.append("circle")
                    .attr("display", "true")
                    .attr("class", "achilles circle_legends")
                    .attr("opacity", 0)
                    .attr("cx", 0)
                    .attr("cy", visibleCourtLength-freeThrowLineLength)
                    .attr("r", 10)
                    .style("fill", purple);
      
      circle_legends.append("line")
                    .attr("display", "none")
                    .attr("class", "finale circle_legends")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("x1", shotX(-58))
                    .attr("y1", shotY(188))
                    .attr("x2", -courtWidth/2-70)
                    .attr("y2", (visibleCourtLength-basketProtrusionLength-70));

      circle_legends.append("circle")
                    .attr("display", "true")
                    .attr("class", "finale circle_legends")
                    .attr("opacity", 0)
                    .attr("cx", shotX(-58))
                    .attr("cy", shotY(188))
                    .attr("r", 10)
                    .style("fill", purple);

      var imgs = svg.append("g").attr("transform", "translate("+(width - chart_width)/2+","+(visibleCourtLength+20)+")").selectAll("image").data([0]);
          imgs.enter()
              .append("svg:image")
              .attr("xlink:href", "../pics/jersey8.png")
              .attr("x", timescale(debutDate)-35)
              .attr("y", "0")
              .attr("width", "90")
              .attr("height", "90")
              .on("click", function(d) {
                const thisElement = d3.select(this);
                let currenty = thisElement.attr("y");
                console.log("this is " + thisElement.attr("y"));
                resetImages();

                if (currenty == 0) {
                  //Not selected yet
                  thisElement.attr("y", "-20");
                  document.querySelector("#top-description")
                          .innerHTML = "This is Kobe's first Shot.";
                  d3.selectAll(".text-debut").attr("display", "true");
                  d3.select("circle.text-debut")
                    .transition().duration(1500).style("opacity", 1);
                  d3.selectAll("circle.shot-circles")
                    .style("opacity", 0.2);
                } else {
                  thisElement.attr("y", "0");
                  document.querySelector("#top-description")
                          .innerHTML = "Click on Kobe's jersey to see some exciting moments in Kobe's career!";
                  d3.selectAll(".text-debut").attr("display", "none");
                  //d3.select("circle.text-debut")
                  //  .transition().duration(1500).style("opacity", 0);
                  displayShots();
                }
            })
            .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer"); })
            .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); });

          imgs.enter()
              .append("svg:image")
              .attr("xlink:href", "../pics/jersey8.png")
              .attr("x", timescale(twelve3pointersDate)-35)
              .attr("y", "0")
              .attr("width", "70")
              .attr("height", "70")
              .on("click", function(d) {
                const thisElement = d3.select(this);
                let currenty = thisElement.attr("y");
                console.log("this is " + thisElement.attr("y"));
                resetImages();

                if (currenty == 0) {
                  //Not selected yet
                  thisElement.attr("y", "-20");
                  document.querySelector("#top-description")
                          .innerHTML = "Kobe made 12 3-pointers.";
                  d3.selectAll(".three-pointer").attr("display", "true");
                  d3.select("circle.three-pointer")
                    .transition().duration(1500).style("opacity", 1);
                  d3.selectAll("circle.shot-circles")
                    .style("opacity", 0.2);
                } else {
                  thisElement.attr("y", "0");
                  document.querySelector("#top-description")
                          .innerHTML = "Click on Kobe's jersey to see some exciting moments in Kobe's career!";
                  d3.selectAll(".three-pointer").attr("display", "none");
                  //d3.select("circle.three-pointer")
                  //  .transition().duration(1500).style("opacity", 0);
                  displayShots();
                }
              })
              .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer"); })
              .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); });
          
          imgs.enter()
              .append("svg:image")
              .attr("xlink:href", "../pics/jersey8.png")
              .attr("x", timescale(eightyoneDate)-35)
              .attr("y", "0")
              .attr("width", "70")
              .attr("height", "70")
              .on("click", function(d) {
                const thisElement = d3.select(this);
                let currenty = thisElement.attr("y");
                console.log("this is " + thisElement.attr("y"));
                resetImages();

                if (currenty == 0) {
                  //Not selected yet
                  thisElement.attr("y", "-20");
                  document.querySelector("#top-description")
                          .innerHTML = "Kobe scored 81 points.";
                  d3.selectAll(".eightyone").attr("display", "true");
                  d3.select("circle.eightyone")
                    .transition().duration(1500).style("opacity", 1);
                  d3.selectAll("circle.shot-circles")
                    .style("opacity", 0.2);
                } else {
                  thisElement.attr("y", "0");
                  document.querySelector("#top-description")
                          .innerHTML = "Click on Kobe's jersey to see some exciting moments in Kobe's career!";
                  d3.selectAll(".eightyone").attr("display", "none");
                  //d3.select("circle.eightyone")
                  //  .transition().duration(1500).style("opacity", 0);
                  displayShots();
                }
              })
              .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer"); })
              .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); });

          imgs.enter()
              .append("svg:image")
              .attr("xlink:href", "../pics/jersey8.png")
              .attr("x", timescale(sunsDate)-5)
              .attr("y", "0")
              .attr("width", "70")
              .attr("height", "70")
              .on("click", function(d) {
                const thisElement = d3.select(this);
                let currenty = thisElement.attr("y");
                console.log("this is " + thisElement.attr("y"));
                resetImages();

                if (currenty == 0) {
                  //Not selected yet
                  thisElement.attr("y", "-20");
                  document.querySelector("#top-description")
                          .innerHTML = "Kobe beat Suns.";
                  d3.selectAll(".suns").attr("display", "true");
                  d3.select("circle.suns")
                    .transition().duration(1500).style("opacity", 1);
                  d3.selectAll("circle.shot-circles")
                    .style("opacity", 0.2);
                } else {
                  thisElement.attr("y", "0");
                  document.querySelector("#top-description")
                          .innerHTML = "Click on Kobe's jersey to see some exciting moments in Kobe's career!";
                  d3.selectAll(".suns").attr("display", "none");
                  //d3.select("circle.suns")
                  //  .transition().duration(1500).style("opacity", 0);
                  displayShots();
                }
              })
              .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer"); })
              .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); });

          imgs.enter()
              .append("svg:image")
              .attr("xlink:href", "../pics/jersey24.png")
              .attr("x", timescale(achillesDate)-35)
              .attr("y", "0")
              .attr("width", "70")
              .attr("height", "70")
              .on("click", function(d) {
                const thisElement = d3.select(this);
                let currenty = thisElement.attr("y");
                console.log("this is " + thisElement.attr("y"));
                resetImages();

                if (currenty == 0) {
                  //Not selected yet
                  thisElement.attr("y", "-20");
                  document.querySelector("#top-description")
                          .innerHTML = "Kobe hurts.";
                  d3.selectAll(".achilles").attr("display", "true");
                  d3.select("circle.achilles")
                    .transition().duration(1500).style("opacity", 1);
                  d3.selectAll("circle.shot-circles")
                    .style("opacity", 0.2);
                } else {
                  thisElement.attr("y", "0");
                  document.querySelector("#top-description")
                          .innerHTML = "Click on Kobe's jersey to see some exciting moments in Kobe's career!";
                  d3.selectAll(".achilles").attr("display", "none");
                  //d3.select("circle.achilles")
                  //  .transition().duration(1500).style("opacity", 0);
                  displayShots();
                }
              })
              .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer"); })
              .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); });
          
          imgs.enter()
              .append("svg:image")
              .attr("xlink:href", "../pics/jersey24.png")
              .attr("x", timescale(finaleDate)-35)
              .attr("y", "0")
              .attr("width", "70")
              .attr("height", "70")
              .on("click", function(d) {
                const thisElement = d3.select(this);
                let currenty = thisElement.attr("y");
                console.log("this is " + thisElement.attr("y"));
                resetImages();

                if (currenty == 0) {
                  //Not selected yet
                  thisElement.attr("y", "-20");
                  document.querySelector("#top-description")
                          .innerHTML = "This is Kobe's last Shot.";
                  d3.selectAll(".finale").attr("display", "true");
                  d3.select("circle.finale")
                    .transition().duration(1500).style("opacity", 1);
                  d3.selectAll("circle.shot-circles")
                    .style("opacity", 0.2);
                } else {
                  thisElement.attr("y", "0");
                  document.querySelector("#top-description")
                          .innerHTML = "Click on Kobe's jersey to see some exciting moments in Kobe's career!";
                  d3.selectAll(".finale").attr("display", "none");
                  //d3.select("circle.finale")
                  //  .transition().duration(1500).style("opacity", 0);
                  displayShots();
                }
              })
              .on("mouseover", function(d) {
                d3.select(this).style("cursor", "pointer"); })
              .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default"); });
      

      }

      function resetImages() {
        d3.selectAll("image")
          .attr("y", "0");

        d3.selectAll("text.events-legends")
          .attr("display", "none");

        d3.selectAll("line.circle_legends")
          .attr("display", "none");

        d3.selectAll("circle.circle_legends")
          .attr("display", "none")
          .style("opacity", 0);
        
        //d3.selectAll("circle.shot-circles")
        //  .attr("display", "none");
      }

      function displayShots() {
        d3.selectAll("circle.shot-circles")
           .attr("display", "true")
           .style("opacity", 1);
      }
     

 

      // Annotations
 
