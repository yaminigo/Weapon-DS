var app = angular.module('solr-app', ['solstice']);
var width1,monthArray,height1,width2,height2,width3,height3;
var radius3,color,arc,labelArc,pie;
var x,y,xAxis,yAxis,global_i;
var return_count=[];
var svg2,svg1,svg3;
var margin4,width4,height4,parseDate4,formatDate4,x4,y4,z4,xStep4,ystep4;
var margin5,width5,barHeight5,barWidth5,root5,duration5,i5,tree5,diagonal5;
var margin6,width6,root6,duration6,i6,tree6,diagonal6,svg6;
$(document).ready(function(){
    /*World Map*/
    width1 = window.innerWidth*0.95,height1 = 700;
    projection = d3.geo.mercator().scale((width1 + 1) / 2 / Math.PI).translate([width1 / 2, height1 / 2]).precision(.1);
    path = d3.geo.path().projection(projection);
    graticule = d3.geo.graticule();
    svg1 = d3.select(".center").append("svg").attr("width", width1).attr("height", height1);
    svg1.append("path").datum(graticule).attr("class", "graticule").attr("d", path);        
    //This is for plotting boundaries on world map        
    d3.json("world-50m.json", function(error, world) {
        if (error) throw error;
        svg1.insert("path", ".graticule").datum(topojson.feature(world, world.objects.land)).attr("class", "land").attr("d", path);
        svg1.insert("path", ".graticule").datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
			  .attr("class", "boundary")
			  .attr("d", path);
		});
    
    /*Bar Chart*/
    var margin2 = {top: 20, right: 20, bottom: 30, left: 40};
    width2 = 960 - margin2.left - margin2.right;
    height2 = 500 - margin2.top - margin2.bottom;
    x = d3.scale.ordinal()
        .rangeRoundBands([5, width2], .1);
    y = d3.scale.linear()
        .range([height2, 0]);
    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "");
    svg2 = d3.select("#line_data").append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
      .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis);
    
    /*Pie Chart*/
    width3 = 960;
    height3 = 500;
    radius3 = Math.min(width3, height3) / 2;

    color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#af8c00","#ef3d00","#fb4b00","#fa8a00"]);

    arc = d3.svg.arc()
        .outerRadius(radius3 - 10)
        .innerRadius(0);

    labelArc = d3.svg.arc()
        .outerRadius(radius3 - 40)
        .innerRadius(radius3 - 40);

    pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    svg3 = d3.select("#piechart").append("svg")
        .attr("width", width3)
        .attr("height", height3)
      .append("g")
        .attr("transform", "translate(" + width3 / 2 + "," + height3 / 2 + ")");    
     /*heat map*/
    margin4 = {top: 20, right: 90, bottom: 30, left: 50};
    width4 = 960 - margin4.left - margin4.right;
    height4 = 500 - margin4.top - margin4.bottom;

    parseDate4 = d3.time.format("%Y-%m-%d").parse;
    formatDate4 = d3.time.format("%b %d");

    x4 = d3.time.scale().range([0, width4]);
    y4 = d3.scale.linear().range([height4, 0]);
    z4 = d3.scale.linear().range(["white", "steelblue"]);

// The size of the buckets in the CSV data file.
// This could be inferred from the data if it weren't sparse.
    xStep4 = 864e5;
    yStep4 = 100;   
    
    /*Collapsible Tree*/
    margin5 = {
			top : 30,
			right : 20,
			bottom : 30,
			left : 20
		};
    width5 = 960 - margin5.left - margin5.right;
    barHeight5 = 20;
    barWidth5 = width5 * .8;
    i5 = 0;
    duration5 = 400;
    tree5 = d3.layout.tree().nodeSize([0, 20]);
    diagonal5 = d3.svg.diagonal().projection(function(d) {
			return [d.y, d.x];
    });
    
    /*tree*/
margin6 = {top: 20, right: 120, bottom: 20, left: 120};
    width6 = 960 - margin6.right - margin6.left;
    height6 = 800 - margin6.top - margin6.bottom;

i6 = 0;
duration6 = 750;

tree6 = d3.layout.tree()
    .size([height6, width6]);

diagonal6 = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
    
    
    $(".display_type").change(function(){
        if(this.value==0){
            $("#map_data").css("display","block");
            $("#line_data").css("display","none");
            $("#piechart").css("display","none");
            $("#heatmap").css("display","none");
            $("#collapsibleTree").css("display","none");
            $("#tree").css("display","none");
        }else{
            if(this.value==1){
                $("#map_data").css("display","none");
                $("#line_data").css("display","block");
                $("#piechart").css("display","none");
                $("#heatmap").css("display","none");
                $("#collapsibleTree").css("display","none");
                $("#tree").css("display","none");
            }else{
                if(this.value==2){
                    $("#map_data").css("display","none");
                    $("#line_data").css("display","none");
                    $("#piechart").css("display","block");
                    $("#heatmap").css("display","none");
                    $("#collapsibleTree").css("display","none");
                    $("#tree").css("display","none");
                }else{
                    if(this.value==3){
                        $("#map_data").css("display","none");
                        $("#line_data").css("display","none");
                        $("#piechart").css("display","none");
                        $("#heatmap").css("display","block");
                        $("#collapsibleTree").css("display","none");
                        $("#tree").css("display","none");
                    }else{
                        if(this.value==4){
                            $("#map_data").css("display","none");
                            $("#line_data").css("display","none");
                            $("#piechart").css("display","none");
                            $("#heatmap").css("display","none");
                            $("#collapsibleTree").css("display","block");                            
                            $("#tree").css("display","none");
                        }else{
                            $("#map_data").css("display","none");
                            $("#line_data").css("display","none");
                            $("#piechart").css("display","none");
                            $("#heatmap").css("display","none");
                            $("#collapsibleTree").css("display","none");
                            $("#tree").css("display","block");
                        }                      
                    }
                }
            }
        }

    });    
    
   
    
});

app.config(function(SolsticeProvider) {
  SolsticeProvider.setEndpoint('http://localhost:8983/solr/collection1');
});


app.controller('MyController', function($scope, Solstice) {
    
    $scope.search1=function(){        
        $scope.plotDataOnMap1(1);
        $scope.plotOnBarChart1();
        $scope.plotPieChart1(1);
        $scope.plotOnHeatMap1(1);
        $scope.plotOnCollapseTree1(0);
        $scope.plotOnTree1(0);
    }
                
     $(".display_date").change(function(){
        $scope.plotPieChart1(this.value);
    });
    
     $(".display_date2").change(function(){
       $scope.plotDataOnMap1(this.value);
    });
        
    $(".display_month").change(function(){
        $scope.plotOnHeatMap1(this.value);
    });
    
    $("#reload").click(function(){
        var value=$("#start_data").val();
        $scope.plotOnCollapseTree1(value);        
    });
    
    $("#reload1").click(function(){
        var value=$("#start_data1").val();
        $scope.plotOnTree1(value);       
    });
    $scope.plotOnTree1=function(start){       
        Solstice.search({
              q: 'content:'+$scope.searchTerm+' AND Geographic_NAME:* AND Geographic_INFO:* AND Idf_INFO:* AND (title:* OR content_type:*)',
              fl:'id,time_stamp,Geographic_INFO,Geographic_NAME,Idf_INFO,content_type,title',
              'start':start,
              'rows': 10
          })
          .then(function (data){  
                var response_data=data['data']['response']['docs'];
                $scope.plotOnTree(response_data);                  
          });
    }
    
    $scope.plotOnTree=function(month){
        var final_data1=[];
        final_data1['name']='docs';
        var children_data1=[]
        for(var i=0;i<month.length;i++){
            var data=[];
            data['name']='doc'+i;
            var temp_d=[];
            for(var d in month[i]){
                var new_data=[];
                new_data['name']=d+':'+month[i][d];
                var new_d_child=[];
                new_d_child['name']=month[i][d];
                new_d_child['size']=1;
                new_data['children']=new_d_child;
                temp_d.push(new_data);
            }
            data['children']=temp_d;
            children_data1.push(data);
        }
        final_data1['children']=children_data1;
        var temp=d3.select("#tree svg");
        temp.remove();
        svg6 = d3.select("#tree").append("svg")
            .attr("width", width6 + margin6.right + margin6.left)
            .attr("height", height6 + margin6.top + margin6.bottom)
          .append("g")
            .attr("transform", "translate(" + margin6.left + "," + margin6.top + ")");
        
        root = final_data1;
        root.x0 = height6 / 2;
        root.y0 = 0;
        function collapse(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
        }
        root.children.forEach(collapse);
        update1(root);
        
        d3.select(self.frameElement).style("height", "800px");

        function update1(source) {

          // Compute the new tree layout.
          var nodes = tree6.nodes(root).reverse(),
              links = tree6.links(nodes);

          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 180; });

          // Update the nodes…
          var node = svg6.selectAll("g.node")
              .data(nodes, function(d) { return d.id || (d.id = ++i6); });

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
              .on("click", click1);

          nodeEnter.append("circle")
              .attr("r", 1e-6)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

          nodeEnter.append("text")
              .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
              .attr("dy", ".35em")
              .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text(function(d) { return d.name; })
              .style("fill-opacity", 1e-6);

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
              .duration(duration6)
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          nodeUpdate.select("circle")
              .attr("r", 4.5)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

          nodeUpdate.select("text")
              .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
              .duration(duration6)
              .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
              .remove();

          nodeExit.select("circle")
              .attr("r", 1e-6);

          nodeExit.select("text")
              .style("fill-opacity", 1e-6);

          // Update the links…
          var link = svg6.selectAll("path.link")
              .data(links, function(d) { return d.target.id; });

          // Enter any new links at the parent's previous position.
          link.enter().insert("path", "g")
              .attr("class", "link")
              .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal6({source: o, target: o});
              });

          // Transition links to their new position.
          link.transition()
              .duration(duration6)
              .attr("d", diagonal6);

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
              .duration(duration6)
              .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal6({source: o, target: o});
              })
              .remove();

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        }

        // Toggle children on click.
        function click1(d) {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update1(d);
        }
        

    }
    
    
    $scope.plotOnCollapseTree1=function(start){       
        Solstice.search({
              q: 'content:'+$scope.searchTerm+' AND Geographic_NAME:* AND Geographic_INFO:* AND Idf_INFO:* AND (title:* OR content_type:*)',
              fl:'id,time_stamp,Geographic_INFO,Geographic_NAME,Idf_INFO,content_type,title', 
            'start':start,
              'rows': 10
          })
          .then(function (data){  
                var response_data=data['data']['response']['docs'];
                $scope.plotOnCollapseTree(response_data);                  
          });
    }
    
    $scope.plotOnCollapseTree=function(month){
        var final_data=[];
        final_data['name']='docs';
        var children_data=[]
        for(var i=0;i<month.length;i++){
            var data=[];
            data['name']='doc'+i;
            var temp_d=[];
            for(var d in month[i]){
                var new_data=[];
                new_data['name']=d+':'+month[i][d];
                var new_d_child=[];
                new_d_child['name']=month[i][d];
                new_d_child['size']=1;
                new_data['children']=new_d_child;
                temp_d.push(new_data);
            }
            data['children']=temp_d;
            children_data.push(data);
        }
        final_data['children']=children_data;
        var temp=d3.select("#collapsibleTree svg");
       temp.remove();
        var svg = d3.select("#collapsibleTree").append("svg").attr("height", 1000).attr("width", width5 + margin5.left + margin5.right).append("g").attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

		/*d3.json("flare.json", function(error, flare) {
			flare.x0 = 0;
			flare.y0 = 0;
			update( root = flare);
		});*/
        update(root=final_data);
		function update(source) {

			// Compute the flattened node list. TODO use d3.layout.hierarchy.
			var nodes = tree5.nodes(root);

			var height5 = Math.max(500, nodes.length * barHeight5 + margin5.top + margin5.bottom);

			d3.select("svg").transition().duration(duration5).attr("height", height5);

			d3.select(self.frameElement).transition().duration(duration5).style("height", height5 + "px");

			// Compute the "layout".
			nodes.forEach(function(n, i) {
				n.x = i * barHeight5;
			});

			// Update the nodes…
			var node = svg.selectAll("g.node").data(nodes, function(d) {
				return d.id || (d.id = ++i);
			});

			var nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", function(d) {
				return "translate(" + source.y0 + "," + source.x0 + ")";
			}).style("opacity", 1e-6);

			// Enter any new nodes at the parent's previous position.
			nodeEnter.append("rect").attr("y", -barHeight5 / 2).attr("height", barHeight5).attr("width", barWidth5).style("fill", color).on("click", click);

			nodeEnter.append("text").attr("dy", 3.5).attr("dx", 5.5).text(function(d) {
				return d.name;
			});

			// Transition nodes to their new position.
			nodeEnter.transition().duration(duration5).attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			}).style("opacity", 1);

			node.transition().duration(duration5).attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			}).style("opacity", 1).select("rect").style("fill", color);

			// Transition exiting nodes to the parent's new position.
			node.exit().transition().duration(duration5).attr("transform", function(d) {
				return "translate(" + source.y + "," + source.x + ")";
			}).style("opacity", 1e-6).remove();

			// Update the links…
			var link = svg.selectAll("path.link").data(tree5.links(nodes), function(d) {
				return d.target.id;
			});

			// Enter any new links at the parent's previous position.
			link.enter().insert("path", "g").attr("class", "link").attr("d", function(d) {
				var o = {
					x : source.x0,
					y : source.y0
				};
				return diagonal5({
					source : o,
					target : o
				});
			}).transition().duration(duration5).attr("d", diagonal5);

			// Transition links to their new position.
			link.transition().duration(duration5).attr("d", diagonal5);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition().duration(duration5).attr("d", function(d) {
				var o = {
					x : source.x,
					y : source.y
				};
				return diagonal5({
					source : o,
					target : o
				});
			}).remove();

			// Stash the old positions for transition.
			nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});
		}

		// Toggle children on click.
		function click(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			update(d);
		}

		function color(d) {
			return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
		}
    }
    
    $scope.plotPieChart1=function(month){       
        Solstice.search({
            
              q: 'content:'+$scope.searchTerm+' AND -Geographic_LATITUDE:0 AND Geographic_NAME:*',
              'facet':'true',
             'fq':'-Geographic_LATITUDE:0 AND time_stamp:[2015-0'+month+'-01T00:00:00Z TO 2015-'+month+'-30T00:00:00Z]',
            'fl':'Geographic_NAME',
             'facet.field':'Geographic_NAME',                            
              'rows': 500
          })
          .then(function (data){    
               var field_data=data['data']['response']['docs'];
               $scope.plotDataOnPieChart(field_data);                            
          });
    }
    
    
    
     $scope.plotDataOnPieChart=function(field_data){
         var geo_data={};
         var j=0;
         for(j=0;j<field_data.length;j++){
             if(geo_data[field_data[j]['Geographic_NAME']]){
             geo_data[field_data[j]['Geographic_NAME']]= geo_data[field_data[j]['Geographic_NAME']]+1;
             }else{
                 geo_data[field_data[j]['Geographic_NAME']]=1;
             }
         }
         var i=0;     
         var final_data=[];
         for(var city in geo_data){
             var data=[];
             data['city']=city;
             data['count']=geo_data[city];
             final_data.push(data);             
             i++;
         }   
         var temp=svg3.selectAll(".arc");
         temp.remove();
         var g = svg3.selectAll(".arc").data(pie(final_data)).enter().append("g").attr("class", "arc");
        
         g.append("path")             
              .attr("d", arc)
              .style("fill", function(d) { return getRandomColor(); });
         g.append("svg:text")
              .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .attr("title",function(d) { return d.city; })
              .text(function(d) { return d.city; });
          g.data(final_data).attr("title",function(d){ return d.city;});
     } 
     
     function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
     }
    $scope.plotOnHeatMap1=function(month_pass){
        Solstice.search({
              q: 'content:'+$scope.searchTerm,
              'facet':'true',
             'facet.date':'time_stamp',
             'facet.date.start':'2015-'+month_pass+'-01T00:00:00Z',
             'facet.date.end':'2015-'+month_pass+'-30T00:00:00Z',
             'facet.date.gap':'+1DAY',                
              'rows': 100
          })
          .then(function (data){
               var month_count1=data['data']['facet_counts']['facet_dates']['time_stamp'];
               $scope.plotDataOnHeatMap(month_count1);                          
          });        
        
    }
    
   $scope.plotDataOnHeatMap=function(month_count1){
       var final_data=[];
        for(var month_data in month_count1){
            if(month_data!="gap" && month_data!="start" && month_data!="end"){
                var data=[];
                data['date']=month_data.split('T')[0];
                data['bucket']=parseInt(month_data.split("-")[2].split("T")[0]);
                data['count']=parseInt(month_count1[month_data]);                
                final_data.push(data);
            }
        }
       console.log("read data");
       final_data.forEach(function(d) {
            d.date = parseDate4(d.date);
            d.bucket = +d.bucket;
            d.count = +d.count;
        });

     var temp=d3.select("#heatmap svg");
       temp.remove();
     svg4 = d3.select("#heatmap").append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
  .append("g")
    .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");
       
  // Compute the scale domains.
  x4.domain(d3.extent(final_data, function(d) { return d.date; }));
  y4.domain(d3.extent(final_data, function(d) { return d.bucket; }));
  z4.domain([0, d3.max(final_data, function(d) { return d.count; })]);

  // Extend the x- and y-domain to fit the last bucket.
  // For example, the y-bucket 3200 corresponds to values [3200, 3300].
  x4.domain([x4.domain()[0], +x4.domain()[1] + xStep4]);
  y4.domain([y4.domain()[0], y4.domain()[1] + yStep4]);

  // Display the tiles for each non-zero bucket.
  // See http://bl.ocks.org/3074470 for an alternative implementation. 
  svg4.selectAll(".tile")
      .data(final_data)
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x4(d.date); })
      .attr("y", 98.4375)
      .attr("width", x4(xStep4) - x4(0))
      .attr("height",  y4(0) - y4(yStep4))
      .style("fill", function(d) { return z4(d.count); });

  // Add a legend for the color values.      
  var legend = svg4.selectAll(".legend")
      .data(z4.ticks(6).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width4 + 20) + "," + (20 + i * 20) + ")"; });

  legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", z4);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svg4.append("text")
      .attr("class", "label")
      .attr("x", width4 + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text("Count");

  // Add an x-axis with label.
  svg4.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height4 + ")")
      .call(d3.svg.axis().scale(x4).ticks(d3.time.days).tickFormat(formatDate4).orient("bottom"))
    .append("text")
      .attr("class", "label")
      .attr("x", width4)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .text("Date");

  // Add a y-axis with label.
  svg4.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y4).orient("left"))
    .append("text")
      .attr("class", "label")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("Value");
    }
    
    $scope.plotOnBarChart1=function(){
        Solstice.search({
              q: 'content:'+$scope.searchTerm,
              'facet':'true',
             'facet.date':'time_stamp',
             'facet.date.start':'2015-01-01T00:00:00Z',
             'facet.date.end':'2015-12-30T00:00:00Z',
             'facet.date.gap':'+1MONTH',                
              'rows': 1000
          })
          .then(function (data){
                var month_count=data['data']['facet_counts']['facet_dates']['time_stamp'];
               $scope.plotDataOnBarChart(month_count);                            
          });        
        
    }
    
   $scope.plotDataOnBarChart=function(month_count){  
       var bar=svg2.selectAll(".bar");
       bar.remove();
       var bar=svg2.selectAll(".y");
       bar.remove();
       monthArray=[{"month":"Jan","count":0,"range":"2015-01-01T00:00:00Z"},{"month":"Feb","count":0,"range":"2015-02-01T00:00:00Z"},{"month":"Mar","count":0,"range":"2015-03-01T00:00:00Z"},{"month":"Apr","count":0,"range":"2015-04-01T00:00:00Z"},{"month":"May","count":0,"range":"2015-05-01T00:00:00Z"},{"month":"Jun","count":0,"range":"2015-06-01T00:00:00Z"},{"month":"Jul","count":0,"range":"2015-07-01T00:00:00Z"},{"month":"Aug","count":0,"range":"2015-08-01T00:00:00Z"},{"month":"Sep","count":0,"range":"2015-09-01T00:00:00Z"},{"month":"Oct","count":0,"range":"2015-10-01T00:00:00Z"},{"month":"Nov","count":0,"range":"2015-11-01T00:00:00Z"},{"month":"Dec","count":0,"range":"2015-12-01T00:00:00Z"}];
       
       x.domain(monthArray.map(function(d) { return d.month; }));        
       var i;
       for(i=0;i<=11;i++){
           monthArray[i].count=month_count[monthArray[i].range]/10000;
       }
       y.domain([0, d3.max(monthArray, function(d) { return d.count; })]);
       svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis);

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Document count in 10,000");
       
svg2.selectAll(".bar")
      .data(monthArray)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.month); }).attr("id", function(d) { return d.month })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.count) ;})
      .attr("height", function(d) { return height2 - y(d.count); });                      
   }
    
    $scope.plotDataOnMap1=function(month){
        Solstice.search({
              q: 'content:'+$scope.searchTerm+' AND Geographic_LATITUDE:* AND -Geographic_LONGITUDE:0 AND Geographic_NAME:* AND Geographic_INFO:*',
              fl: 'content,id,tstamp,Geographic_LATITUDE,Geographic_LONGITUDE,Geographic_NAME,Geographic_INFO',
              'fq':'time_stamp:[2015-0'+month+'-01T00:00:00Z TO 2015-'+month+'-30T00:00:00Z]',
              sort: 'tstamp desc',
              rows: 500
          })
          .then(function (data){
              $scope.results = data['data']['response'];
              console.log(data['data']['response']['numFound']);
              $scope.plotDataOnMap();                         
          });
    }
    
    $scope.plotDataOnMap=function(){        		
        var cir=svg1.selectAll("circle");
        cir.remove();
		d3.select(self.frameElement).style("height", height1 + "px");		
        var groups = $scope.results["docs"];
        for (var i = 0; i < groups.length; i++) {
            if(!isNaN(parseFloat(groups[i]["Geographic_LATITUDE"])) && !isNaN(parseFloat(groups[i]["Geographic_LONGITUDE"])) ){
                var loc = [parseFloat(groups[i]["Geographic_LATITUDE"]),parseFloat(groups[i]["Geographic_LONGITUDE"])];
                if(!isNaN(projection([loc[0], loc[1]])[1]) && !isNaN(projection([loc[0], loc[1]])[0])){
				   
				    svg1.append("circle").attr("r",5).attr('title',groups[i]["Geographic_NAME"]+'\n'+groups[i]['id']).attr('fill',"rgba(249,205,173,1)").attr('stroke', "red").attr("transform", function() {return "translate(" + projection([loc[1], loc[0]]) + ")";});
                }
            }else{
                    console.log(groups[i]["Geographic_LATITUDE"]+groups[i]["Geographic_LONGITUDE"]+groups[i]["Geographic_NAME"]);
            }

        }
    }
});
