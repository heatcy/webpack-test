  var map = new AMap.Map("container", {
      center: [116.400274, 39.905812],
      zoom: 14
  });

  var path = [
      [116.403322, 39.920255],
      [116.410703, 39.897555],
      [116.402292, 39.892353],
      [116.389846, 39.891365]
  ]
  let path1 = [
      [116.403322, 39.920255],
      [116.310703, 39.897555],
      [116.332292, 39.892353],
      [116.409846, 39.891365]
  ]
  var polygon1 = new AMap.Polygon({
      path: path1,
      strokeColor: "#FF33FF",
      strokeWeight: 6,
      strokeOpacity: 0.2,
      fillOpacity: 0.5,
      fillColor: 'green',
      zIndex: 50,
  })
  var polygon = new AMap.Polygon({
      path: path,
      strokeColor: "#FF33FF",
      strokeWeight: 6,
      strokeOpacity: 0.2,
      fillOpacity: 0.5,
      fillColor: '#1791fc',
      zIndex: 50,
  })

  map.add(polygon1)
  map.add(polygon)
      // 缩放地图到合适的视野级别
  map.setFitView([polygon])

  var polyEditor = new AMap.PolyEditor(map, polygon)

  polyEditor.on('addnode', function(event) {
      log.info('触发事件：addnode')
  })

  polyEditor.on('adjust', function(event) {
      log.info('触发事件：adjust')
  })

  polyEditor.on('removenode', function(event) {
      log.info('触发事件：removenode')
  })

  polyEditor.on('end', function(event) {
      log.info('触发事件： end')
          // event.target 即为编辑后的多边形对象
  })