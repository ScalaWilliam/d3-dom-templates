
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
// binding by key is fine - since a certain key will most certainly
// have the same kind of type
// but when we have a numeric key, that's where it gets dirty.
d3.selection.prototype.ensureType = function(selector) {
	var parentNode = this[0].parentNode
	var parentSelection = d3.select(parentNode)
	var templateSource = parentSelection.template()
	var me = this;
	this.select(ensureType)
	return this
	function replaceNode(selector) {
		var newNode = templateSource.select(selector).clone().node()
		if ( this && this.parentNode && this.parentNode === parentNode ) {
			parentNode.insertBefore(newNode, this)
			parentNode.removeChild(this)
		} else {
			parentNode.appendChild(newNode)
		}
		return newNode
	}
	function selectorValue() {
		return typeof selector === "function" ? selector.apply(this, arguments) : selector
	}
	function ensureType(data, i) {
		var selector = selectorValue.apply(this, arguments)
		var matches = !d3.select(this).filter(selector).empty()
		var node = this
		if ( !matches ) {
			node = replaceNode.call(this, selector)
			node.__data__ = data;
			me[0][i] = node
		}
		return node
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