const Automata = require('./automata.js');
const Tokenizer = require('./tokenizer.js');

const tokenizer = new Tokenizer();
tokenizer.initiate({
	type: ['int', 'char', 'float', 'double', 'let', 'var'],
	control: ['if', 'else'],
	loop: ['for', 'while', 'do', 'goto']
});

if(tokenizer.runStringWithSteps('if')) {
	console.log('accepted! ' + tokenizer.match.type + '>' + tokenizer.match.value);
} else {
	console.log('rejected!');
}