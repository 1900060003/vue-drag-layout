<template>
  <div :class="['air-checkbox', {'is-library': input_hasLibrary}, input_customCls]">
    <template v-if="input_hasLibrary">
      <div>Air-CheckBox</div>
    </template>
    <template v-else>
      <div v-if="['PT','PL'].includes(input_labelPosition)" :class="['label', { 
        'AL': input_labelAlign === 'AL',
        'AR': input_labelAlign === 'AR',
        'AC': input_labelAlign === 'AC',
        'PL': input_labelPosition === 'PL' }]" :style="'width:' + input_labelWidth">{{input_label}}</div>
      <input type="checkbox" v-model="input_val" @change="change">
      <div v-if="['PB','PR'].includes(input_labelPosition)" :class="['label', { 
        'AL': input_labelAlign === 'AL',
        'AR': input_labelAlign === 'AR',
        'AC': input_labelAlign === 'AC',
        'PR': input_labelPosition === 'PR' }]" :style="'width:' + input_labelWidth">{{input_label}}</div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'air-checkbox',
  customizationSize: {
    width: 3,
    height: 1,
    maxWidth: Infinity,
    maxHeight: 1
  },
  data() {
    return {
      layout: null,
      input_val: this.value,
      input_label: this.label,
      input_labelWidth: this.labelWidth,
      input_labelAlign: this.labelAlign,
      input_labelPosition: this.labelPosition,
      input_hasLibrary: this.hasLibrary,
      input_customCls: this.customCls
    }
  },
  props: {
    value: {
      default: null
    },
    label: {
      type: String,
      default: 'checkbox label'
    },
    labelWidth: {
      default: '90px'
    },
    labelAlign: {
      type: String,
      default: 'AC'
    },
    labelPosition: {
      type: String,
      default: 'PR'
    },
    hasLibrary: {
      type: Boolean,
      default: false
    },
    customCls: {
      type: String,
      default: ''
    }
  },
  methods: {
    change(val) {},
    setType(e) {
      this.input_type = e.target.value
    },
    setLabel(e) {
      this.input_label = e.target.value
    },
    setLabelPosition(e) {
      this.input_labelPosition = e.target.value
      if (this.input_labelPosition === 'PB' || this.input_labelPosition === 'PT') {
        this.layout.h = 2
        this.layout.maxH = 2
      } else {
        this.layout.h = 1
        this.layout.maxH = 1
      }
    },
    setLabelAlign(e) {
      this.input_labelAlign = e.target.value
    },
    getCustomizationConfig(layout) {
      this.layout = layout
      return [{
        name: 'label',
        type: 'input',
        fn: this.setLabel
      }, {
        name: 'label position',
        type: 'select',
        option: [{
          text: '左',
          value: 'PL'
        }, {
          text: '右',
          value: 'PR'
        }],
        fn: this.setLabelPosition
      }, {
        name: 'label align',
        type: 'select',
        option: [{
          text: '左',
          value: 'AL'
        }, {
          text: '右',
          value: 'AR'
        }, {
          text: '居中',
          value: 'AC'
        }],
        fn: this.setLabelAlign
      }]
    }
  }
}

</script>
<style lang="scss" scoped>
@import '~style/base.scss';

.air-checkbox {
  width: 100%;
  height: 100%;
  padding: 0 10px 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;

  .label {
    flex: 1;
    line-height: 30px;
    color: $base-font-color;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.AL {
      text-align: left;
    }

    &.AR {
      text-align: right;
    }

    &.AC {
      text-align: center;
    }

  }

  input {
    width: 20px;
    border: none;
    outline: none;
    padding: 0 10px;
    color: $base-font-color;
    margin: 10px 0 0 5px;
  }
}

</style>
