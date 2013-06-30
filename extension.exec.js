
function Movie(title) { this.title = title; }
function Photo(title) { this.title = title; }
function Book(title) { this.title = title; }
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

function renderData(items, typeMap) {
	var ul = d3.select("ul")
	// has side effects on ul - of course!
	ul.template()
	// and it's NOT OPTIONAL! :-) since the DOM is not updated in time..
	var d = ul.selectAll("li").data(items)
	var e = d.enter()
	d.exit().remove()
	e.cloneFrom(typeMap)
	d.ensureType(typeMap)
	d.select('h2 span').text(res('title'));
	/*d.sort(function(a, b) {
		return d3.ascending(a.title, b.title)
	}).order();*/
}
renderData(items, typeMap);
items.shift();
items.unshift(new Book('Motherfucker'))
items.pop();
items.push(new Movie('trololol'))
items.push(new Movie('Brololol'))