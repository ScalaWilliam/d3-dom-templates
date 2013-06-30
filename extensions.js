
d3.selection.prototype.clone = function() {
	return this.select(cloneNode)
	function cloneNode() {
		return this.cloneNode(true)
	}
}
/* Pulls a copy of itself and its child nodes,
whilst removing all if its original children */
d3.selection.prototype.template = function(storage) {
	if ( !storage ) storage = "__template__"
	return this.select(makeTemplate)
	function makeTemplate() {
		// memoized
		if ( storage in this )
			return this[storage]
		
		// assign some relationships
		var clone = this.cloneNode(true)
		clone.__original__ = this
		this.__template__ = clone

		// remove original's child nodes - all of them
		while (this.childNodes.length)
			this.removeChild(this.childNodes[0])

		return clone
	}
}
// take whatever we have in the template and use it.
// selector however may be a function itself!
d3.selection.enter.prototype.cloneFrom = function(selector) {
	return this.cloneInto(cloneFrom)
	function cloneFrom() {
		var templateSource = d3.select(this).template()
		var selectorValue = typeof selector === "function" ? selector.apply(this, arguments) : selector;
		return templateSource.select(selectorValue).node()
	}
}
d3.selection.prototype.ensureType = function(selector) {
	var parentSelection = d3.select(this.parentNode)
	var templateSource = parentSelection.template()
	return this.select(ensureType)
	function ensureType() {
		if ( !this ) {
			
		}

		var selectorValue = typeof selector === "function" ? selector.apply(this, arguments) : selector
		var matches = d3.select(this).filter(selectorValue).empty()
		if ( matches ) return

		var newNode = templateSource.select(selectorValue).clone().node()
		this.parentNode.appendChild()
		



		d3.select(this)
		var newNode = d3.select(this.parentNode).cloneFrom(selector)

		d3.select(this).remove()
		return newNode
	}
}
d3.selection.enter.prototype.cloneInto = function(node) {
	return this.select(typeof node === "function" ? nodeFunction : nodeConstant)
	function nodeConstant() {
		return cloneAppendNode.call(this, node)
	}
	function nodeFunction() {
		return cloneAppendNode.call(this, node.apply(this, arguments))
	}
	function cloneAppendNode(node) {
		if ( node ) return this.appendChild(node.cloneNode(true))
	}
}

/* I'm not sure we even need these any longer... */
d3.selection.enter.prototype.clonePrepend = function(name) {
	var name = d3.ns.qualify(name);
	return this.select(function() {
	var cloneNode = this.querySelector(name);
		if (!cloneNode)
			return null;
		var newNode = cloneNode.cloneNode(true);
		cloneNode.parentNode.insertBefore(newNode, cloneNode);
		return newNode;
	});
}

d3.selection.enter.prototype.cloneAppend = function(name) {
	var name = d3.ns.qualify(name);
	return this.select(function() {
		var cloneNode = this.querySelector(name);
		if (!cloneNode)
			return null;
		var newNode = cloneNode.cloneNode(true);
		cloneNode.parentNode.insertBefore(newNode, cloneNode.nextSibling);
		return newNode;
	});
}