Demo = function(d3) {
	
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

function Demo(window) {
	d3.select('#move-around').on('click', this.clicker())
	this.colterationI = 0;

	this.typeMap = this.createTypeMap()

	var a = new this.Movie("The Fountainhead"),
		b = new this.Book("Atlas Shrugged"),
		c = new this.Photo("The Big Ben"),
		d = new this.Movie("Wedding Crashers"),
		e = new this.Photo("Heron Tower"),
		f = new this.Book("The Visual Display of Quantitative Information")
	this.itemsGroups = [
		[a,b], [a,c,d,f], [a,b,c,d,e], [a,d,e,f], [a,c,b,d,e,f]
	]
}
Demo.prototype.createTypeMap = function() {
	var map = [
		{type: this.Movie, selector: 'li.movie'},
		{type: this.Photo, selector: 'li.picture'},
		{type: this.Book,  selector: 'li.book'}
	]
	return this.typeTemplateMapper(map);
}
Demo.prototype.begin = function() {
	this.biteration = 0;
	return this.iterate()
}
Demo.prototype.clicker = function() {
	var me = this
	return function() {
		me.iterate()
	}
}
Demo.prototype.iterate = function() {
	var itemsGroups = this.itemsGroups,
		group = itemsGroups[this.biteration++ % itemsGroups.length]
	this.renderData(group, this.typeMap)
}
var counter = 0;

Demo.prototype.Movie = function(title) { this.title = title; this.counter = counter++ }
Demo.prototype.Book  = function(title) { this.title = title; this.counter = counter++ }
Demo.prototype.Photo = function(title) { this.title = title; this.counter = counter++ }

Demo.prototype.colterations = function(number) {
	var items = ['red', 'green', 'yellow', 'pink'];
	return items[number % items.length]
}
/* Map item types (Movie/Book/Photo) to the template selector */
Demo.prototype.typeTemplateMapper = function(map, def) {
	return function(data) {
		for ( var i = 0; i < map.length; i++ ) {
			if ( is(map[i].type)(data) )
				return map[i].selector
		}
		return def
	}
}

Demo.prototype.renderData = function(items, typeMap) {
	var ul = d3.select("ul")

	// has side effects on ul - of course!
	// and it's NOT OPTIONAL! :-) since the DOM is not updated in time..
	ul.template()
	
	var d = ul.selectAll("li").data(items, res('title')).ensureType(typeMap)
	
	var e = d.enter().cloneFrom(typeMap)
	
	e.select('p').style('background', 'blue')
	
	d.exit().remove()

	d.select('h2 span').text(res('title'));
	d.select('p').text(res('counter'));
	/* Change colours around to prove that there is the d3 constancy in action. */
	var colour = this.colterations(this.colterationI++)
	d.select('p').transition().duration(3000).style('background', colour)
	d.sort(function(a, b) {
		return d3.ascending(a.title, b.title)
	}).order();
	return d
}

return Demo;


}(d3);