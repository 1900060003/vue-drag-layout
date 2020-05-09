<template>
  <div :class="['air-input', {'is-library': input_hasLibrary}, input_customCls]">
    <template v-if="input_hasLibrary">
      <div>Air-Input</div>
    </template>
    <template v-else>
      <div v-if="['PT','PL'].includes(input_labelPosition)" :class="['label', { 
        'AL': input_labelAlign === 'AL',
        'AR': input_labelAlign === 'AR',
        'AC': input_labelAlign === 'AC',
        'PT': input_labelPosition === 'PT',
        'PL': input_labelPosition === 'PL' }]" :style="'width:' + input_labelWidth">{{input_label}}</div>
      <div :class="['input',{'border': input_border}]">
        <div v-if="$slots.prepend" class="prepend">
          <slot name="prepend"></slot>
        </div>
        <input :type="input_type" v-model="input_val" @change="change">
        <slot name="append"></slot>
      </div>
      <div v-if="['PB','PR'].includes(input_labelPosition)" :class="['label', { 
        'AL': input_labelAlign === 'AL',
        'AR': input_labelAlign === 'AR',
        'AC': input_labelAlign === 'AC',
        'PB': input_labelPosition === 'PB',
        'PR': input_labelPosition === 'PR' }]" :style="'width:' + input_labelWidth">{{input_label}}</div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'air-input',
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
      input_customCls: this.customCls,
      input_type: this.type,
      input_border: this.border
    }
  },
  props: {
    value: {
      default: null
    },
    label: {
      type: String,
      default: 'input label'
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
      default: 'PL'
    },
    hasLibrary: {
      type: Boolean,
      default: false
    },
    customCls: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    border: {
      type: Boolean,
      default: true
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
        name: 'type',
        type: 'select',
        option: [{
          text: '文本',
          value: 'text'
        }, {
          text: '密码',
          value: 'password'
        }],
        value: this.input_type,
        fn: this.setType
      }, {
        name: 'label',
        type: 'input',
        value: this.input_label,
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
        }, {
          text: '上',
          value: 'PT'
        }, {
          text: '下',
          value: 'PB'
        }],
        value: this.input_labelPosition,
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
        value: this.input_labelAlign,
        fn: this.setLabelAlign
      }]
    }
  }
}

</script>
<style lang="scss" scoped>
@import '~style/base.scss';

.air-input {
  width: 100%;
  height: 100%;
  padding: 0 10px 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;

  .label {
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

    &.PT,
    &.PB {
      width: 100% !important;
    }

  }

  .input {
    flex: 1;
    height: 30px;
    display: flex;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    box-sizing: border-box;
    border-radius: 0px;
    border-color: $base-border-color;
    overflow: hidden;

    &.border {
      border-width: 1px;
      border-style: solid;
      border-radius: 4px;

      .prepend {
        border-right-width: 1px;
        border-right-style: solid;
        border-color: $base-border-color;
        background-color: $base-fill-color;
      }
    }

    .prepend {
      line-height: 29px;
      padding: 0 10px;
      color: $base-font-color;
    }

    input {
      height: 28px;
      flex: 1;
      border: none;
      outline: none;
      padding: 0 10px;
      color: $base-font-color;
    }
  }
}

</style>
