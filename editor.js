class Editor {

	constructor(element_id) {
		this.words = []
		this.editor = document.getElementById(element_id);
		this.debug = document.getElementById('typer-debug');
		this.idx = 0;
		this.char_ptr = 0;
		this.lines = 0;
		this.line_ptr = 0;
		this.control = false;
		this.shift = false;
		this.ascii = 0;
		this.reconigzed = false;
		this.tokenizer_step = true;
		this.tokenizer = new Tokenizer();
		this.tokenizer.initiate({
			type: ['let', 'var', 'const'],
			control: ['if', 'else', 'switch', 'continue', 'break'],
			loop: ['for', 'while', 'do']

		});
		this.words.push({content: '', type: null});
	}

	show_debug() {
		if(this.debug == null || this.debug == undefined)
			return;

		this.debug.innerHTML =  `index: ${this.idx.toString()}|`;
		this.debug.innerHTML += `pointer: ${this.char_ptr.toString()}|`;
		this.debug.innerHTML += `line: ${this.line_ptr.toString()}|`;
		this.debug.innerHTML += `total: ${this.words.length.toString()} words|`;
		this.debug.innerHTML += `control: ${this.control.toString()}|`
		this.debug.innerHTML += `shift: ${this.shift.toString()}|`;
		this.debug.innerHTML += `ascii: ${this.ascii}`;
		this.debug.innerHTML += '<br/><br/>'
	}

	render() {
		this.show_debug();
		let content = '';

		this.editor.innerHTML = '';
		for(let i = 0; i < this.words.length; i++) {
			content = this.words[i].content;

			if(this.words[i].type != null)
			{
				switch(this.words[i].type)
				{
					case 'cr':
					content = '<br/>';
					break;

					case 'type':
					content = '<span class="type">' + content + '<span/>';
					break;

					case 'control':
					content = '<span class="control">' + content + '<span/>';
					break;

					case 'loop':
					content = '<span class="loop">' + content + '<span/>';
					break;
				}
			}

			if(this.idx == i)
			{
				content = '<u>' + content + '</u>|';
			}

			this.editor.innerHTML += content;
		}
	}

	keydown(key, ascii) {
		this.ascii = ascii;
		if(key.length == 1 && ascii > 32 && ascii <= 126)
		{
			this.words[this.idx].content += key;
			this.char_ptr++;

			if(this.tokenizer_step)
			{
				document.title = 'step';
				this.reconigzed = this.tokenizer.step(key);
			}
			else
			{
				//alert(this.words[this.idx].content);
				document.title = 'all:' + this.words[this.idx].content + this.words[this.idx].content.length.toString();
				this.reconigzed = this.tokenizer.runStringAtOnce(this.words[this.idx].content);
			}

			if(this.reconigzed)
			{
				this.words[this.idx].type = this.tokenizer.match.type;
			}
			else
			{
				this.words[this.idx].type = null;
			}
		}
		else
		{
			switch(ascii)
			{
				case 37: // left
				if(this.idx > 0 && this.words.length > 1)
					this.idx--;
				this.tokenizer_step = false;
				break;

				case 39: // right
				if(this.words.length > 1 && this.idx < this.words.length - 1)
					this.idx++;
				this.tokenizer_step = false;
				break;

				case 32: // space
				this.words.splice(this.idx + 1, 0, {content: ' ', type: null});
				this.words.splice(this.idx + 2, 0, {content: '', type: null});
				this.idx += 2;
				this.char_ptr = 0;
				this.tokenizer.reset();
				this.tokenizer_step = true;
				break;

				case 13: // CR = carriage return = enter
				this.words.splice(this.idx + 1, 0, {content: '', type: 'cr'});
				this.words.splice(this.idx + 2, 0, {content: '', type: null});
				this.idx += 2;
				this.char_ptr = 0;
				this.line_ptr++;
				this.tokenizer.reset();
				this.tokenizer_step = true;
				break;

				case 16: // S0, S1 = shift l & r
				this.shift = true;
				break;

				case 17: // DC = data control = CTRL
				case 18:
				case 19:
				case 20:
				this.control = true;
				break;

				case 8: // BS = backspace
				// if(this.words[this.idx].content == '<br/>')
				// {
				// 	this.words[this.idx].content = '';
				// 	this.line_ptr--;
				// }
				if(this.words[this.idx].type == 'cr')
				{
					this.line_ptr--;
				}
				this.words[this.idx].content = this.words[this.idx].content.slice(0, -1);

				if(this.words[this.idx].content.length == 0)
				{
					if(this.words.length > 1)
					{
						this.words.splice(this.idx, 1);
					}
					
					if(this.idx > 0)
					{
						this.idx--;
					}
				}
				this.tokenizer_step = false;
				this.reconigzed = this.tokenizer.runStringAtOnce(this.words[this.idx].content);

				if(this.reconigzed)
				{
					this.words[this.idx].type = this.tokenizer.match.type;
				}
				else
				{
					this.words[this.idx].type = null;
				}
				break;
			}
		}
		this.render();
	}

	keyup(key, ascii)
	{
		switch(ascii)
		{
			case 16:
			this.shift = false;
			break;

			case 17: case 18:
			case 19: case 20:
			this.control = false;
			break;
		}
	}
}

const editor = new Editor('editor');

document.getElementById('body').onkeydown = (e) => editor.keydown(e.key, e.which);
document.getElementById('body').onkeyup = (e) => editor.keyup(e.key, e.which);