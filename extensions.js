/*
	Developed in 2013 by William Narmontas <http://vynar.com>
	Released under the zlib license.
*/
/* 
  Copyright (C) 2013 William Narmontas <http://vynar.com/>

  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.
*/

function WilliamsD3(d3) {

	d3.selection.prototype.clone = function() {
		return this.select(cloneNode)
		function cloneNode() {
			return this.cloneNode(true)
		}
	}
	/*
	Pulls a copy of itself and its child nodes,
	whilst removing all if its original children
	*/
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

	/*
	take whatever we have in the template and use it.
	`selector` however may be a function as well!
	*/
	d3.selection.enter.prototype.cloneFrom = function(selector) {
		return this.cloneInto(cloneFrom)
		function cloneFrom() {
			var templateSource = d3.select(this).template()
			var selectorValue = typeof selector === "function" ? selector.apply(this, arguments) : selector;
			return templateSource.select(selectorValue).node()
		}
	}


	/*
	This is a powerful function here. Based on what the selector says,
	we determine which of the children of the root template will be used as a basis.
	We may not want to do that if we are removing its child elements, but we will want
	to do this if we are transitioning between a Photo and another Photo, as an example.
	*/
	d3.selection.prototype.ensureType = function(selector) {
		var parentNode = this[0].parentNode
		var parentSelection = d3.select(parentNode)
		var templateSource = parentSelection.template()
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

		var me = this;
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


	/* Take `node`, and use insert a copy of it into here. */
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

	/*
	I'm not sure we even need these any longer...
	but let's have them here anyway for the sake of completeness.
	This is where I started off at anyway.
	*/
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
}(d3)