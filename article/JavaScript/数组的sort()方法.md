```javascript
 var arr = [10, 5, 13, 32, 21, 8, 83];
       arr.sort((x, y) =>{
        // return x - y // 这个时候 就是升序
        return y - x // 这个时候 就是降序
       })
       console.log(arr);
```

- 当`function(x, y)`得到的返回值（也就是return得到的值）`<0` 

x会被移到y前面 

- 当`function(x, y)`得到的返回值（也就是return得到的值）`>0` 

x会被移到y后面面 

- 当`function(x, y)`得到的返回值（也就是return得到的值）`===0` 

x和y的位置就是相对不变