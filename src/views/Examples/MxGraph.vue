<template>
  <div id="graphContainer"
       style="position:relative;overflow:hidden;width:321px;height:241px;background:url('/static/mxGraph/images/grid.gif');cursor:default;">
  </div>
</template>

<script>
/* eslint-disable no-new */
/* eslint-disable new-cap */
export default {
  name: 'api',
  data () {
    return {}
  },
  created () {

  },
  mounted () {
    // Program starts here. Creates a sample graph in the
    // DOM node with the specified ID. This function is invoked
    // from the onLoad event handler of the document (see below).
    function main (el) {
      // Checks if browser is supported
      if (!window.mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is
        // not supported.
        window.mxUtils.error('Browser is not supported!', 200, false)
      } else {
        // Defines an icon for creating new connections in the connection handler.
        // This will automatically disable the highlighting of the source vertex.
        window.mxConnectionHandler.prototype.connectImage = new window.mxImage('/static/mxGraph/images/connector.gif', 16, 16)

        // Creates the div for the toolbar
        var tbContainer = document.createElement('div')
        tbContainer.style.position = 'absolute'
        tbContainer.style.overflow = 'hidden'
        tbContainer.style.padding = '2px'
        tbContainer.style.left = '0px'
        tbContainer.style.top = '0px'
        tbContainer.style.width = '24px'
        tbContainer.style.bottom = '0px'
        el.appendChild(tbContainer)

        // Creates new toolbar without event processing
        var toolbar = new window.mxToolbar(tbContainer)
        toolbar.enabled = false

        // Creates the div for the graph
        var container = document.createElement('div')
        container.style.position = 'absolute'
        container.style.overflow = 'hidden'
        container.style.left = '24px'
        container.style.top = '0px'
        container.style.right = '0px'
        container.style.bottom = '0px'
        container.style.background = 'url("/static/mxGraph/images/grid.gif")'

        el.appendChild(container)

        // Workaround for Internet Explorer ignoring certain styles
        if (window.mxClient.IS_QUIRKS) {
          document.body.style.overflow = 'hidden'
          new window.mxDivResizer(tbContainer)
          new window.mxDivResizer(container)
        }

        // Creates the model and the graph inside the container
        // using the fastest rendering available on the browser
        var model = new window.mxGraphModel()
        var graph = new window.mxGraph(container, model)

        // Enables new connections in the graph
        graph.setConnectable(true)
        graph.setMultigraph(false)

        // Stops editing on enter or escape keypress
        // var keyHandler = new window.mxKeyHandler(graph)
        //  var rubberband = new window.mxRubberband(graph)

        var addVertex = function (icon, w, h, style) {
          var vertex = new window.mxCell(null, new window.mxGeometry(0, 0, w, h), style)
          vertex.setVertex(true)

          var img = addToolbarItem(graph, toolbar, vertex, icon)
          img.enabled = true

          graph.getSelectionModel().addListener(window.mxEvent.CHANGE, function () {
            var tmp = graph.isSelectionEmpty()
            window.mxUtils.setOpacity(img, (tmp) ? 100 : 20)
            img.enabled = tmp
          })
        }

        addVertex('/static/mxGraph/images/rectangle.gif', 100, 40, '')
        addVertex('/static/mxGraph/images/rounded.gif', 100, 40, 'shape=rounded')
        addVertex('/static/mxGraph/images/ellipse.gif', 40, 40, 'shape=ellipse')
        addVertex('/static/mxGraph/images/rhombus.gif', 40, 40, 'shape=rhombus')
        addVertex('/static/mxGraph/images/triangle.gif', 40, 40, 'shape=triangle')
        addVertex('/static/mxGraph/images/cylinder.gif', 40, 40, 'shape=cylinder')
        addVertex('/static/mxGraph/images/actor.gif', 30, 40, 'shape=actor')
      }
    }

    function addToolbarItem (graph, toolbar, prototype, image) {
      // Function that is executed when the image is dropped on
      // the graph. The cell argument points to the cell under
      // the mousepointer if there is one.
      var funct = function (graph, evt, cell, x, y) {
        graph.stopEditing(false)

        var vertex = graph.getModel().cloneCell(prototype)
        vertex.geometry.x = x
        vertex.geometry.y = y

        graph.addCell(vertex)
        graph.setSelectionCell(vertex)
      }

      // Creates the image which is used as the drag icon (preview)
      var img = toolbar.addMode(null, image, function (evt, cell) {
        var pt = this.graph.getPointForEvent(evt)
        funct(graph, evt, cell, pt.x, pt.y)
      })

      // Disables dragging if element is disabled. This is a workaround
      // for wrong event order in IE. Following is a dummy listener that
      // is invoked as the last listener in IE.
      window.mxEvent.addListener(img, 'mousedown', function (evt) {
        // do nothing
      })

      // This listener is always called first before any other listener
      // in all browsers.
      window.mxEvent.addListener(img, 'mousedown', function (evt) {
        if (img.enabled === false) {
          window.mxEvent.consume(evt)
        }
      })

      window.mxUtils.makeDraggable(img, graph, funct)

      return img
    }

    main(document.getElementById('graphContainer'))
  },
  computed: {},
  methods: {}
}
</script>
