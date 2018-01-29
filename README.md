# file-hash-calculator  
[toc]  

#简介  
该项目简单实现了多进程计算目录中文件的hash值
##修改记录  
0.0.3  
>1. 新增参数 `fileOpenLimit` 控制进程打开文件数量
>2. 修改调用参数列表，详见使用方法@0.0.3
>3. 新增参数 `algorithm` 控制计算hash的算法，默认: sha1, 支持： md5, sha256等

##使用方法@0.0.3  
1. 安装  

```
npm install file-hash-calculator@0.0.3 --save
```

2. 使用  
* 示例  

```javascript
	const fhc = require('file-hash-calculator');
	fhc(srcPath, {algorithm: 'md5'}, outputItemFormatter)
		.then(results=>{
			console.log(results);
		});
```
>输入  

* 参数说明：  
	
| 字段名        | 类型  	| 必须    |说明|
| ------------- |:-------|:---------|:----|
| srcPath     	  | {String} 	|required|源路径，要处理的文件路径|
| options      | {Object}| optional| 可选参数，调用配置项 |
| outputItemFormatter | {Function}| optional|每一个文件计算后输出格式化函数 |

* options数据格式说明  

```
{
	excludes: {String|Array}    排除的文件
	outputFilePath: {String} 结果输出的文件路径
	algorithm: {String} hash算法名，默认： "sha1"， 可选： "sha256","md5"...
	fileOpenLimit: {Number} 单进程能打开的最大文件数
}
```

* outputItemFormatter：  

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

>输出  

* {Promise}  返回promise对象，resolve the results。  

##使用方法@0.0.2  

1. 安装  

```
npm install file-hash-calculator@0.0.2 --save
```
2. 使用    

```javascript
	const fhc = require('file-hash-calculator');
	fhc(srcPath, excludes, outputFilePath, outputItemFormatter)
		.then(results=>{
			console.log(results);
		});
```
>输入  

* 参数说明：  
	
	
| 字段名        | 类型  	| 必须    |说明|
| ------------- |:-------|:---------|:----|
| srcPath     	  | {String} 	|required|源路径，要处理的文件路径|
| excludes      | {String,Array}| optional| 排除的文件 |
| outputFilePath | {String} |optional    |生成的输出文件|
| outputItemFormatter | {Function}| optional|每一个文件计算后输出格式化函数 |


* outputItemFormatter：  

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

>输出  

* {Promise}  返回promise对象，resolve the results。  


