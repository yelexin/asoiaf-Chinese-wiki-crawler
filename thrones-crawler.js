var http = require('http')
var _ = require('underscore')
var cheerio = require('cheerio')
function filter(html) {
	//console.log(html)
	var $ = cheerio.load(html)
	var appearance, history
	var label = $('.pi-data-label')
	var value = $('.pi-data-label').next()
	var prop = {}
	for(var i = 0; i < label.length; i++) {
		prop[($(label.get(i)).text())]=$(value.get(i)).text()
	}
	$('aside').remove()
	$('figure').remove()
	$('img').remove()
	$('dl').remove()
	$('nav').remove()
	var title = $('h2')
	//var aside = $('#mw-title-text aside')
	//var brief
	var briefctx=$('#mw-content-text').find('p')[0];
	var briefctx2=$(briefctx).nextUntil('h2')
	var brief = $(briefctx).text() + briefctx2.text()
	title.each(function(i){
		var item = $(this)
		if(item.text().indexOf('外貌')>=0) {
			var ctx = item.nextUntil('h2')
			appearance=ctx.text()
		} else if(item.text().indexOf('历史')>=0) {
			var ctx = item.nextUntil('h2')
			history=ctx.text()
		}
	})
	var obj = {
		appearance: appearance,
		history: history,
		brief: brief
	}
	var character = _.extend(obj, prop)
	var json_str = JSON.stringify(character)
	console.log(json_str)

}
function filterForLinks(html) {
	var $ = cheerio.load(html)
	var pre = 'http://zh.asoiaf.wikia.com'
	var paths = $('#mw-pages tr[valign=top] a')
	var links;
	for(var i =0; i < paths.length; i++) {
		links = pre + $(paths[i]).attr('href')
	//	console.log(links)
		http.get(links, function(res){
			res.setEncoding('utf8');
			var html = ''
			res.on('data', function(data) {
				html += data
			})
			res.on('end', function() {
				filter(html)
			}).on('error', function() {
				console.log('error')
			})
		})
	}

}
var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var arr = s.split('');
for(var i =0; i < arr.length; i++) {
	var urls='http://zh.asoiaf.wikia.com/wiki/Category:%E4%BA%BA%E7%89%A9?from='+arr[i];
//	console.log(urls)
	http.get(urls, function(res) {
		res.setEncoding('utf8');
		var html = ''
		res.on('data', function(data) {
			html += data
		})
		res.on('end', function() {
			filterForLinks(html)
		})
	}).on('error', function() {
		console.log('error')
	})
}
/*
http.get(url, function(res) {
	var html = ''
	res.on('data', function(data) {
		html += data
	})
	res.on('end', function() {
		filter(html)
	})
}).on('error', function() {
	console.log('error')
})
*/
