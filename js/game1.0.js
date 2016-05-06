;(function () {
	 function game () {
		 this.score = 0;
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
		this.history = [];
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
			 console.log(this.map);
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
	 		 var index = Math.log(num)/Math.log(2);

	 		 return this.color[index];
	 	},

	 	getPosition: function () {
	 		 var len = this.child.length,
	 		 	 i = 0;
	 		 if(!len){
	 		 	return this.selectPosition();
	 		 }

	 		 for (; i < len; i = i+1) {
	 		 	
	 		 }
	 	},

		getLine: function(){
			 return parseInt(Math.random()*4);
		},

	 	selectPosition: function () {
	 		 var location = {},
				 x = arguments[0] === undefined ? this.getLine() : arguments[0],
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

	 	hasSibs: function (row,col) {
	 		  for(var i=0; i<col; ++i){
					if(this.map[row][i].length){
						 return i;	
					}
			  }

			  return false;
	 	},

	 	equal: function (num1,num2) {
	 		 return num1 == num2;
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
	 		  }); 
	 	},

	 	remove: function (row,col) {
	 		 //this.tr.children[row].children[col].innerHTML = '';
	 	},

		left: function(){
			 var hasChange = false;
			 for(var i=0; i<4; ++i){
				for(var j=1; j<4; j++){
					if(!this.map[i][j].length){
						continue;
					}

					for(var k=j-1; k>=0; --k){
						if(!this.map[i][k].length){
							this.map[i][k][0] = this.map[i][j][0];
							this.tr[i].children[k].innerHTML = this.getElemHtml(this.map[i][j][0]);
							this.map[i][j].pop();
							this.tr[i].children[j].innerHTML = '';
							j -= 1; 
							hasChange = true;
							this.history.push(this.map);
							console.log(JSON.stringify(this.history,null,4));
							continue;
						}

						if(this.map[i][k][0] == this.map[i][j][0]){
							this.map[i][k][0] *= 2;
							this.map[i][j].pop();
							this.tr[i].children[k].innerHTML = '<p class="block" style="background-color: rgb(255, 204, 153);"><span class="text">'+ this.map[i][k][0] +'</span></p>';
							this.tr[i].children[j].innerHTML = '';
							hasChange = true;
							this.history.push(this.map);
							console.log(JSON.stringify(this.history,null,4));
							continue;
						}
						var m = k-1;
						if(m == j){
							continue;
						}else if(m>=0){
							this.map[i][m][0] = this.map[i][j][0];
							this.tr[i].children[m].innerHTML = '<p class="block" style="background-color: rgb(255, 204, 153);"><span class="text">'+ this.map[i][j][0] +'</span></p>';
							this.map[i][j].pop();
							this.tr[i].children[j].innerHTML = '';
							this.history.push(this.map);
							console.log(JSON.stringify(this.history,null,4));
							hasChange = true;
						}else {
							
						}
					}
				}
			 }

			 if(hasChange){
				var elem = this.createBlock();
				this.insert(elem);
			 }
		},

		up: function(){
			
		},

		right: function(){
		
		},

		down: function(){
		
		},

		changeTable: function(pos,val){
			console.dir(this.tr[pos.x].children[pos.y]);
			this.tr[pos.x].children[pos.y].innerHTML = this.getElemHtml(val);
		},

		getElemHtml: function(val){
			return '<p class="block" style="background-color: rgb(255, 204, 153);"><span class="text">'+ val +'</span></p>';
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
	 var test = new game();
	 test.start().move();
})();