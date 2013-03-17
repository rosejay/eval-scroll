
	var childNum,   // children number for each level
		levelNum;   // maximum level number

	var initZoomLevel = 3,
		zoom = initZoomLevel,	// google map zoom value
		level = zoom - 3,	// my level value
		focus;	// focus area index

	// generate target location
	var targetNum,		// target number from 0-255
		target = [],	// target position 
		targetMarker = new google.maps.Marker();  // target marker


	var winwidth = window.innerWidth,	// windows width
		winheight = window.innerHeight;	// windows height

	var rectWidth = winwidth/4,		// rect marker width
		rectHeight = winheight/4,	// rect marker height
		rectPoint = [];				// rect marker position
	var markerArray = [];			// four rect marker

	// def of marker rect and marker center points
	var rectPoint =[[ winwidth/2, winheight/3 ],
					[ winwidth*5/6, winheight*5/8 ],
					[ winwidth/2, winheight*11/12 ],
					[ winwidth/6, winheight*5/8 ],
					[ winwidth/2, winheight*5/8 ]];

	var centerPoint = [[ winwidth/2, winheight*5/24 ],
					   [ winwidth*19/24, winheight/2 ],
					   [ winwidth/2, winheight*19/24 ],
					   [ winwidth*5/24, winheight/2 ],
					   [ winwidth/2, winheight/2 ]];


	function initMap(){

		generateTarget();

		// init map
		var html = $("<div class='map' style='width:" + (winwidth) + "px;height:" + (winheight) + "px'></div>");
		var mapOptions = {
			mapTypeControl: false,
			scaleControl: false,
			center: new google.maps.LatLng( 30, 50 ),
			zoom: initZoomLevel,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			streetViewControl: false,
			panControl: false
		};

		// Create map 
		var map = new google.maps.Map(html[0], mapOptions);

		// add div level
	    $("#page-2").append(html);

		// Create overlay
	    var overlay = new google.maps.OverlayView();
		overlay.draw = function () {};
		overlay.onAdd = function() {};
		overlay.onRemove = function () {};
		overlay.setMap(map);
		var projection;

		var times = true;
		// Wait for idle map
		google.maps.event.addListener(map, 'idle', function() {
		    

			

		    // Get projection
			projection = overlay.getProjection();
			var latlng = projection.fromContainerPixelToLatLng(new google.maps.Point(rectPoint[0][0], rectPoint[0][1]));

			if(times){
				generateMarker();
				times = false;
			}

			google.maps.event.addListener(map, 'bounds_changed', clearMarker);

			// set zoom 3 as max
			var z = map.getZoom();
			level = z - 3;
			
			if ( z<=3 ) {
				z = 3;
				level = z-3;
				map.setZoom(z);
				map.setCenter(new google.maps.LatLng( 30, 50 ));
				generateMarker();
			}
			else if( z > 3+levelNum ){
				z = 3+levelNum;
				level = z-3;
				map.setZoom(z);

			}
			else{

				// if zoom out 
				if(z<zoom){
					generateMarker();
				}
				else{
					// if it's the right path
					if(target[level-1] == focus){

						// if it is the target!
						if(z == 3+levelNum ){

							// set target marker
							targetMarker = new google.maps.Marker({
								position: map.getCenter(),
								map: map,
								icon: createMarker()
							});
							$(".finish").fadeIn();
						}
						else{ // else it's not yet reached the target but display the rect
							generateMarker();
						}
					}
				}
			}

			$(".zoom span").html(level);
			zoom = z;

		});
		
		function createMarker() {
 
			var canvas, context;

			canvas = document.createElement("canvas");
			canvas.width = 440;
			canvas.height = 60;

			context = canvas.getContext("2d");

			context.clearRect(0,0,440,60);

			// background is yellow
			context.fillStyle = "rgba(255,255,255,1)";
			context.fillRect(0,0,440,60);

			context.fillStyle = "rgba(170,170,170,1)";
			context.font="30px Arial";
			context.fillText(message.txt,170,50);
			context.fill();



			return canvas.toDataURL();

		}


		
		function generateMarker(){

			// clear
			clearMarker();

			// generate
			for(var i = 0; i<childNum; i++){
				markerArray.push( new Marker(i) );
			}
		}
			
		// clear markerArray
		function clearMarker(){

			// clear rect
			for (var i = 0; i < markerArray.length; i++ ) {
				markerArray[i].clear();
			}
			markerArray = [];

			// clear target marker
			targetMarker.setMap(null);
		}
		
		// class marker
		var Marker = function( index ){

			this.index = index;

			// marker lat and lng
			var latlng = projection.fromContainerPixelToLatLng(
										new google.maps.Point(rectPoint[index][0], rectPoint[index][1]));

			// create marker
			this.marker = new google.maps.Marker({
								position: new google.maps.LatLng(latlng.lat(), latlng.lng()),
								map: map,
								index: index,
								icon: this.createMarker(rectWidth, rectHeight)
							});

			this.center = centerPoint[index];
			this.centerLatLng = projection.fromContainerPixelToLatLng(
										new google.maps.Point(centerPoint[index][0], centerPoint[index][1]));



			google.maps.event.addListener(this.marker, 'mouseover', function() {
				focus = this.index;

			});
			google.maps.event.addListener(this.marker, 'mouseout', function() {
				focus = -1;
			});

		}

		// draw marker on a canvas
		Marker.prototype.createMarker = function(width, height) {

			var canvas, context;

			canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			context = canvas.getContext("2d");

			context.clearRect(0,0,width,height);

			// border is black
			context.strokeStyle = "rgba(0,0,0,0.2)";
			context.lineWidth = 10;
			context.rect(0,0,width,height);

			context.stroke();

			return canvas.toDataURL();

		}

		// clear marker
		Marker.prototype.clear = function() {
			this.marker.setMap(null);
		}


		function generateTarget(){

			targetNum = Math.floor( Math.random() * Math.pow(childNum, levelNum) );  
			console.log( targetNum );
			for( var i = 0; i<levelNum; i++){

				target[i] = Math.floor(targetNum / Math.pow(childNum, (levelNum - 1 - i)));
				targetNum = targetNum % Math.pow(childNum, (levelNum - 1 - i));
			}
			console.log("target", target);
		}

	}



	
	
		

	// define target message;
	var Msg = function(txt, author, lat, lng){

		this.txt = txt;
		this.author = author;
		this.lat = lat;
		this.lng = lng;
	}
	var message = new Msg( Math.floor(Math.random()*1000000), "Ye Lin", 45, 2 );


		/*
	getSettingNum();
	

	function getSettingNum(){

		var url = document.URL;



		var q = url.queryKey['level'];
		console.log(q);
	}
*/


	// set up
	$(".num").click(function(){

		if($(this).hasClass("lev"))
			$(".lev").removeClass("sel");
		else if($(this).hasClass("chi"))
			$(".chi").removeClass("sel");

		$(this).addClass("sel");
	});

	$(".ok").click(function(){


		if($(".chi.sel").length){
			childNum = parseInt( $(".chi.sel").html() ); 
			if($(".lev.sel").length)
				levelNum = parseInt( $(".lev.sel").html() );

			$(".setup").fadeOut();

			initMap();

		}
		else
			alert("Please set up data first. Thanks!");

	});


	$(".restart").click(function(){

		document.location.reload(true);
	})





