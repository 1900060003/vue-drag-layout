<template>
  <div class="library">
    <div class="widget-layout">
      <component class="widget-item" v-for="(item, index) in widgetCmps" :is="item.widgetName" :key="'widget-item-' + index" hasLibrary :component-name="item.widgetName" :widget-width="item.widgetWidth" :widget-height="item.widgetHeight" :widget-max-width="item.widgetMaxWidth" :widget-max-height="item.widgetMaxHeight"></component>
    </div>
    <grid-layout ref="views-layout" class="views-layout" :layout.sync="viewsLayout" :col-num="colNum" :row-height="rowHeight" :margin="colMargin" :verticalCompact="false">
      <grid-item v-for="item in viewsLayout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :minW="item.minW" :minH="item.minH" :maxW="item.maxW" :maxH="item.maxH" :key="item.i" @dblclick.native="getWidgetItem(item, $event)">
        <component :ref="'widget-item-' + item.i" :is="item.componentName"></component>
      </grid-item>
    </grid-layout>
    <div class="attributes-layout">
      <template v-if="attributesLayout">
        <div v-for="(attributes,index) of attributesLayout.config" :key="'attributes-cmp-' + index">
          <label>{{attributes.name}}</label>
          <select v-if="attributes.type === 'select'" @change="attributes.fn($event)">
            <option v-for="(option, optionIndex) of attributes.option" :key="'attributes-cmp-' + index + '-item-' + optionIndex" :value="option.value" :label="option.text"></option>
          </select>
          <input v-if="attributes.type === 'input'" @change="attributes.fn($event)" />
        </div>
        <button @click="attributesLayout.remove">Remove</button>
      </template>
      <div v-else>双击组件可编辑</div>
    </div>
  </div>
  </div>
</template>
<script>
import interact from 'interactjs'
import container from '@/components/container'
import widget from '@/components/widget'
import merge from '@/utils/merge'
import VueGridLayout from 'vue-grid-layout'
export default {
  data() {
    return {
      rowHeight: 40,
      colNum: 12,
      colMargin: [0, 0],
      defaultGridW: 2,
      defaultGridH: 1,
      maxRows: Infinity,
      viewsLayout: [],
      attributesLayout: null
    }
  },
  computed: {
    widgetCmps() {
      return Object.getOwnPropertyNames(widget).map(e => {
        return {
          widgetName: e,
          widgetWidth: widget[e].customizationSize.width,
          widgetHeight: widget[e].customizationSize.height,
          widgetMaxWidth: widget[e].customizationSize.maxWidth,
          widgetMaxHeight: widget[e].customizationSize.maxHeight
        }
      })
    }
  },
  name: 'Library',
  components: merge({
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }, widget),
  methods: {
    getWidgetItem(item, event) {
      var _this = this;
      document.querySelectorAll('.vue-grid-item.outline').forEach(e => {
        e.classList.remove('outline')
      })
      event.target.offsetParent.classList.add('outline')
      this.attributesLayout = {
        remove() {
          _this.viewsLayout.splice(_this.viewsLayout.map(e => e.i).indexOf(item.i), 1)
          _this.attributesLayout = null
        },
        config: this.$refs[('widget-item-' + item.i)][0].getCustomizationConfig(this.viewsLayout.filter(e => e.i === item.i)[0])
      }
    },
    calcXY(top, left) {
      const colWidth = this.calcColWidth()
      let x = Math.round((left - this.colMargin[0]) / (colWidth + this.colMargin[0]))
      let y = Math.round((top - this.colMargin[1]) / (this.rowHeight + this.colMargin[1]))
      x = Math.max(Math.min(x, this.colNum - this.defaultGridW), 0)
      y = Math.max(Math.min(y, this.maxRows - this.defaultGridH), 0)
      return { x, y }
    },
    calcColWidth() {
      return (this.$refs['views-layout'].$children[0].containerWidth - (this.colMargin[0] * (this.colNum + 1))) / this.colNum
    },
    initComponentDrag() {
      let _this = this
      let entered = false
      let { x: viewX, y: viewY } = this.$refs['views-layout'].$el.getBoundingClientRect()
      let copyDragCmpItem = null
      let movingGridDeltaY = 0
      let i = 0
      let x = 0
      let y = 0
      let position = { x: 0, y: 0 }
      interact('.widget-item').draggable({
        listeners: {
          start(e) {
            copyDragCmpItem = e.target.cloneNode(true)
            copyDragCmpItem.classList.add('copy-item')
            e.target.appendChild(copyDragCmpItem)
            movingGridDeltaY = event.target.getBoundingClientRect().y
          },
          move(e) {
            position.x += e.dx
            position.y += e.dy
            copyDragCmpItem.style.transform = `translate(${position.x}px, ${position.y}px)`
            let { x: _x, y: _y } = (_this.calcXY(position.y + movingGridDeltaY - viewY, position.x - viewX))
            x = _x
            y = _y
            if (entered) {
              let currentDragGridData = _this.viewsLayout[_this.viewsLayout.length - 1]
              currentDragGridData.x = x
              currentDragGridData.y = y
              _this.$refs['views-layout'].eventBus.$emit("dragEvent", 'dragmove', i, x, y, +copyDragCmpItem.getAttribute('widget-height') || _this.defaultGridH, +copyDragCmpItem.getAttribute('widget-width') || _this.defaultGridW)
            }
          },
          end(e) {
            if (!entered) {
              _this.viewsLayout.splice(_this.viewsLayout.length - 1, 1)
            }
            _this.$refs['views-layout'].isDragging = false
            e.target.removeChild(copyDragCmpItem)
            copyDragCmpItem = null
            movingGridDeltaY = 0
            position = { x: 0, y: 0 }
            x = 0
            y = 0
            i++
          }
        }
      })
      interact('.views-layout').dropzone({
        accept: '.widget-item',
        ondropactivate(e) {
          e.target.classList.add('drop-active')
        },
        ondragenter(e) {
          entered = true
          copyDragCmpItem.classList.add('hidden')
          if (!_this.viewsLayout.some(e => e.i === i)) {
            _this.viewsLayout.push({
              x: x,
              y: y,
              w: +copyDragCmpItem.getAttribute('widget-width') || _this.defaultGridW,
              h: +copyDragCmpItem.getAttribute('widget-height') || _this.defaultGridH,
              i: i,
              minW: +copyDragCmpItem.getAttribute('widget-width') || 1,
              minH: +copyDragCmpItem.getAttribute('widget-height') || 1,
              maxW: +copyDragCmpItem.getAttribute('widget-max-width') || 1,
              maxH: +copyDragCmpItem.getAttribute('widget-max-height') || 1,
              componentName: copyDragCmpItem.getAttribute('component-name')
            })
          }

        },
        ondragleave(e) {
          entered = false
          copyDragCmpItem.classList.remove('hidden')
        },
        ondrop() {
          entered = false
        },
        ondropdeactivate(e) {
          e.target.classList.remove('drop-active')
        }
      })
    }
  },
  mounted() {
    this.initComponentDrag()
  }
}

</script>
<style lang="scss" scoped>
.library {
  width: 100%;
  padding: 10px 0;
  display: flex;
  background-color: #DCDFE6;

  .widget-layout {
    height: 100% !important;
    width: 200px;

    .widget-item {
      line-height: 30px;
      height: 30px;
      position: relative;

      >.widget-item.copy-item {
        position: absolute;
        width: 100%;
        top: 0;
        background-color: rgba(0, 0, 0, .2);
        user-select: none;

        &.hidden {
          display: none;
        }
      }
    }
  }

  .views-layout {
    height: 100% !important;
    background-color: #FFFFFF;
    flex: 1;

    &.drop-active {
      outline: 1px dashed #409EFF;
    }

    .vue-grid-item {
      overflow: hidden;

      &.outline {
        outline: 1px dashed rgba(0, 0, 0, .5);
      }
    }

    ::v-deep .vue-grid-item.vue-grid-placeholder {
      background-color: rgba(0, 0, 0, .5);
      box-shadow: 2px 2px 6px rgba(0, 0, 0, .5)
    }
  }

  .attributes-layout {
    height: 100% !important;
    width: 300px;
  }
}

</style>
