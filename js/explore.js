
      // Global Variables
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      var margin = {top:0, right:100, bottom:0, left:100},
          width =  vw - margin.left - margin.right,
          height = 800 - margin.top - margin.bottom;
      var gold = "#fdb927",
          purple = "#552583";
      document.querySelector(".flex-container").style.width = width + "px";
      document.querySelector("#filters").style.width = width + "px";
      console.log("width is:" + document.querySelector(".flex-container").style.width);
      
      // Court Variables
      // full width of basketball court (ft)
      var scale = 15;
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
    
      var shot_legends = svg.append('g').attr('class', 'shot-legends').attr('transform', 'translate('+(width - courtWidth)/4+','+(visibleCourtLength - freeThrowLineLength+200)+')');
      shot_legends.append('circle').attr('cx',0).attr('cy',0).attr('r', 10).style('fill',gold);
      shot_legends.append('text').attr('x', 20).attr('y',7).text('Missed');
      shot_legends.append('circle').attr('cx',0).attr('cy',30).attr('r', 10).style('fill',purple);
      shot_legends.append('text').attr('x', 20).attr('y',37).text('Made');



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
      var chart2 = svg.append('g').attr('class', 'chart2').attr('transform', 'translate('+(width - chart_width)/4+','+((visibleCourtLength - threePointRadius)/2+200)+')');


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
      const shotPs = calshotPercentage(data);
      const madeShot = shotPs[0], 
            missedShot = shotPs[1], 
            totalShot = shotPs[2], 
            shotPercentage = shotPs[3];
      drawChart2(madeShot, missedShot, totalShot, shotPercentage);
           

      }//init function

      function updateFilter() {
        d3.select('#filters')
          .on('change', function() {
                let seasons = document.querySelector('#season-select');
                let selectedSeason = seasons.options[seasons.selectedIndex].value;
                let shotTypes = document.querySelector('#shot-type-select');
                let selectedShotType = shotTypes.options[shotTypes.selectedIndex].value;
                let shotRanges = document.querySelector('#shot-range-select');
                let selectedShotRange = shotRanges.options[shotRanges.selectedIndex].value;
                let shotAngles = document.querySelector('#shot-angle-select');
                let selectedShotAngle = shotAngles.options[shotAngles.selectedIndex].value;
                updatePlot(selectedSeason, selectedShotType, selectedShotRange, selectedShotAngle);
          });
        //drawPlot(filteredData);  
      }
      var c2xbar = d3.scaleBand()
                    .domain(["Missed","Made"])
                    .range([0, 100]);
        //.padding(0.1);

      var c2ybar = d3.scaleLinear()
                  .domain([0, 18000])
                  .range([180,0]);

      function drawChart2(madeShot, missedShot, totalShot, shotPercentage) {
        

        chart2
        .append('rect')
        .attr('class','chart2-missed')
        .attr('x',function(d){return (c2xbar("Missed"));})
        .attr('y', function(d) {return 180 - c2ybar(18000 - missedShot);})
        .attr('width',40)
        .attr('height',function(d) {return c2ybar(18000 - missedShot);})
        .style('fill', gold);/*
        .on("mouseover", function(d) {
          tooltip_bar.transition().duration(100).style("opacity", .9);
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (missedShot) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("mid", (d3.event.pageY - 25) + "px");
          d3.select(this).style('opacity', 0.5);
        })
        .on("mouseout", function(d) {
          tooltip_bar.style("opacity", 0);
          d3.select(this).style('opacity', 1);
        })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (missedShot) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("top", (d3.event.pageY - 25) + "px");});
        */  

        chart2
        .append('rect')
        .attr('class','chart2-made')
        .attr('x',function(d){return (c2xbar("Made"));})
        .attr('y', function(d) {return 180 - c2ybar(18000 - madeShot);})
        .attr('width',40)
        .attr('height',function(d) {return c2ybar(18000 - madeShot);})
        .style('fill', purple);/*
        .on("mouseover", function(d) {
          tooltip_bar.transition().duration(100).style("opacity", .9);
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (madeShot) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("mid", (d3.event.pageY - 25) + "px");
          d3.select(this).style('opacity', 0.5);
        })
        .on("mouseout", function(d) {
          tooltip_bar.style("opacity", 0);
          d3.select(this).style('opacity', 1);
        })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (madeShot) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("top", (d3.event.pageY - 25) + "px");});*/
        /*chart_g.selectAll('.shot-missed')
                .transition()
                .duration(3000)
                .attr('height',function(d) {return +d.Missed/25;})
                .attr('y', function(d) {return ybar((+d.Made)+(+d.Missed));});
        */

        // Create coordinates
        svg.append("g").attr("transform", "translate("+(width - chart_width)/4+","+((visibleCourtLength - threePointRadius)/2+200)+")").call(d3.axisLeft(c2ybar).tickValues([0, 5000, 10000, 15000, 18000]));
        svg.append("g").attr("transform", "translate("+(width - chart_width)/4+","+((visibleCourtLength - threePointRadius)/2+180+200)+")").call(d3.axisBottom(c2xbar));

        svg.append("text")
        .attr("class","fg-txt1")
        //.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((width - chart_width)/4) +","+((visibleCourtLength - threePointRadius)/2+20)+")")  // centre below axis
        .text("Kobe made "+madeShot);

        svg.append("text")
        .attr("class","fg-txt2")
        //.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((width - chart_width)/4) +","+((visibleCourtLength - threePointRadius)/2+40)+")")  // centre below axis
        .text("out of "+totalShot+" shots");

        svg.append("text")
        .attr("class","fg-txt3")
        //.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((width - chart_width)/4) +","+((visibleCourtLength - threePointRadius)/2+80)+")")  // centre below axis
        .style("font-size", "34px")
        .text(shotPercentage + "%");
      }

      function drawChart() {

        var data = [
          { year: "1996-97", Made: "197", Missed: "280"},
          { year: "1997-98", Made: "422", Missed: "567"},
          { year: "1998-99", Made: "423", Missed: "498"},
          { year: "1999-00", Made: "728", Missed: "849"},
          { year: "2000-01", Made: "869", Missed: "999"},
          { year: "2001-02", Made: "936", Missed: "1092"},
          { year: "2002-03", Made: "1005", Missed: "1236"},
          { year: "2003-04", Made: "706", Missed: "932"},
          { year: "2004-05", Made: "573", Missed: "751"},
          { year: "2005-06", Made: "1050", Missed: "1268"},
          { year: "2006-07", Made: "873", Missed: "1024"},
          { year: "2007-08", Made: "997", Missed: "1156"},
          { year: "2008-09", Made: "1042", Missed: "1200"},
          { year: "2009-10", Made: "950", Missed: "1130"},
          { year: "2010-11", Made: "823", Missed: "1002"},
          { year: "2011-12", Made: "706", Missed: "931"},
          { year: "2012-13", Made: "738", Missed: "857"},
          { year: "2013-14", Made: "31", Missed: "42"},
          { year: "2014-15", Made: "266", Missed: "447"},
          { year: "2015-16", Made: "398", Missed: "715"}
        ];
        
        var xbar = d3.scaleBand()
                  .domain(["1996-97","1997-98","1998-99","1999-00","2000-01","2001-02","2002-03","2003-04","2004-05", "2005-06", "2006-07","2007-08","2008-09","2009-10","2010-11","2011-12","2012-13","2013-14","2014-15","2015-16"])
	                .range([0, chart_width]);
                  //.padding(0.1);
        
        var ybar = d3.scaleLinear()
                    .domain([0, 2500])
                    .range([100,0]);
                    

        chart_g.selectAll('rect')
              .data(data)
              .enter()
              .append('rect')
              .attr('class','shot-missed')
              .attr('x',function(d){return (xbar(d.year) + 5);})
              .attr('y', function(d) {return ybar(100);})
              .attr('width',30)
              .attr('height',function(d) {return 0;})
              .style('fill', gold)
              .on("mouseover", function(d) {
                tooltip_bar.transition().duration(100).style("opacity", .9);
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 25;
                tooltip_bar.html("<p>" + (+d.Missed) + "</p>")
                            .style("left", (d3.event.pageX-15) + "px")             
                            .style("mid", (d3.event.pageY - 25) + "px");
                d3.select(this).style('opacity', 0.5);
              })
              .on("mouseout", function(d) {
                tooltip_bar.style("opacity", 0);
                d3.select(this).style('opacity', 1);
              })
              .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 25;
                tooltip_bar.html("<p>" + (+d.Missed) + "</p>")
                            .style("left", (d3.event.pageX-15) + "px")             
                            .style("top", (d3.event.pageY - 25) + "px");});
        chart_g.selectAll('.shot-missed')
               .transition()
               .duration(3000)
               .attr('height',function(d) {return +d.Missed/25;})
               .attr('y', function(d) {return ybar((+d.Made)+(+d.Missed));});

        for (let i = 0; i < 20; ++i) {
          //console.log(data[i].year);
          var rect_made = chart_g.append('rect')
          .attr('class','shot-made')
          .attr('x',(xbar(data[i].year)+5))
          .attr('y', ybar(100))
          .attr('width',30)
          .attr('height',0)
          .style('fill', purple)
          .on("mouseover", function(d) {
            tooltip_bar.transition().duration(100).style("opacity", .9);
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip_bar.html("<p>" + (+data[i].Made) + "</p>")
                        .style("left", (d3.event.pageX-15) + "px")             
                        .style("mid", (d3.event.pageY - 25) + "px");
            d3.select(this).style('opacity', 0.5);
          })
          .on("mouseout", function(d) {
            tooltip_bar.style("opacity", 0);
            d3.select(this).style('opacity', 1);
          })
          .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip_bar.html("<p>" + (+data[i].Made) + "</p>")
                        .style("left", (d3.event.pageX-15) + "px")             
                        .style("top", (d3.event.pageY - 25) + "px");});

          rect_made.transition()
          .duration(3000)
          .attr('height',+data[i].Made/25)
          .attr('y', ybar(+data[i].Made));
        }

    
        // Create coordinates
        svg.append("g").attr("transform", "translate("+(width - chart_width)/2+","+(visibleCourtLength+50)+")").call(d3.axisLeft(ybar).tickValues([0, 500, 1000, 1500, 2000, 2500]));
        svg.append("g").attr("transform", "translate("+(width - chart_width)/2+","+(visibleCourtLength+150)+")").call(d3.axisBottom(xbar));
          

      }  
    
            
      function drawPlot(data) {
        //shotPercentage(data);
        var locations = d3.select("body")
            .select("svg")
            .append("g")
                .attr("transform", "translate("+(width)/2+","+0+")")
            .selectAll("circle")
            .data(data);  
        
        // if filtered dataset has more circles than already existing, transition new ones in
        locations//.data(data)
            .enter()
            .append("circle")
            .attr('class', 'shot-circles')
            .attr("cx", function(d) {return shotX(d.LOC_X);})
            .attr("cy", function(d) {return shotY(d.LOC_Y);})
            .style("fill", function(d) { 
            if (d.SHOT_MADE_FLAG == "0") {return gold;} else {return purple;}
          })
          .style('opacity', 0.5)
          .attr("r", 1.8)
          .on("mouseover", function(d) {
            tooltip_circle.transition().duration(100).style("opacity", .9);
            tooltip_circle.html("<p>" + d.GAME_DATE.slice(0,4) + "-" + d.GAME_DATE.slice(4,6) + "-" + d.GAME_DATE.slice(6,8) + " vs. " + d.OPPONENT + 
                        "<br> Distance: " + d.SHOT_DISTANCE + " feet <br>" + d.ACTION_TYPE + "</p>")
                    .style("left", (d3.event.pageX+10) + "px")             
                    .style("top", (d3.event.pageY - 28) + "px");
            d3.select(this).style('opacity', 0.9);
          })
          .on("mouseout", function(d) {
            tooltip_circle.style("opacity", 0);
            d3.select(this).style('opacity', 0.5);
          });
        
        // if filtered dataset has less circles than already existing, remove excess
        locations//.data(data)
        .exit()
          .remove();

      }

      function updatePlot(selectedSeason, selectedShotType, selectedShotRange, selectedShotAngle) {    
        //filteredData.forEach(function(d) {
        //    console.log(d.id);
        //  });
        var locations = d3.select("body")
          .select("svg")
          .selectAll("circle.shot-circles")
          .attr("display", "none");

          var locations = d3.select("body")
          .select("svg")
          .selectAll("circle.shot-circles")
          .filter(function(d) { return  (selectedShotType== "" || d.SHOT_TYPE==selectedShotType) && 
                                         (selectedShotRange== "" || d.SHOT_ZONE_RANGE==selectedShotRange) && 
                                         (selectedSeason== "" || d.SEASON==selectedSeason) &&
                                         (selectedShotAngle== "" || d.SHOT_ZONE_AREA==selectedShotAngle);  })
          .attr("display", "true");
        //   .filter(function(d) { return  (selectedShotType!= "" && d.SHOT_TYPE!=selectedShotType) || 
        //                                 (selectedShotRange!= "" && d.SHOT_ZONE_RANGE!=selectedShotRange) || 
        //                                 (selectedSeason!= "" && d.SEASON!=selectedSeason) || 
        //                                 (selectedShotAngle!= "" && d.SHOT_ZONE_AREA!=selectedShotAngle);  })
        //
        var filteredData = data.filter(function(d) { return  (selectedShotType== "" || d.SHOT_TYPE==selectedShotType) && 
                                         (selectedShotRange== "" || d.SHOT_ZONE_RANGE==selectedShotRange) && 
                                         (selectedSeason== "" || d.SEASON==selectedSeason) &&
                                         (selectedShotAngle== "" || d.SHOT_ZONE_AREA==selectedShotAngle);  });
           
        const shotPs = calshotPercentage(filteredData);
        const madeShot = shotPs[0], 
              missedShot = shotPs[1], 
              totalShot = shotPs[2], 
              shotPercentage = shotPs[3];
        

        chart2.selectAll('.chart2-made')
                .transition()
                .duration(2000)
                .attr('height',function(d) {return c2ybar(18000 - madeShot);})
                .attr('y', function(d) {return 180 - c2ybar(18000 - madeShot);});

        
        chart2.selectAll('.chart2-missed')
                .transition()
                .duration(2000)
                .attr('height',function(d) {return c2ybar(18000 - missedShot);})
                .attr('y', function(d) {return 180 - c2ybar(18000 - missedShot);});
        
        svg.selectAll(".fg-txt1")
                //.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                //.attr("transform", "translate("+ ((width - chart_width)/4) +","+((visibleCourtLength - threePointRadius)/2)+")")  // centre below axis
                .text("Kobe made "+madeShot);
        
        svg.selectAll(".fg-txt2")
                //.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                //.attr("transform", "translate("+ ((width - chart_width)/4) +","+((visibleCourtLength - threePointRadius)/2+20)+")")  // centre below axis
                .text("out of "+totalShot+" shots");

        svg.selectAll(".fg-txt3")
                //.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                //.attr("transform", "translate("+ ((width - chart_width)/4) +","+((visibleCourtLength - threePointRadius)/2+60)+")")  // centre below axis
                .style("font-size", "34px")
                .text(shotPercentage + "%");
      }

      function calshotPercentage(data) {
        let totalShot, shotPercentage;
        let madeShot = 0;
        let missedShot = 0;
        data.forEach(function(d) {
            //d.SHOT_MADE_FLAG = +d.SHOT_MADE_FLAG;
            if (d.SHOT_MADE_FLAG == "0") {
                missedShot += 1;
            } else {
                madeShot += 1;
            }            //d.GAME_DATE2 = parseDate(d.GAME_DATE);
            //console.log("game date is: "+d.GAME_DATE2);
          });
        totalShot =  missedShot+madeShot;
        shotPercentage = ((madeShot/totalShot)*100).toFixed(1);
        console.log("total shot: " + totalShot);
        // console.log("made shot: " + madeShot);
        // console.log("FG %: " + shotPercentage);

        // console.log("y3 is: " + missedShot);

        return [madeShot, missedShot, totalShot, shotPercentage];

      }

      updateFilter();
    

    
    
    
