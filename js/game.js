;(function () {
	 function game () {
		 this.map = [
		 		[
		 			[],[],[],[]
		 		],
		 		[
		 			[],[],[],[]
		 		],
		 		[
		 			[],[],[],[]
		 		],
		 		[
		 			[],[],[],[]
		 		]
		 ];

		 this.color = [
	 			'#99CCCC','#FFCC99','#FFCCCC',
	 			'#FFFF99','#CCCCFF','#CC9966',
	 			'#666666','#CC9999','#993333',
	 			'#CCCC00','#663366','#CC0033',
	 			'#333333','#CCCC00','#FF0033',
	 			'#333399','#999933','#333300'
	 			];

	 	this.direction = {
	 		37: 'left',
	 		38: 'up',
	 		39: 'right',
	 		40: 'down'
	 	};

		this.tr = (function(){
			  var tbody = document.querySelector('tbody');

			  return tbody.children;
		}());

		this.score = 0;
	 }

	 game.prototype = {

	 	start: function () {
	 		  var block1 = this.createBlock(),
				  block2 = this.createBlock();

	 		  this.insert(block1).insert(block2);
			  return this;
	 	},

		updateMap: function(pos,elem){
			 var value = elem.children[0].innerHTML;

			 this.map[pos.x][pos.y][0] = value;
		},

	 	createBlock: function (undefined) {
	 		 var num = arguments[0] === undefined ? 2 : arguments[0];
	 		 	 p = document.createElement('p'),
	 		 	 span = document.createElement('span');

 		 	 p.className = 'block';
 		 	 p.style.backgroundColor = this.colorFactory(num);
 		 	 span.className = 'text';
 		 	 span.innerHTML = num;
 		 	 p.appendChild(span);

 		 	 return p;
	 	},

	 	colorFactory: function (num) {
	 		 var index = Math.log(num)/Math.log(2),
				 color = this.color[index] ? this.color[index] : this.color[0];
				 
	 		 return color;
	 	},

		getLine: function(){
			 var line = [];
				for(var i=0; i<4; ++i){
					for(var j=0; j<4; ++j){
						if(!this.map[i][j].length){
							line.push(i);
							continue;
						}
					}
				}

				return line;
		},

	 	selectPosition: function () {
	 		 var location = {},
				 line = this.getLine(),
				 lilen = line.length,
				 x = arguments[0] === undefined ? (function(){
							if(!lilen){
								document.getElementById('over').innerHTML = 'game over!';
								throw 'game over!';
							}
							return line[~~Math.random()*lilen]
						}()): arguments[0],
				 count = [],
				 i = 0,
				 self = this,
				 getY = function(){
					 for(; i < 4; ++i){
						 if(self.map[x][i].length){
							 continue;
						 }
						 
						 count.push(i);
					 }

					 var len = count.length;
					 if(!len){
						 return false;
					 }

					 return count[parseInt(Math.random()*len)];
				 };
				
			 location['x'] = x;
			 location['y'] = arguments[1] === undefined ? getY() : arguments[1];
			 if(location['y'] === false){
				return this.selectPosition();
			 }
	 		 return location;
	 	},

	 	insert: function (elem,position) {
	 		 var pos = position ? position : this.selectPosition(),
				 tr = this.tr.item(pos.x),
				 td = tr.children[pos.y];

			 td.appendChild(elem);
			 this.updateMap(pos,elem);

			 return this;
	 	},

	 	move: function () {
	 		 var addEvent = window.addEventListener || window.attachEvent,
				 direction = this.direction,
				 self = this;
	 		 addEvent('keyup', function (event) {
	 		  	 var code = event.keyCode || event.which;

					 code in direction ? self[direction[code]]() : '';
					 document.getElementById('score').innerHTML = self.score;
	 		  }); 
	 	},

		sortLeft: function(){
			var hasChange = false;
			for(var i=0; i<4; ++i){
				for(var j=0; j<4; ++j){
					if(this.map[i][j].length){
						continue;
					}
					var k = j+1,
						len = this.map[i].length;
					for(; k<len; ++k){
						if(!this.map[i][k].length){
							continue;
						}

						this.map[i][j] = this.map[i][k];
						this.map[i][k] = [];
						this.tr[i].children[j].innerHTML = this.getElemHtml(this.map[i][j][0]);
						this.tr[i].children[k].innerHTML = '';
						hasChange = true;
						break;
					}
				}
			 }
			return hasChange;
		},

		left: function(){
			 var hasChange = this.sortLeft();
			 
			 for(var x=0; x<4; ++x){
				for(var y=0; y<3; ++y){
					if(!this.map[x][y].length || !this.map[x][y+1].length){
						break;
					}

					if(this.map[x][y][0] != this.map[x][y+1][0]){
						continue;
					}

					this.score += ~~this.map[x][y][0];
					this.map[x][y][0] *=2;
					this.map[x][y+1].pop();
					this.tr[x].children[y].innerHTML = this.getElemHtml(this.map[x][y][0]);
					this.tr[x].children[y+1].innerHTML = '';
					hasChange = true;
				}
			 }

			 if(hasChange){
				 this.sortLeft();
				 var elem = this.createBlock();
				 this.insert(elem);
			 }
		},

		sortUp: function(){
			var hasChange = false;
			for(var i=0; i<4; ++i){
				for(var j=0; j<4; ++j){
					if(this.map[j][i].length){
						continue;
					}
					var k = j+1,
						len = this.map.length;
					for(; k<len; ++k){
						if(!this.map[k][i].length){
							continue;
						}

						this.map[j][i] = this.map[k][i];
						this.map[k][i] = [];
						this.tr[j].children[i].innerHTML = this.getElemHtml(this.map[j][i][0]);
						this.tr[k].children[i].innerHTML = '';
						hasChange = true;
						break;
					}
				}
			 }
			return hasChange;
		},

		up: function(){
			var hasChange = this.sortUp();

			for(var x=0; x<4; ++x){
				for(var y=0; y<3; ++y){
					if(!this.map[y][x].length || !this.map[y+1][x].length){
						break;
					}

					if(this.map[y][x][0] != this.map[y+1][x][0]){
						continue;
					}

					this.score += ~~this.map[y][x][0];
					this.map[y][x][0] *=2;
					this.map[y+1][x]=[];
					this.tr[y].children[x].innerHTML = this.getElemHtml(this.map[y][x][0]);
					this.tr[y+1].children[x].innerHTML = '';
					hasChange = true;
				}
			 }

			 if(hasChange){
				 this.sortUp();
				 var elem = this.createBlock();
				 this.insert(elem);
			 }
		},

		sortRight: function(){
			var hasChange = false;
			for(var i=0; i<4; ++i){
				for(var j=3; j>=0; --j){
					if(this.map[i][j].length){
						continue;
					}
					var k = j-1;
					for(; k>=0; --k){
						if(!this.map[i][k].length){
							continue;
						}

						this.map[i][j] = this.map[i][k];
						this.map[i][k] = [];
						this.tr[i].children[j].innerHTML = this.getElemHtml(this.map[i][j][0]);
						this.tr[i].children[k].innerHTML = '';
						hasChange = true;
						break;
					}
				}
			 }
			return hasChange;
		},

		right: function(){
			var hasChange = this.sortRight();

			for(var x=0; x<4; ++x){
				for(var y=3; y>0; --y){
					if(!this.map[x][y].length || !this.map[x][y-1].length){
						break;
					}

					if(this.map[x][y][0] != this.map[x][y-1][0]){
						continue;
					}

					this.score += ~~this.map[x][y][0];
					this.map[x][y][0] *=2;
					this.map[x][y-1]=[];
					this.tr[x].children[y].innerHTML = this.getElemHtml(this.map[x][y][0]);
					this.tr[x].children[y-1].innerHTML = '';
					hasChange = true;
				}
			 }

			 if(hasChange){
				 this.sortRight();
				 var elem = this.createBlock();
				 this.insert(elem);
			 }
		},

		sortDown: function(){
			var hasChange = false;
			for(var i=0; i<4; ++i){
				for(var j=3; j>0; --j){
					if(this.map[j][i].length){
						continue;
					}
					var k = j-1,
						len = this.map.length;
					for(; k>=0; --k){
						if(!this.map[k][i].length){
							continue;
						}

						this.map[j][i] = this.map[k][i];
						this.map[k][i] = [];
						this.tr[j].children[i].innerHTML = this.getElemHtml(this.map[j][i][0]);
						this.tr[k].children[i].innerHTML = '';
						hasChange = true;
						break;
					}
				}
			 }
			return hasChange;
		},

		down: function(){
			var hasChange = this.sortDown();

			for(var x=0; x<4; ++x){
				for(var y=3; y>0; --y){
					if(!this.map[y][x].length || !this.map[y-1][x].length){
						break;
					}

					if(this.map[y][x][0] != this.map[y-1][x][0]){
						continue;
					}

					this.score += ~~this.map[y][x][0];
					this.map[y][x][0] *=2;
					this.map[y-1][x]=[];
					this.tr[y].children[x].innerHTML = this.getElemHtml(this.map[y][x][0]);
					this.tr[y-1].children[x].innerHTML = '';
					hasChange = true;
				}
			 }

			 if(hasChange){
				 this.sortDown();
				 var elem = this.createBlock();
				 this.insert(elem);
			 }		
		},

		getElemHtml: function(val){
			var style = this.colorFactory(val),
				style2 = '';

			if(val>100 && val<1000){
				style2 = 'font-size:35px;top:15px;right:10px;';
			}else if(val>1000 && val<10000){
				style2 = 'font-size:30px;top:18px;right:5px;';
			}else if(val>10000){
				style2 = 'font-size:25px;top:21px;right:5px;';
			}
			return '<p class="block" style="background-color:'+ style +';"><span class="text" style="'+ style2 +'">'+ val +'</span></p>';
		},

		getStyle: function(val){
			var color = this.color[Math.log(val)/Math.log(2)] ? this.color[Math.log(val)/Math.log(2)] : this.color[0];
				style = 'background-color:'+ color + ';';
			
			return style;
		}
	 }

	 var in_array = function(elem,array){
						 for(var j=0,len=array.length; j<len; ++j){
							 if(elem != array[j]){
								continue;
							 }
							 return true;
						 }
						 return false;
					 }

	 var init = new game();
	 init.start().move();
})();