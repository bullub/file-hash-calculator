/**
 * Created by bullub on 16/9/29.
 */
"use strict";
const path = require("path");

function loop() {return true}

module.exports = pathFilterGenerator;

/**
 * 路径过滤规则函数生成
 * @param absDir {String} 绝对路径,相当于当前遍历的根路径
 * @param excludes {Array|String} 过滤规则
 * @returns {Function} 路径过滤器
 */
function pathFilterGenerator(absDir, excludes) {
    if(!absDir || !excludes) {
        return loop;
    }

    if(typeof excludes === 'string') {
        excludes = [excludes];
    }

    let rules = [],
        absPath,
        pointExp = /\./g,
        starExp = /(\*{1,2})/g,
        isReg;
    //遍历排除列表，构造过滤规则
    for(var i = 0, len = excludes.length; i < len; i ++) {
        absPath = path.join(absDir, excludes[i]);

        //如果过滤规则中包含*通配符，则将这条规则构造成正则表达式进行处理
        isReg = absPath.indexOf("*") > 0;

        if(isReg) {
            //构造正则表达式
            absPath = absPath.replace(pointExp, '\\.')
                .replace(starExp, function(matches, $1){
                    if($1.length === 2) {
                        return ".*";
                    } else {
                        return "[^\/]*";
                    }
                });
            rules[i] = new RegExp("^" + absPath + "$", "i");
        } else {
            //当成普通字符串处理
            rules[i] = absPath;
        }
    }
    /**
     * 文件路径过滤器
     * @param fileRealPath {String} 文件真实路径，绝对路径
     */
    return function pathFilter(fileRealPath){
        let accept = true;
        for(var i = 0, len = rules.length; i < len; i ++) {

            if(typeof rules[i] === 'string') {
                //如果是一个字符串规则，则判断当前规则是否是实际路径的开始子串
                accept = fileRealPath.indexOf(rules[i]) !== 0;
            } else {
                //如果是正则表达式直接使用test方法进行匹配
                accept = !rules[i].test(fileRealPath);
            }
            //当该文件路径已被一条规则过滤掉则停止
            if(!accept) {
                break;
            }
        }
        return accept ;
    };
}