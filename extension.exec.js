
counter = 0;
function Movie(title) { this.title = title; this.counter = counter++ }
function Photo(title) { this.title = title; this.counter = counter++ }
function Book(title) { this.title = title; this.counter = counter++ }
var items = [
	new Movie('Matrix'),
	new Book('Atlas Shrugged'),
	new Photo('Virgins'),
	new Movie('Minority Report')
]
function res(x) {
	return function(y) {
		return y[x]
	}
}
function mine(x) {
	return function() {
		return this[x]
	}
}
function is(a) {
	return function(x) {
		return x instanceof a
	}
}
function typeTemplateMapper(map, def) {
	return function(data) {
		for ( var i = 0; i < map.length; i++ ) {
			if ( is(map[i].type)(data) )
				return map[i].selector
		}
		return def
	}
}

var typeMap = typeTemplateMapper([
	{type: Movie, selector: 'li.movie'},
	{type: Photo, selector: 'li.picture'},
	{type: Book,  selector: 'li.book'}
]);
var iteration = 0
iterations = ['red', 'green', 'yellow', 'pink']
function renderData(items, typeMap) {
	var ul = d3.select("ul")

	// has side effects on ul - of course!
	// and it's NOT OPTIONAL! :-) since the DOM is not updated in time..
	ul.template()
	
	var d = ul.selectAll("li").data(items, function(d) { return d.title; } ).ensureType(typeMap)
	var e = d.enter().cloneFrom(typeMap)
	e.select('p').style('color', 'blue')

	d.exit().remove()
	
	//debugger;

	d.select('h2 span').text(res('title'));
	d.select('p').text(res('counter'));
	d.select('p').transition().duration(5000).style('color', iterations[iteration++])
	d.sort(function(a, b) {
		return d3.ascending(a.title, b.title)
	}).order();
	return d
}
renderData(items, typeMap);
items.shift();
items.unshift(new Book('Motherfucker'))
//items[0].counter = -5
items.pop();
items.push(new Movie('trololol'))
items.push(new Movie('Brololol'))