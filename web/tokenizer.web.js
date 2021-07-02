class Tokenizer {
	construct(classes) {
		this.initiate(classes);
	}

	initiate(classes) {
		this.automatas = [];

		for(let _class in classes) {
			for(let i = 0; i < classes[_class].length; i++) {
				let string = classes[_class][i];
				this.automatas.push({
					type: _class,
					value: string,
					machine: Automata.makeFromString(string, false)
				});
			}
		}

		this.states = [];
		
		this.match = {
			type: '',
			value: ''
		};
	}

	toString() {
		console.log(this.automatas);
	}

	reset() {
		for(let i = 0; i < this.automatas.length; i++)
		{
			this.automatas[i].machine.reset();
		}
	}

	step(symbol) {
		let status = [];

		for(let i = 0; i < this.automatas.length; i++) {
			this.automatas[i].machine.step(symbol);
			status.push(this.automatas[i].machine.isFinal());
		}

		this.status = status;
		if(status.includes(true))
		{
			let index = status.indexOf(true);
			this.match.type = this.automatas[index].type;
			this.match.value = this.automatas[index].value;
			return true;
		}
		return false;
	}

	runStringAtOnce(string) {
		let status = [];

		this.reset();

		for(let i = 0; i < this.automatas.length; i++) {
			status.push(this.automatas[i].machine.runString(string));
		}

		console.log(status);
		this.status = status;
		if(status.includes(true))
		{
			let index = status.indexOf(true);
			this.match.type = this.automatas[index].type;
			this.match.value = this.automatas[index].value;
			return true;
		}
		return false;
	}

	runStringWithSteps(string) {
		let result = false;

		this.reset();
		for(let i = 0; i < string.length; i++) {
			result = this.step(string[i]);
		}
		return result;
	}
}