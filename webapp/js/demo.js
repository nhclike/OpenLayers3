
            /******************定义地图全局变量***************/
            var map;  //定义地图对象
            var proj = 'EPSG:4326';   //定义wgs84地图坐标系
            var proj_m = 'EPSG:3857';   //定义墨卡托地图坐标系
            var mapLayer, mapLayerlabel;  //定义图层对象
            var source_point, vector_point;    //定义全局点对象源和层
            var popup;  //定义全局变量popup
            var source_polygon, vector_polygon;    //定义全局多边形对象源和层
            var source_draw, vector_draw;    //定义全局鼠标绘制对象源和层
            var selectedFeatures=[]; //选中的点
            /******************地图初始化函数***************/
            function initMap() {

                //初始化map对象
                map = new ol.Map({
                    target: 'map',
                    projection: proj,
                    view: new ol.View({
                        center: ol.proj.transform([101.46912, 36.24274], proj, proj_m),
                        zoom: 5
                    })
                });

                //初始化地图图层
                mapLayer = new ol.layer.Tile({
                    source: source_google,
                    projection: proj
                });
                //初始化标签图层
                mapLayerlabel = new ol.layer.Tile({
                    source: null,
                    projection: proj
                });

                //将图层加载到地图对象
                map.addLayer(mapLayer);
                map.addLayer(mapLayerlabel);
                
                
                /*******************在地图初始化函数中初始化多边形面标注层************************/
                source_polygon = new ol.source.Vector();

                vector_polygon = new ol.layer.Vector({
                    source: source_polygon
                });

                map.addLayer(vector_polygon);
                /*******************在地图初始化函数中初始化鼠标绘制标注层************************/
                source_draw = new ol.source.Vector();

                vector_draw = new ol.layer.Vector({
                    source: source_draw
                });

                map.addLayer(vector_draw);
                
              
                /*******************在地图初始化函数中初始化点对象标注层************************/
                source_point = new ol.source.Vector();

                vector_point = new ol.layer.Vector({
                    source: source_point
                });

                map.addLayer(vector_point);
               
                
                var data={
                		tel:'1231231',
                		caseName:'案件111'
                }
                _addMark(101.46912,36.24274,'vehicle_offline',source_point,data,'平湖单兵2正在播视频','5555_fds');//增加标注点
                _addMark(103.47912,37.45274,'vehicle_offline',source_point,data,'平湖单兵3','4444_fds');//增加标注点
                _addMark(105.47912,38.45274,'vehicle_offline',source_point,data,'平湖单兵4','6666_fds');//增加标注点
                _addMark(107.47912,39.45274,'vehicle_offline',source_point,data,'平湖单兵5','7777_fds');//增加标注点

                
                setTimeout(function (){
                	deleteicon(source_point,'4444_fds')
				}, 1000);
                /************************在地图初始化时添加popup标记******************************/
                var container = document.getElementById('popup');
                var content = document.getElementById('popup-content');
                var closer = document.getElementById('popup-closer');
                popup = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    },
                    offset: [0, -32]
                }));
                map.addOverlay(popup);
                
               //为popup上的close按钮添加关闭事件
                closer.onclick = function () {
                    popup.setPosition(undefined);
                    closer.blur();
                    return false;
                }

                map.on('singleclick', function (evt) {
                    var feature = map.forEachFeatureAtPixel(evt.pixel, function (f) {
                        return f;
                    });
                    //console.log(feature)
                    if (feature && feature.get("id") != null && feature && feature.get("lx") == "Point") {
                    	var data=feature.get("data")
                        popup.setPosition(feature.getGeometry().getCoordinates());
                        var strHtml = '<div style="width: 420px;height: 260px;">';
                        strHtml += '<div style="width: 100%;height: 50px;font-family:幼圆;font-size: 24pt;line-height: 50px">' + feature.getStyle().getText().getText() + '</div>';
                        strHtml += '<div style="width: 100%;height: 150px;"> ';
                        strHtml += '<div style="width: 150px;height: 150px;float: left;"><img src="images/nodata.png" style="width: 100%;height: 100%;" /></div>';
                        strHtml += '<div style="float: left;width: 230px;height: 110px;padding: 20px;font-size:12pt;">简述：这是一个点对象的测试示例，你可以根据需要定制出更多的弹出框版式。' + data.tel+data.casecode + '</div>';
                        strHtml += '</div>';
                        var jwd = ol.proj.transform([feature.get("lon"), feature.get("lat")], 'EPSG:3857', 'EPSG:4326');
                        strHtml += '<div style="width: 100%;height: 60px; padding: 10px;color: gray;font-size: 11pt;font-family:幼圆;line-height: 25px;">';
                        strHtml += '<div style="float: left;width: 48%;border-bottom: 1px gray dotted;"><div style="float: left;width: 80px;text-align: left">关联案件：</div><div style="float: right;width: 120px;text-align: right">' + data.caseName+ '</div></div>';
                        strHtml += '<div style="float: right;width: 48%;border-bottom: 1px gray dotted;"><div style="float: left;width: 80px;text-align: left">联系电话：</div><div style="float: right;width: 120px;text-align: right">' + data.tel+ '</div></div>';
                        strHtml += '<div style="float: left;width: 48%;border-bottom: 1px gray dotted;"><div style="float: left;width: 80px;text-align: left">经度：</div><div style="float: right;width: 120px;text-align: right">' + parseInt(jwd[0] * 100000000) / 100000000 + '°</div></div>';
                        strHtml += '<div style="float: right;width: 48%;border-bottom: 1px gray dotted;"><div style="float: left;width: 80px;text-align: left">纬度：</div><div style="float: right;width: 120px;text-align: right">' + parseInt(jwd[1] * 100000000) / 100000000 + '°</div></div>';
                 
                        strHtml += '</div>';
                        strHtml += '</div>';
                        content.innerHTML = strHtml;
                        
                    } else {
                        popup.setPosition(undefined);
                        closer.blur();
                    }
                });

                map.on('pointermove', function (e) {
                    if (e.dragging) {
                        popup.setPosition(undefined);
                        closer.blur();
                        return;
                    }
                });
                
               
            }
            
            /*function addMarkericon(){
            	 var data={
                 		tel:'1231231',
                 		caseName:'案件111'
                 }
                 _addMark(101.46912,36.24274,'vehicle_offline',source_point,data,'平湖单兵2正在播视频','5555_fds');//增加标注点
                 _addMark(103.47912,37.45274,'vehicle_offline',source_point,data,'平湖单兵3','4444_fds');//增加标注点
            }*/
            function _addMark(Lon,Lat,iconImg,layer,data,devName,devId){
            	var p=ol.proj.transform([Lon, Lat], proj, proj_m);
            	addPoint(devId, layer,devName, p,data,iconImg) 
            	
            }
            /******************更新标记***************/
           function addSimpleMarkericon(){
        	   var data={
               		tel:'1231231',
               		caseName:'案件111'
               }
        	   updatePoint(104.56912,38.54274,'vehicle_offline',source_point,data,'平湖单兵6移动','5555_fds');//增加标注点
           }
            //layer:{ol.source.Vector}:需要添加点对象的图层
            //label:{string}:点对象名称
            //iconname:{string}:点对象的图标名称
            function addPoint(id,layer, label,p, data,iconname) {
                var style = createStyle(1, 1, false, 0, "images/map/" + iconname+".png", 'center', 'bottom', 'bold 12px 幼圆', label, '#aa3300');
                var point = createPoint(id, "Point", p[0], p[1],data, style);
                layer.addFeature(point);
            }

            //更新点对象属性值
            //layer:{ol.source.Vector}:需要更新点对象的图层
            function updatePoint(Lon,Lat,iconImg,layer,data,devName,devId) {
                var f = layer.getFeatureById(devId);      //通过id在点图层上找到相应的Feature对象          
                layer.removeFeature(f);  //删除老的点对象
                var p=ol.proj.transform([Lon, Lat], proj, proj_m);
            	addPoint(devId, layer,devName, p,data,iconImg)      //在图层上添加点对象
            }
            //删除标注点
           function deleteicon(layer,devId){
        	   var f = layer.getFeatureById(devId);      //通过id在点图层上找到相应的Feature对象          
               layer.removeFeature(f);  //删除老的点对象 
           }
            
            /**************************绘制多边形区域*****************************/
            function addPolygonByActual() {
            	drawRegularPolygon(5)
			}
            
            function randomScreenPixel(r) {
                var centerSceenPixel = map.getPixelFromCoordinate(map.getView().getCenter()); //获取地图中心点的屏幕坐标
                var screenX = Math.floor(r + (centerSceenPixel[0] * 2 - 2*r) * Math.random());
                var screenY = Math.floor(r + (centerSceenPixel[1] * 2 - 2*r) * Math.random());
                return [screenX, screenY];
            }

            function drawRegularPolygon(n) {
                var r = 100;   //定义正多边形外接圆的半径，单位是像素
                var centerScreenPolygon = randomScreenPixel(r);  //随机生成多边形外接圆圆心点像素坐标
                var arrPoints = new Array();
                //得到正多边形各个端点的像素坐标
                var cpx,cpy;
                for(var i=0;i<n;i++){
                    cpx = Math.floor(r*Math.cos(i*2*Math.PI/n))+centerScreenPolygon[0];
                    cpy = Math.floor(r*Math.sin(i*2*Math.PI/n))+centerScreenPolygon[1];
                    arrPoints.push(map.getCoordinateFromPixel([cpx, cpy]));
                }
                arrPoints.push(arrPoints[0]);
                
                var style = createPolygonStyle("#ff0080", 2, 'rgba(0, 255, 0, 0.2)');
                var f = createPolygon("polygon" + Math.random(), "polygon", [arrPoints], style);
                source_polygon.addFeature(f);
            }

            function clearRegularPolygon() {
                source_polygon.clear();
            }

           
            /**************************用鼠标绘制各种图形*****************************/
            function mouseAddPolygonByActual() {
            	clearDrawOnMap()
            	addDrawOnMap('Polygon')
			}
            function mouseAddCircleByActual() {
            	clearDrawOnMap()
            	addDrawOnMap('Circle')
			}
            var drawonmap; // global so we can remove it later
            var polygonPoints=[];
            function addDrawOnMap(type) {   //The geometry type. One of 'Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', 'Circle'.
                if (drawonmap) {
                    map.removeInteraction(drawonmap);
                }
                if (type !== 'None') {
                    var geometryFunction, maxPoints;
                    if (type === 'Square') {
                        type = 'Circle';
                        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
                    } else if (type === 'Box') {
                        type = 'LineString';
                        maxPoints = 2;
                        geometryFunction = function (coordinates, geometry) {
                            if (!geometry) {
                                geometry = new ol.geom.Polygon(null);
                            }
                            var start = coordinates[0];
                            var end = coordinates[1];
                            geometry.setCoordinates([
                                [start, [start[0], end[1]], end, [end[0], start[1]], start]
                            ]);
                          
                            return geometry;
                        };
                    }

                    var style = createPolygonStyle("#808080", 2, 'rgba(200, 0, 255, 0.1)');
                    
                    drawonmap = new ol.interaction.Draw({
                        source: source_draw,
                        style: style,
                        type: /** @type {ol.geom.GeometryType} */ (type),
                        geometryFunction: geometryFunction,
                        maxPoints: maxPoints
                    });
                    map.addInteraction(drawonmap);
                    drawonmap.on('drawstart',function(evt){
                    	 var polygon = evt.feature.getGeometry();
                    	 //判断当前图层上有没有点对象
                    	 /*try {
							var point=polygon.getCenter();
							console.log(point)
						} catch (e) {
							var point=polygon.getCoordinates();
							console.log(point)
						}*/
                    	
                    	//clearDrawOnMap()
                    })
                    drawonmap.on('drawend',function(evt){  
                        var polygon = evt.feature.getGeometry(); 
                        setTimeout(function(){              //如果不设置延迟，范围内要素选中后自动取消选中，具体原因不知道  
                           var str = "";  
                            var allfeatures=source_point.getFeatures()
                            for(var i=0;i<allfeatures.length;i++){  
                                var newCoords = allfeatures[i].getGeometry().getCoordinates();
                                try {
                                	//圆形处理
                                	 var center = polygon.getCenter(),radius = polygon.getRadius();
                                     if(pointInsideCircle(newCoords,center,radius)){  
                                         selectedFeatures.push(allfeatures[i]); 
                                     }
								} catch (e) {
									//多边形处理
									var points=polygon.getCoordinates();
									if(insidePolygon(points[0], newCoords)){
										selectedFeatures.push(allfeatures[i]);
									}
								}
                            }  
                            //框选出的点处理
                            if(selectedFeatures.length>0){
                            	for (var i = 0; i <selectedFeatures.length; i++) {
                            		var selectedFeature=selectedFeatures[i]
                            		var data=selectedFeature.get("data")
                            		var devname=selectedFeature.getStyle().getText().getText()
                                    str += '<div><div >关联案件：</div><div>' + data.caseName+ '</div></div>';
                                    str += '<div"><div >设备名称：</div><div >' + devname+ '</div></div>';
                                    //console.log(str)
                            	}
                            	$('#selectDev').html(str);
                            }
                            
                        },300)  
                    })  
                }
            }

            function clearDrawOnMap() {
                source_draw.clear();
                selectedFeatures=[];
                addDrawOnMap("None");
            }
            
            /** 
             *  判断一个点是否在圆的内部 
             *  @param point  测试点坐标 
             *  @param circle 圆心坐标 
             *  @param r 圆半径 
             *  返回true为真，false为假 
             *  */  
            function pointInsideCircle(point, circle, r) {  
                if (r===0) return false  
                var dx = circle[0] - point[0]  
                var dy = circle[1] - point[1]  
                return dx * dx + dy * dy <= r * r  
            }  
            /** 
             *  判断一个点是否在多边形内部 
             *  @param points 多边形坐标集合 
             *  @param testPoint 测试点坐标 
             *  返回true为真，false为假 
             *  */  
            function insidePolygon(points, testPoint){  
                var x = testPoint[0], y = testPoint[1];  
                var inside = false;  
                for (var i = 0, j = points.length - 1; i < points.length; j = i++) {  
                    var xi = points[i][0], yi = points[i][1];  
                    var xj = points[j][0], yj = points[j][1];  
          
                    var intersect = ((yi > y) != (yj > y))  
                            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);  
                    if (intersect) inside = !inside;  
                }  
                return inside;  
            } 
        