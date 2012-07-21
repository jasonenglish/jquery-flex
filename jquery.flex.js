/* jshint trailing:true jquery:true browser:true curly:false */
/**
 * jQuery Flex v0.2
 * A fluid asymmetrical animated grid plugin for jQuery
 * http://jsonenglish.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 Jason English
 */
;(function ( $, undefined ) {
	
	"use strict";

	// Create the defaults once
	var defaults = {
		duration: 300,
		padding: 10,
		threshhold: 50
	};

	function Flex(element, options) {
		this.version = '0.2';
		this.element = $(element);
		this.tiles = this.element.find("a");
		this.options = $.extend({},defaults,options);
		this.list = [];
		this.cache = [];
		
		this.init();
	}
	
	Flex.prototype.init = function() {
		this.buildCache();
		this.createEvents();
	};
	
	// creates an object that is our cache of def the
	// properties we need
	Flex.prototype.createCacheObj= function(el) {
		return {
			elm: el,
			defaults: {
				width: el.width(),
				height: el.height(),
				left: parseInt(el.css("left"),10),
				top: parseInt(el.css("top"),10)
			},
			expanded: {
				width: parseInt(el.attr("width"),10),
				height: parseInt(el.attr("height"),10),
				left: parseInt(el.css("left"),10),
				top: parseInt(el.css("top"),10)
			}
		};
	};
	
	
	Flex.prototype.buildCache = function() {
		var tiles = this.tiles,
			tile,
			len = tiles.length;
		
		for(var x = 0; x < len;x++) {
			tile = $(tiles[x]);
			this.list.push( this.createCacheObj( tile ) );
			this.cache[x] = this.list[this.list.length-1];
			tile.data("flex-cache",x);
		}
	};
	
	Flex.prototype.createEvents = function() {
		var self = this;
		this.tiles
			.on('mouseenter', function(){
				self.change(this);
				self.animate('grow');
			})
			.on('mouseleave', function(){
				self.animate('shrink');
			});
	};
	
	Flex.prototype.getCache = function(el) {
		return this.cache[$(el).data("flex-cache")];
	};
	
	Flex.prototype.animate = function(dir) {
		var options = { queue: false, duration: 300 },
			x = 0;
		if (dir === 'grow') {
			for(; x < this.changes.length; x++) {
				this.changes[x].elm.dequeue().animate( this.changes[x].change, options );
			}
		} else {
			for(; x < this.list.length; x++) {
				this.list[x].elm.dequeue().animate( this.list[x].defaults, options );
				delete this.list[x].change;
				delete this.list[x].start;
				delete this.list[x].adjusted;
			}
		}
	};
	
	Flex.prototype.getPositions = function(d) {
		return [ [ d.left, (d.left + d.width) ], [ d.top, d.top + d.height ] ];
	};
	
	Flex.prototype.comparePositions = function(p1, p2) {
		var r1, r2;
			
		r1 = p1[0] <= p2[0] ? p1 : p2;
		r2 = p1[0] <= p2[0] ? p2 : p1;
		
		return r1[1] >= r2[0] || r1[0] === r2[0];
	};
	
	Flex.prototype.overlaps = function(a,b) {
		var pos1 = this.getPositions( a.change ),
			pos2 = this.getPositions( b.change || b.defaults );
			
		return this.comparePositions( pos1[0], pos2[0] ) && this.comparePositions( pos1[1], pos2[1] );
    };

	Flex.prototype.intersectors = function(compare, compareAgainstChanges) {
		var list = (compareAgainstChanges) ? this.changes : this.list,
			intersectors = [];
			
		for(var x = 0; x < list.length; x++) {
			if (list[x].elm[0] !== compare.elm[0] && !list[x].start && !list[x].adjusted && this.overlaps(compare,list[x])) {
				intersectors.push(list[x]);
			}
		}
		
		return intersectors;
    };
	
	// take the child and it's parent and calculate the difference
	// threshhold - min width & height for any given element
	// padding - empty area between the elements
	Flex.prototype.adjust = function(child, overrideParent) {
		var w,h,l,t, d={},
			parent = overrideParent,
			flag = false,
			threshhold = this.options.threshhold,
			padding = this.options.padding,
			childBelow = child.defaults.top > parent.defaults.top + parent.defaults.height,
			childAbove = child.defaults.top + child.defaults.height < parent.defaults.top,
			childLeftOf = child.defaults.left < parent.defaults.left,
			childRightOf = child.defaults.left > parent.defaults.left + parent.defaults.width;
			
		// Width
		if (childAbove || childBelow) {
			w = child.defaults.width;
		} else if (childRightOf) {
			w = child.defaults.left + child.defaults.width - (parent.change.left + parent.change.width) - padding;
		} else {
			w = parent.change.width - child.defaults.width + padding;
		}

		if (w < threshhold) {
			w = threshhold ;
			flag = true;
		}

		// Height
		if ( childBelow || childAbove ) {
			h = child.defaults.height + child.defaults.top - parent.change.height - padding;
		} else if ( childRightOf ) {
			h = child.defaults.height;
		} else {
			h = parent.change.height - child.defaults.height;
		}

		if (h < threshhold) {
			h = threshhold ;
			flag = true;
		}

		// Left
		if (childBelow || childAbove) {
			l = child.defaults.left;
		} else if ( childRightOf ) {
			l = (parent.change.left + parent.change.width) + padding;
		} else {
			l = parent.change.left + parent.change.width + padding;
		}

		// Top
		if (childBelow) {
			t = parent.change.top + parent.change.height + padding;
		} else {
			t = child.defaults.top;
		}

		return [{ width:w,height:h,left:l,top:t }, flag];
	};
	
	Flex.prototype.recursion = function(start) {
		
		var cp, adj, adjustment, intersector, i, p, y,
			cacheTimes = this.times,
			changes = this.changes,
			current, x = 0, t = changes.length,
			moreChanges = 0;
		
		// if this is the first iteration
		for(; x < t; x++) {
			current = changes[x];
			// if it's the first iteration, set properties
			// on the matching element
			if (start) {
				// current is the same as the start elm
				// ie. what element the mouse entered on
				if (current.elm[0] === start.elm[0]) {
					// simple flag to know which element is the beginning node
					current.start = true;
					current.change = current.expanded;
					moreChanges++;
					// break out of loop, for next iteration
					break;
				}
			}
			
			// if an element has been marked for change and is not adjusted (complete)
			if (current.change && !current.adjusted ) {
				if (!this.first) {
					this.first = true;
					current.adjusted = true;
				}
				// does this element overlap with any other elements
				i = this.intersectors(current, true);
				
				for(y = 0; y < i.length; y++) {
					intersector = i[y];
					
					// don't make changes to the current elm
					if (!intersector.start && intersector.elm[0] !== current.elm[0]) {
						// calculate the css changes
						adjustment = this.adjust(intersector, current);
						
						// loop through list of changes to update
						for(p = 0; p < changes.length; p++) {
							
							if (intersector.elm[0] === changes[p].elm[0] && !changes[p].adjusted) {
								cp = changes[p];
								adj = adjustment[0];
								
								// if this has been changed and the change/adjustments
								// are the same mark as adjusted
								if (cp.change && 
									(cp.change.width === adj.width && 
									cp.change.height === adj.height && 
									cp.change.left === adj.left && 
									cp.change.top === adj.top)) {
									changes[p].adjusted = true;
								} else {
									// apply adjustments to the change obj
									changes[p].change = adjustment[0];
									moreChanges++;
								}
								break;
							}
						}
					}
				}
			}
		}
		
		if (moreChanges) this.recursion();
	};
	
	Flex.prototype.change = function(el) {
		var cache = this.getCache(el),
			reference = [];
		
		// create copy of list
		this.changes = $.extend(true, [], this.list);
		this.first = null;

		this.recursion(cache);
	};
	
	$.fn.flex = function ( options ) {
		var p = this.data("flex"),
			opts = options || {};

		if (p) return p;

		this.each(function () {
			p = new Flex( this, opts );
			$(this).data("flex", p);
		});

		return opts.api ? p : this;
	};

})( jQuery );