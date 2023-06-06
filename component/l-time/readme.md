# l-time
### 完整示例可导入示例项目运行


## 使用说明
|	 属性	 | 是否必填 	|  		值类型		  |		默认值 	| 		说明					|
| ---------- | :------: | ------------------: | ----------: | --------------------: 	|
| 	 text	 |	是  	  	| [String,Number,Date]|	必传 		| 要转换的日期时间			|
| isCompute	 |	否 	  	| 	 Boolean	 	  |	true		| 是否计算					|
| computeMax |	否 	  	| 	 Boolean	 	  |	'hh'		| 指定范围内持续计算,范围：[MM,dd,hh,mm,ss]	|
| dateFormat |	否 	  	| 	 'yyyy-MM-dd' 	  |	'yyyy-MM-dd'| 返回日期格式				|
| currentYear|	否 	  	| 	 'yyyy-MM-dd' 	  |	'yyyy-MM-dd'| 当前年日期格式				|
| maxDate	 |	否 	  	| 	 Boolean 	 	  |	false		| 是否显示大于当前时间日期		|
| size		 |	否 	  	| 	 [Number,String]  |	24			| 字体大小(rpx)				|
| color		 |	否 	  	| 	 String			  |	#000		| 字体颜色					|
| customStyle|	否 	  	| 	 Object			  |	-			| 自定义样式					|

### vue:
``` javascript
<view v-for="(d,index) in list" :key="index">
	<l-time :text="d.time"></l-time>
</view>
```

### js：
``` javascript
import lTime from "@/components/l-time/l-time.vue";
components:{lTime}
```
---
* 示例


``` javascript
import lTime from "@/components/l-time/l-time.vue";
export default {
	components:{lTime},
	data() {
		return {
			list: []
		}
	},
	onLoad() {
		
		this.list.push({
			time: '2020/05/07 22:11:11'
		});
		
		this.list.push({
			time: '2020-05-09 15:47:11'
		});
		
		let date = new Date();
		
		this.list.push({
			time: new Date(new Date().setMinutes(date.getMinutes() - 2)).pattern('yyyy-MM-dd HH:mm:ss')
		});
		
		this.list.push({
			time: date.pattern('yyyy-MM-dd HH:mm:ss')
		});
		
		this.list.push({
			time: date
		});
		
		this.list.push({
			time: date.getTime()
		});
		
	},
	methods: {

	}
}


```