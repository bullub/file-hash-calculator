# file-hash-calculator
###简介
该项目简单实现了多进程计算目录中文件的hash值

###使用方法

1. 安装
	
	```
	npm install file-hash-calculator --save
	```
2. 使用

	```javascript
		const fhc = require('file-hash-calculator');
		fhc(srcPath, excludes, outputFilePath, outputItemFormatter)
			.then(results=>{
				console.log(results);
			});
	```

	>参数说明：
	
	| 字段名        | 类型  	| 必须    |说明|
| ------------- |:-------|:---------|:----|
| srcPath     	  | {String} 	|required|源路径，要处理的文件路径|
| excludes      | {String,Array}| optional| 排除的文件 |
| outputFilePath | {String} |optional    |生成的输出文件|
| outputItemFormatter | {Function}| optional|每一个文件计算后输出格式化函数 |

> outputItemFormatter默认：
	
```javascript
/**
 * 默认的格式化单个文件信息的内容
 * @param item {Object} 单个文件的信息
 * @returns {string} 返回单行路径，hash值,文件长度
 */
function defaultOutPutItemFormatter(item) {
    return `${item.path},${item.hash},${item.size}\n`;
}
```

