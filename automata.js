module.exports = class Automata {
	construct(states, alphabet, transitions, start_state, final_states) {
		this.initiate(states, alphabet, transitions, start_state, final_states);
	}

	initiate(states, alphabet, transitions, start_state, final_states) {
		this.states = states;
		this.alphabet = alphabet;
		this.start_state = start_state;
		this.final_states = final_states;
		this.transitions = transitions;
		this.current_state = start_state;
		this.halted = false;
		this.err = false;
	}

	toString() {
		console.log('states:');
		console.log(this.states);

		console.log('alphabet:')
		console.log(this.alphabet);

		console.log('transitions:');
		console.log(this.transitions);

		console.log('start state:')
		console.log(this.start_state);

		console.log('final states:');
		console.log(this.final_states);

		console.log('current state:');
		console.log(this.current_state);
	}

	halt(err = false) {
		this.halted = true;
		this.err = err;
		///console.log('machine has halted');
	}

	step(symbol) {
		let transition = `${this.current_state},${symbol}`;

		if(this.halted || !this.alphabet.includes(symbol) || !(transition in this.transitions)) {
			this.halt(true);
			return;
		}
		let last_state = this.current_state;
		
		this.current_state = this.transitions[transition];
		///console.log(`(${last_state},${symbol})=${this.current_state}`);
	}

	isFinal() {
		return this.final_states.includes(this.current_state) && !this.err;
	}

	reset() {
		this.current_state = this.start_state;
		this.halted = false;
		this.err = false;
	}

	runString(string) {
		for(let i = 0; i < string.length; i++)
			this.step(string[i]);
		return this.isFinal();
	}

	static makeFromString(string, generate_all_transitions = false) {
		let states = [];
		let alphabet = [];
		let transitions = {};
		let start_state = '';
		let final_states = [];
		const automata = new Automata();

		// copy symbols to alphabet without repetition
		for(let i = 0; i < string.length; i++) {
			if(!alphabet.includes(string[i]))
				alphabet.push(string[i]);
		}

		// create states from 0...n+1
		for(let i = 0; i < string.length + 1; i++) {
			states.push(string + '-' + i.toString());
		}

		// create the error state
		final_states.push(states[states.length-1]);
		states.push(string + '-err');

		// create the transitions for each useful (state_i,symbol_i+1) = state_i+1
		for(let i = 0; i < string.length; i++)
		{
			transitions[states[i] + ',' + string[i]] = states[i+1];

			// create the error transitions
			for(let j = 0; j < alphabet.length; j++) {
				if(alphabet[j] != string[i]) {
					transitions[states[i] + ',' + string[j]] = string + '-err';
				}
			}
		}

		if(generate_all_transitions)
		{
			// it does not need create the transitions for the -err ones
			// because in this case, the machine should halt by itself
			// when it does not found some transition
			// create the transitions for the last useful transition
			// which if occurs anymore symbol, it goes to the error one
			for(let i = 0; i < alphabet.length; i++) {
				transitions[states[states.length-2] + ',' + alphabet[i]] = string + '-err';
			}

			for(let i = 0; i < alphabet.length; i++) {
				transitions[states[states.length-1] + ',' + alphabet[i]] = string + '-err';
			}
		}

		automata.initiate(states, alphabet, transitions, states[0], final_states);
		return automata;
	}
}