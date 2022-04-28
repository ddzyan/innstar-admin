<template>
  <div class="digital">
    <div class="box-item">
      <li v-for="(item, index) in orderNum" :key="index" :class="{ 'number-item': !isNaN(item), 'mark-item': isNaN(item) }">
        <span v-if="!isNaN(item)">
          <i :id="`numberItem${index}`" :ref="`numberItem${index}`">0123456789</i>
        </span>
        <span v-else class="comma">{{ item }}</span>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'
export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  props: ['numm', 'numLen'],
  setup(props) {
    const { numm, numLen } = toRefs(props)

    const orderNum = ref<any>([])

    // 处理数字
    // numm: 传入的数字  numLen: 默认显示几位数
    const toOrderNum = (num: string) => {
      num = num.toString()
      if (num.length < numLen.value) {
        num = '0' + num // 如未满定义的位数，添加"0"补位
        toOrderNum(num) // 递归添加"0"补位
      } else if (num.length === numLen.value) {
        orderNum.value = num.split('') // 将其便变成数据，渲染至滚动数组
      } else {
        // 数字超过八位显示异常
        // this.$message('数字过大，显示异常')
      }
    }
    toOrderNum(numm.value)
    watch(numm, (newVal: any) => {
      toOrderNum(newVal)
    })
    return {
      orderNum,
      toOrderNum,
    }
  },
  // 如果中途数据有更新，重新执行动画
  watch: {
    numm() {
      this.setNumberTransform()
    },
  },
  mounted() {
    setTimeout(() => {
      this.setNumberTransform()
    }, 200)
  },
  methods: {
    setNumberTransform() {
      // 结合CSS 对数字字符进行滚动,显示数量
      for (let index = 0; index < this.orderNum.length; index++) {
        const ele: any = this.$refs[`numberItem${index}`]
        ele.style.transform = `translate(-50%, -${this.orderNum[index] * 10}%)`
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.digital {
  margin-right: 8px;
  .box-item {
    position: relative;
    font-size: 54px;
    line-height: 41px;
    text-align: center;
    list-style: none;
    /* color: #2D7CFF; */
    writing-mode: vertical-lr;
    text-orientation: upright;
    /*文字禁止编辑*/
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    /* overflow: hidden; */
  }
  /*滚动数字设置*/
  .number-item {
    width: 40px;
    height: 68px;
    /* color: #0FDAFF; */
    font-family: DSDIG; //使用自定义字体
    list-style: none;
    margin-right: 3px;
    /* background: rgba(6,27,114,.7); */
    border-radius: 4px;
    /* box-shadow: 0px 0px 3px 0px #01072E; */
    /* border: 1px solid #0FDAFF; */
    /* border-image: linear-gradient(#0FDAFF,#0D278E) 1 1; */
    & > span {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 100%;
      height: 100%;
      writing-mode: vertical-rl;
      text-orientation: upright;
      overflow: hidden;
      & > i {
        font-style: normal;
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translate(-50%, 0);
        transition: transform 1s ease-in-out;
        letter-spacing: 10px;
      }
    }
  }
  .number-item:last-child {
    margin-right: 0;
  }
}
</style>
