# Flex

A fluid asymmetrical animated grid plugin for jQuery

Flex is an idea inspired by the old flash homepage on Adidas.com. Searching google for anything that resembled that effect, lead me to a few plugins that were similar, but not the same. Saw one person say it was ["quite impossible"](http://stackoverflow.com/questions/1945164/how-to-make-silde-like-homepage-of-adidas-com-with-jquery), thought it would be a fun challenge.

[View Demo](http://jsonenglish.com/projects/flex/)

![Screenshot](http://cl.ly/192S1E0s3B0O3E2P2E1C/ss%202012-07-07%20at%204.11.40%20AM.png)

## How to use

Include the plugin after jQuery in your file

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="https://raw.github.com/jasonenglish/jquery-flex/master/jquery.flex.js"></script>
```

Create the structure of your tiles by individually placing them. As of right now it is expected each tile will be placed 10px away from each other as padding (this is to be resolved in issue #4)

```html
<div class="flex">
    <a bg="a" style="left:0px;top:0px;width:250px;height:125px;" width="325" height="175">A</a>
    <a bg="b" style="left:260px;height:100px;top:0px;width:125px;" width="250" height="175">B</a>
    <a bg="c" style="left:395px;height:250px;top:0px;width:75px;" width="125" height="350">C</a>
    <a bg="d" style="left:480px;height:75px;top:0px;width:75px;" width="175" height="150">D</a>
    <a bg="e" style="left:565px;height:125px;top:0px;width:200px;" width="200" height="250">E</a>
    <a bg="f" style="left:480px;height:200px;top:85px;width:75px;" width="150" height="225">F</a>
    <a bg="g" style="left:0px;height:100px;top:135px;width:75px;" width="305" height="150">G</a>
    <a bg="h" style="left:260px;height:75px;top:110px;width:125px;" width="200" height="200">H</a>
    <a bg="i" style="left:85px;height:140px;top:135px;width:165px;" width="200" height="140">I</a>
    <a bg="j" style="left:565px;height:150px;top:135px;width:75px;" width="125" height="275">J</a>
    <a bg="k" style="left:650px;height:75px;top:135px;width:75px;" width="75" height="200">K</a>
</div>
```

Sample styling

```html
<style>
    .flex {position:relative;width:850px;min-height:300px;margin:0 auto;border:0px solid red;margin-top:10px;}
    .flex a {background-color:white;display:block;width:100px;height:100px;border-radius:8px;position:absolute;background-repeat:no-repeat;background-position:center;border:3px solid white;cursor:pointer;text-align:left;text-shadow:1px 1px 20px #000;color:white;font-size:18px;font-weight:bold;text-indent:10px;line-height:30px;}
    [bg=a] {background-image:url(http://farm8.staticflickr.com/7013/6448917381_0b754e86fb_z.jpg);}
    [bg=b] {background-image:url(http://farm9.staticflickr.com/8156/7362866426_bf285ebd45.jpg);background-size:300px auto;}
    [bg=c] {background-image:url(http://farm6.staticflickr.com/5117/7410370290_0935419fc3.jpg);}
    [bg=d] {background-image:url(http://farm8.staticflickr.com/7262/7419245080_bb752ed1d6.jpg);}
    [bg=e] {background-image:url(http://farm8.staticflickr.com/7003/6468321069_3375be3073_z.jpg);background-size:auto 280px;}
    [bg=f] {background-image:url(http://farm8.staticflickr.com/7220/7342556872_46cddaf9b0.jpg);background-size:auto 280px;}
    [bg=g] {background-image:url(http://farm9.staticflickr.com/8021/7322604950_348c535903.jpg);background-size:auto 200px;}
    [bg=h] {background-image:url(http://farm8.staticflickr.com/7076/7286717012_6e6b450243.jpg);}
    [bg=i] {background-image:url(http://farm8.staticflickr.com/7129/7452167788_a3f6aa3104.jpg);background-size:auto 200px;}
    [bg=j] {background-image:url(http://farm8.staticflickr.com/7153/6480022425_a8d419e663_z.jpg);background-size:auto 280px;}
    [bg=k] {background-image:url(http://farm8.staticflickr.com/7225/7269592732_c4b7918626.jpg);background-size:auto 280px;}
</style>
```

And finally, invoke the plugin

```html
<script type="text/javascript">
    $(function() {
        $(".flex").flex();
    });
</script>
```

## What's next - 0.3

- Bounding container (issue #1)
- Padding (issue #4)


## Contributing

Any help is greatly appreciated. Pull away.
