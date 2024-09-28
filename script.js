// Conventional map
function stateClicked(stateName) {
	const output = document.getElementById('output');
	output.innerHTML = `<h3>You clicked on ${stateName}</h3>`;

	if (stateName === 'FL' || stateName === 'Florida') {
		window.location.href = 'https://www.youtube.com/watch?v=aOLYSELQfpA';
	}
}

// Hexagon map
//https://gist.github.com/ja-k-e/4da63c9fc39ab12714f8

function initializeMap() {
	// creating base svg
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	// hexagon shape variables
	var hex_di = 100,
		// radius
		hex_rad = hex_di / 2,
		// apothem
		hex_apo = hex_rad * Math.cos(Math.PI / 6),
		// matrix defining state placement
		states_grid = usStateMatrix(),
		// names of states
		states_names = usStateNames(),
		// rows we'll generate
		rows = states_grid.length,
		// columns we'll generate
		cols = states_grid[0].length,
		// stroke width around hexagon
		stroke = 4,
		// the hover state zoom scale
		scale = 2,
		// initial x
		x = (hex_rad * scale) / 2 + stroke * scale,
		// initial y
		y = hex_rad * scale + stroke * scale,
		// side length in pixels
		side = Math.sin(Math.PI / 6) * hex_rad,
		// height of map in pixels
		height = (hex_di - side) * rows + side + hex_rad * scale + stroke * scale,
		// width of map in pixels
		width = hex_apo * 2 * cols + hex_rad * scale + stroke * scale;

	// svg attributes
	svg.setAttribute('class', 'svg');
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');
	svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

	// loop variables
	var offset = false,
		// parsing state names
		states = states_names.states,
		// initial state index
		state_index = 0;

	// draw grid
	for (var i = 0; i < states_grid.length; i++) {
		var loop_x = offset ? hex_apo * 2 : hex_apo;

		var loc_x = x;
		for (var s = 0; s < states_grid[i].length; s++) {
			// grid plot in 0 and 1 array
			var grid_plot = states_grid[i][s];

			// if we have a plot in the grid
			if (grid_plot != 0) {
				// get the state
				var state = states[state_index];

				// create the hex group
				var hexGroup = getHexGroup(svg, loc_x + loop_x, y, hex_rad, state, width);

				// have to reappend element on hover for stacking
				hexGroup.addEventListener('mouseenter', function () {
					var self = this;
					self.setAttribute('class', 'hover');
					self.remove();
					svg.appendChild(self);
				});
				// clear class
				hexGroup.addEventListener('mouseleave', function () {
					this.setAttribute('class', '');
				});

				// click event
				hexGroup.addEventListener('click', function () {
					stateClicked(this.querySelector('.state-name').textContent);
				});

				// append the hex to our svg
				svg.appendChild(hexGroup);
				// increase the state index reference
				state_index++;
			}

			// move our x plot to next hex position
			loc_x += hex_apo * 2;
		}
		// move our y plot to next row position
		y += hex_di * 0.75;
		// toggle offset per row
		offset = !offset;
	}

	// add svg to DOM
	document.body.appendChild(svg);
}

// run the initialization script
initializeMap();

// individual hex calculations
function getHexGroup(svg, x, y, r, state) {
	var svgNS = svg.namespaceURI, // svgNS for creating svg elements
		group = document.createElementNS(svgNS, 'g'),
		hex = document.createElementNS(svgNS, 'polygon'),
		abbr = document.createElementNS(svgNS, 'text'),
		name = document.createElementNS(svgNS, 'text'),
		pi_six = Math.PI / 6,
		cos_six = Math.cos(pi_six),
		sin_six = Math.sin(pi_six);

	// hexagon polygon points
	var hex_points = [
		[x, y - r].join(','),
		[x + cos_six * r, y - sin_six * r].join(','),
		[x + cos_six * r, y + sin_six * r].join(','),
		[x, y + r].join(','),
		[x - cos_six * r, y + sin_six * r].join(','),
		[x - cos_six * r, y - sin_six * r].join(','),
	];

	hex.setAttribute('points', hex_points.join(' '));
	hex.style.transformOrigin = x + 'px ' + y + 'px';

	abbr.setAttribute('class', 'state-abbr');
	abbr.setAttribute('x', x);
	abbr.setAttribute('y', y);
	abbr.textContent = state.abbr;

	name.setAttribute('class', 'state-name');
	name.setAttribute('x', x);
	name.setAttribute('y', y);
	name.textContent = state.name;

	group.appendChild(hex);
	group.appendChild(abbr);
	group.appendChild(name);

	return group;
}

function keyToName(str) {
	return str.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function usStateMatrix() {
	return [
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
		[0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
		[1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
	];
}

function usStateNames() {
	return {
		states: [
			{ abbr: 'AK', name: 'Alaska' },
			{ abbr: 'ME', name: 'Maine' },

			{ abbr: 'VT', name: 'Vermont' },
			{ abbr: 'NH', name: 'New Hampshire' },

			{ abbr: 'WA', name: 'Washington' },
			{ abbr: 'MT', name: 'Montana' },
			{ abbr: 'ND', name: 'North Dakota' },
			{ abbr: 'MN', name: 'Minnesota' },
			{ abbr: 'WI', name: 'Wisconsin' },
			{ abbr: 'MI', name: 'Michigan' },
			{ abbr: 'NY', name: 'New York' },
			{ abbr: 'MA', name: 'Massachusetts' },
			{ abbr: 'RI', name: 'Rhode Island' },

			{ abbr: 'ID', name: 'Idaho' },
			{ abbr: 'WY', name: 'Wyoming' },
			{ abbr: 'SD', name: 'South Dakota' },
			{ abbr: 'IA', name: 'Iowa' },
			{ abbr: 'IL', name: 'Illinois' },
			{ abbr: 'IN', name: 'Indiana' },
			{ abbr: 'OH', name: 'Ohio' },
			{ abbr: 'PA', name: 'Pennsylvania' },
			{ abbr: 'NJ', name: 'New Jersey' },
			{ abbr: 'CT', name: 'Connecticut' },

			{ abbr: 'OR', name: 'Oregon' },
			{ abbr: 'NV', name: 'Nevada' },
			{ abbr: 'CO', name: 'Colorado' },
			{ abbr: 'NE', name: 'Nebraska' },
			{ abbr: 'MO', name: 'Missouri' },
			{ abbr: 'KY', name: 'Kentucky' },
			{ abbr: 'WV', name: 'West Virgina' },
			{ abbr: 'VA', name: 'Virginia' },
			{ abbr: 'MD', name: 'Maryland' },
			{ abbr: 'DE', name: 'Delaware' },

			{ abbr: 'CA', name: 'California' },
			{ abbr: 'UT', name: 'Utah' },
			{ abbr: 'NM', name: 'New Mexico' },
			{ abbr: 'KS', name: 'Kansas' },
			{ abbr: 'AR', name: 'Arkansas' },
			{ abbr: 'TN', name: 'Tennessee' },
			{ abbr: 'NC', name: 'North Carolina' },
			{ abbr: 'SC', name: 'South Carolina' },
			{ abbr: 'DC', name: 'District of Columbia' },

			{ abbr: 'AZ', name: 'Arizona' },
			{ abbr: 'OK', name: 'Oklahoma' },
			{ abbr: 'LA', name: 'Louisiana' },
			{ abbr: 'MS', name: 'Mississippi' },
			{ abbr: 'AL', name: 'Alabama' },
			{ abbr: 'GA', name: 'Georgia' },

			{ abbr: 'HI', name: 'Hawaii' },
			{ abbr: 'TX', name: 'Texas' },
			{ abbr: 'FL', name: 'Florida' },
		],
	};
}
