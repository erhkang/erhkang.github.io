//background-image: linear-gradient(to bottom, #383838, white);
      // Global Variables
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      var margin = {top:0, right:100, bottom:0, left:100},
          width =  vw - margin.left - margin.right,
          height = 1600 - margin.top - margin.bottom;
      var gold = "#fdb927",
          purple = "#552583";

      document.querySelector(".p-wrapper").style.width = width + "px";
      
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
      shot_legends.append('text').attr('x', 30).attr('y',47).text('Missed');
      shot_legends.append('circle').attr('cx',0).attr('cy',80).attr('r', 20).style('fill',purple);
      shot_legends.append('text').attr('x', 30).attr('y',87).text('Made');



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
      drawChart();
      draw_fg();
      //drawPie();
      anno_three_peat();
      anno_mvp();
      anno_injury();

      }//init function

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
        //Create Legends
        chart_g.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (-50) +","+(100/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Field Goal Attempted");

        chart_g.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (60) +","+(140)+")")  // centre below axis
        .text("Season");
                    

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
               .duration(2500)
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
          .duration(2500)
          .attr('height',+data[i].Made/25)
          .attr('y', ybar(+data[i].Made));
        }

    
        // Create coordinates
        svg.append("g").attr("transform", "translate("+(width - chart_width)/2+","+(visibleCourtLength+50)+")").call(d3.axisLeft(ybar).tickValues([0, 500, 1000, 1500, 2000, 2500]));
        svg.append("g").attr("transform", "translate("+(width - chart_width)/2+","+(visibleCourtLength+150)+")").call(d3.axisBottom(xbar));
          

      }  
    

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
        //locations.exit()
        //  .remove();
        
        
      }

      var svg_fg = d3.select("#fg_list")
                  .select("svg")
                    .attr("width", width)
                    .attr("height", 400);
      // For Field Goal              
      var fg_g =svg_fg.append("g")
                    .attr("class", "fg_g")
                    .attr("transform", "translate(" + 180 + "," + 50 + ")");
      //For Points              
      var fg_g2 =svg_fg.append("g")
                    .attr("class", "fg_g2")
                    .attr("transform", "translate(" + (width/2+180) + "," + 50 + ")");
      var range_data = {"Less than 8 ft": 9398, "8-16 ft": 6626, "16-24 ft": 8315, "24+ ft": 6358};
      //var FG_data = {Kareem Abdul-Jabbar: 28307, Karl Malone: 26210, Kobe Bryant: 26200, Lebron James: 24654, Michael Jordan: 24537};

      var FG_data = [
        { Name: "Kareem Abdul-Jabbar", Shot: 28307},
        { Name: "Karl Malone", Shot: 26210},
        { Name: "Kobe Bryant", Shot: 26200},
        { Name: "Lebron James", Shot: 24654},
        { Name: "Michael Jordan", Shot: 24537}];

      var PT_data = [
        { Name: "Kareem Abdul-Jabbar", Point: 38387},
        { Name: "Karl Malone", Point: 36928},
        { Name: "Lebron James", Point: 34087},
        { Name: "Kobe Bryant", Point: 33643},
        { Name: "Michael Jordan", Point: 32292}];

      function draw_fg() {
        var chart_width = width*(3/10);
        var chart_height = 200;
        var chart_padding = 100;
        var ybar = d3.scaleBand()
                  .domain(["Kareem Abdul-Jabbar","Karl Malone","Kobe Bryant","Lebron James","Michael Jordan"])
	                .range([0, chart_height]);
                  //.padding(0.1);
        
        var xbar = d3.scaleLinear()
                    .domain([0, 30000])
                    .range([0,chart_width]);
        
          var ybar2 = d3.scaleBand()
          .domain(["Kareem Abdul-Jabbar","Karl Malone","Lebron James","Kobe Bryant","Michael Jordan"])
          .range([0, chart_height]);
          //.padding(0.1);
          
          var xbar2 = d3.scaleLinear()
                      .domain([0, 40000])
                      .range([0,chart_width]);


        fg_g.selectAll('rect')
        .data(FG_data)
        .enter()
        .append('rect')
        .attr('class','fg-attemp')
        .attr('x',0)
        .attr('y', function(d) {return ybar(d.Name)+10;})
        .attr('width',function(d){return xbar(d.Shot);})
        .attr('height',20)
        .style('fill', function(d){
            if (d.Name == "Kobe Bryant") {
              return purple;
            } else {
              return gold;
            }
        })
        .on("mouseover", function(d) {
          tooltip_bar.transition().duration(100).style("opacity", .9);
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (+d.Shot) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("mid", (d3.event.pageY - 25) + "px");
          //d3.select(this).style('opacity', 0.5);
        })
        .on("mouseout", function(d) {
          tooltip_bar.style("opacity", 0);
          //d3.select(this).style('opacity', 1);
        })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (+d.Shot) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("top", (d3.event.pageY - 25) + "px");});
        

        // Create coordinates
        fg_g.append("g").attr("transform", "translate("+0+","+0+")").call(d3.axisLeft(ybar)).style("font-size", "12px").style("font-weight", "bold");
        fg_g.append("g").attr("transform", "translate("+0+","+chart_height+")").call(d3.axisBottom(xbar).tickValues([0, 10000, 20000, 30000]));

        //Create Legends
        fg_g.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (-130) +","+(chart_height/2+20)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("NBA Career Leaders");

        fg_g.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (chart_width/2) +","+(chart_height+chart_padding/2)+")")  // centre below axis
        .text("Field Goal Attempts");


        fg_g2.selectAll('rect')
        .data(PT_data)
        .enter()
        .append('rect')
        .attr('class','points-leader')
        .attr('x',0)
        .attr('y', function(d) {return ybar2(d.Name)+10;})
        .attr('width',function(d){return xbar2(d.Point);})
        .attr('height',20)
        .style('fill', function(d){
            if (d.Name == "Kobe Bryant") {
              return purple;
            } else {
              return gold;
            }
        })
        .on("mouseover", function(d) {
          tooltip_bar.transition().duration(100).style("opacity", .9);
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (+d.Point) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("mid", (d3.event.pageY - 25) + "px");
          //d3.select(this).style('opacity', 0.5);
        })
        .on("mouseout", function(d) {
          tooltip_bar.style("opacity", 0);
          //d3.select(this).style('opacity', 1);
        })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip_bar.html("<p>" + (+d.Point) + "</p>")
                      .style("left", (d3.event.pageX-15) + "px")             
                      .style("top", (d3.event.pageY - 25) + "px");});

        // Create coordinates
        fg_g2.append("g").attr("transform", "translate("+0+","+0+")").call(d3.axisLeft(ybar2)).style("font-size", "12px").style("font-weight", "bold");
        fg_g2.append("g").attr("transform", "translate("+0+","+chart_height+")").call(d3.axisBottom(xbar2).tickValues([0, 10000, 20000, 30000, 40000]));

        //Create Legends
        fg_g2.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (-130) +","+(chart_height/2+20)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("NBA Career Leaders");

        fg_g2.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (chart_width/2) +","+(chart_height+chart_padding/2)+")")  // centre below axis
        .text("Points");

      }

 

      // Annotations
      const annotations_3 = [
        {
          note: {
            label: "Kobe suffered  a career-changing Achilles Injury on April 12, 2013. He is not the same Kobe anymore after the injury.",
            title: "Achilles Injury"
          },
          type: d3.annotationCalloutCircle,
          subject: {
            radius: 20,         // circle radius
            radiusPadding: 20   // white space around circle befor connector
          },
          color: ["black"],
          x: 740,
          y: 100,
          dy: 70,
          dx: 70
        }
      ]

      const annotations_2 = [
        {
          note: {
            label: "Kobe was awarded the regular season's Most Valuable Player Award (MVP) in the 2007-08 season.",
            title: "MVP"
          },
          type: d3.annotationCalloutCircle,
          subject: {
            radius: 20,         // circle radius
            radiusPadding: 20   // white space around circle befor connector
          },
          color: ["black"],
          x: 485,
          y: 100,
          dy: 70,
          dx: 70
        }
      ]

      const annotations_1 = [
        {
          note: {
            label: "At age 23, Kobe became the youngest player to win three championships.",
            title: "Three-peat"
          },
          type: d3.annotationCalloutCircle,
          subject: {
            radius: 60,         // circle radius
            radiusPadding: 20   // white space around circle befor connector
          },
          color: ["black"],
          x: 235,
          y: 100,
          dy: 70,
          dx: 70
        }
      ]
      


      function anno_three_peat() {
        var cx = 235;
        var cy = 100;
        var r = 60;
        var k = r/1.4; // circle point to circumstance
        var l = 70; // circle point to horizontal line
        var hl = 120; // length of horizontal line
        var grp = chart_g.append("g");

        grp.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "none");
        
        grp.append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x1", cx+k)
                .attr("y1", cy+k)
                .attr("x2", cx+l)
                .attr("y2", cy+l);
        
        grp.append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x1", cx+l)
                .attr("y1", cy+l)
                .attr("x2", cx+l+hl)
                .attr("y2", cy+l);

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+15)
            .text('Three-peat')
            .attr("font-weight", "bold");
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+35)
            .text('At age 23, Kobe');

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+55)
            .text('became the');
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+75)
            .text('youngest player');
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+95)
            .text('to win three');
                
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+115)
            .text('championships');
        
      }

      function anno_mvp() {
        var cx = 485;
        var cy = 100;
        var r = 20;
        var k = r/1.4; // circle point to circumstance
        var l = 70; // circle point to horizontal line
        var hl = 120; // length of horizontal line
        var grp = chart_g.append("g");

        grp.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "none");
        
        grp.append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x1", cx+k)
                .attr("y1", cy+k)
                .attr("x2", cx+l)
                .attr("y2", cy+l);
        
        grp.append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x1", cx+l)
                .attr("y1", cy+l)
                .attr("x2", cx+l+hl)
                .attr("y2", cy+l);

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+15)
            .text('MVP')
            .attr("font-weight", "bold");
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+35)
            .text('Kobe was');

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+55)
            .text(" awarded the");

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+75)
            .text("regular season's");
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+95)
            .text('Most Valuable');
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+115)
            .text('Player Award');
                
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+135)
            .text('(MVP) in the');
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+155)
            .text('2007-08 season');
        
      }


      function anno_injury() {
        var cx = 740;
        var cy = 100;
        var r = 20;
        var k = r/1.4; // circle point to circumstance
        var l = 70; // circle point to horizontal line
        var hl = 120; // length of horizontal line
        var grp = chart_g.append("g");

        grp.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill", "none");
        
        grp.append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x1", cx+k)
                .attr("y1", cy+k)
                .attr("x2", cx+l)
                .attr("y2", cy+l);
        
        grp.append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x1", cx+l)
                .attr("y1", cy+l)
                .attr("x2", cx+l+hl)
                .attr("y2", cy+l);

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+15)
            .text('Achilles Injury')
            .attr("font-weight", "bold");
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+35)
            .text('Kobe suffered a');

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+55)
            .text("career-changing");

        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+75)
            .text("Achilles Injury");
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+95)
            .text('on April 12, 2013.');
        
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+115)
            .text('He is not the');
                
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+135)
            .text('same Kobe anymore');
        grp.append('text')
            .attr('x', cx+l)
            .attr('y',cy+l+155)
            .text('after the injury');
        
      }

    const sections = document.querySelectorAll(".padding");
    console.log(sections);
    const options = {
      root: null, // relative to document viewport 
      rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
      threshold: 1 // visible amount of item shown in relation to root
    };
    let observer = new IntersectionObserver(setActive, options);
    sections.forEach(section => observer.observe(section));


    function setActive(entries, oberver) {
      console.log("I do see you!") 
    
      for (entry of entries) {
          //const section = document.querySelector('#' + entry.target.id);
          //const nav = document.querySelector('[data-temp=' + entry.target.id +']');
          if (entry.intersectionRatio > 0.6) {
            console.log("I see you!")  
          } 
      }
  }
