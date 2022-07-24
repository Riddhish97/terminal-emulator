/* global $, localStorage */

class Shell {
  constructor(term, commands) {
    this.commands = commands;
    this.setupListeners(term);
    this.term = term;
    this.tabClick=0;
    localStorage.directory = 'root';
    localStorage.history = JSON.stringify('');
    localStorage.historyIndex = -1;
    localStorage.inHistory = false;

    $('.input').focus();
  }

  setupListeners(term) {
    $('#terminal').mouseup(() => $('.input').last().focus());

    term.addEventListener('keyup', (evt) => {
      const keyUp = 38;
      const keyDown = 40;
      let cmdFirstStr={
        "p":"pwd",
        "pw":"pwd",
        "c":"cd cat clear",
        "ca":"cat",
        "cl":"clear",
        "cle":"clear",
        "clea":"clear",
        "h":"help history",
        "he":"help",
        "hel":"help",
        "hi":"history",
        "his":"history",
        "hist":"history",
        "histo":"history",
        "histor":"history",
        "l":"ls",
        "m":"mkdir",
        "mk":"mkdir",
        "mkd":"mkdir",
        "mkdi":"mkdir",
        "r":"rm",
        "t":"touch",
        "to":"touch",
        "tou":"touch",
        "touc":"touch",
      }
      let argsObj={
        "a":"about.txt",
        "ab":"about.txt",
        "abo":"about.txt",
        "abou":"about.txt",
        "about":"about.txt",
        "about.":"about.txt",
        "about.t":"about.txt",
        "about.tx":"about.txt",
        "c":"contact.txt",
        "co":"contact.txt",
        "con":"contact.txt",
        "cont":"contact.txt",
        "conta":"contact.txt",
        "contac":"contact.txt",
        "contact":"contact.txt",
        "contact.":"contact.txt",
        "contact.t":"contact.txt",
        "contact.tx":"contact.txt",
        "r":"resume.txt",
        "re":"resume.txt",
        "res":"resume.txt",
        "resu":"resume.txt",
        "resum":"resume.txt",
        "resume":"resume.txt",
        "resume.":"resume.txt",
        "resume.t":"resume.txt",
        "resume.tx":"resume.txt",
        "resume.tx":"resume.txt",
        "p":"proficient.txt",
        "pr":"proficient.txt",
        "pro":"proficient.txt",
        "prof":"proficient.txt",
        "profi":"proficient.txt",
        "profic":"proficient.txt",
        "profici":"proficient.txt",
        "proficie":"proficient.txt",
        "proficien":"proficient.txt",
        "proficient":"proficient.txt",
        "proficient.":"proficient.txt",
        "proficient.t":"proficient.txt",
        "proficient.tx":"proficient.txt",
        "f":"familiar.txt",
        "fa":"familiar.txt",
        "fam":"familiar.txt",
        "fami":"familiar.txt",
        "famil":"familiar.txt",
        "famili":"familiar.txt",
        "familia":"familiar.txt",
        "familiar":"familiar.txt",
        "familiar.":"familiar.txt",
        "familiar.t":"familiar.txt",
        "familiar.tx":"familiar.txt",
      }
      const key = evt.keyCode;
      if(key == 9){
        console.log("tab event");
        this.tabClick++;
        setTimeout(()=>this.tabClick=0,500)
      }
      if(key == 9 && this.tabClick==2){
        console.log("tab event double",this.commands);
        const prompt = evt.target;
        const input = prompt.textContent.trim().split(' ');
        const cmd = input[0].toLowerCase();
        const args = input[1];
        console.log("cmd",cmd)
        console.log("args",args)
        console.log(cmd,!this.commands[cmd])
        if(!this.commands[cmd]){
          console.log("tab reply",cmdFirstStr[cmd])
          if(cmdFirstStr[cmd].split(" ").length>1){
            this.term.innerHTML += cmdFirstStr[cmd];
            this.resetPrompt(term, prompt);
          }else{
            // if(!this.commands[cmd]){
            $('.prompt').last().next().html(cmdFirstStr[cmd]);
          }
        }else {
          console.log(localStorage.directory)
          if ((cmd =="cd" || cmd =="cd ") && localStorage.directory == "root"){
            $('.prompt').last().next().html("cd skills");
          }
          if (cmd =="cat" || cmd =="cat "){
            // $('.prompt').last().next().html("cat skills");
            if(localStorage.directory == "root" && !args){
            this.term.innerHTML += "<p>about.txt &nbsp&nbsp contact.txt &nbsp&nbsp resume.txt <br></p>";
            this.resetPrompt(term, prompt);
            }
            if(localStorage.directory == "root" && args){
              $('.prompt').last().next().html("cat "+argsObj[args]);
            }
            if(localStorage.directory == "skills"&& !args){
            this.term.innerHTML += "<p>proficient.txt &nbsp&nbsp familiar.txt</p>";
            this.resetPrompt(term, prompt);
            }
            if(localStorage.directory == "skills" && args){
              $('.prompt').last().next().html("cat "+argsObj[args]);
            }
          }
        }
        this.tabClick=0
      }
      if ([keyUp, keyDown].includes(key)) {
        let history = localStorage.history;
        history = history ? Object.values(JSON.parse(history)) : [];

        if (key === keyUp) {
          if (localStorage.historyIndex >= 0) {
            if (localStorage.inHistory == 'false') {
              localStorage.inHistory = true;
            }
            // Prevent repetition of last command while traversing history.
            if (localStorage.historyIndex == history.length - 1 && history.length !== 1) {
              localStorage.historyIndex -= 1;
            }
            $('.input')
              .last()
              .html(`${history[localStorage.historyIndex]}<span class="end"><span>`);
            if (localStorage.historyIndex != 0) localStorage.historyIndex -= 1;
          }
        } else if (key === keyDown) {
          if (localStorage.inHistory == 'true' && localStorage.historyIndex < history.length) {
            let ret;

            if (localStorage.historyIndex > 0) {
              ret = `${history[localStorage.historyIndex]}<span class="end"><span>`;
              if (localStorage.historyIndex != history.length - 1) {
                localStorage.historyIndex = Number(localStorage.historyIndex) + 1;
              }
              // Prevent repetition of first command while traversing history.
            } else if (localStorage.historyIndex == 0 && history.length > 1) {
              ret = `${history[1]}<span class="end"><span>`;
              localStorage.historyIndex = history.length !== 2 ? 2 : 1;
            }
            $('.input').last().html(ret);
          }
        }
        evt.preventDefault();
        $('.end').focus();
      }
    });

    term.addEventListener('keydown', (evt) => {
      // Keydown legend:
      // 9 -> Tab key.
      // 27 -> Escape key.
      // 8 -> Backspace key.
      // 46 -> Delete key.

      if (evt.keyCode === 9) {
        evt.preventDefault();
      } else if (evt.keyCode === 27) {
        $('.terminal-window').toggleClass('fullscreen');
      } else if (evt.keyCode === 8 || evt.keyCode === 46) {
        this.resetHistoryIndex();
      }
    });

    term.addEventListener('keypress', (evt) => {
      // Exclude these keys for Firefox, as they're fired for arrow/tab keypresses.
      if (![9, 27, 37, 38, 39, 40].includes(evt.keyCode)) {
        // If input keys are pressed then resetHistoryIndex() is called.
        this.resetHistoryIndex();
      }
      if (evt.keyCode === 13) {
        const prompt = evt.target;
        const input = prompt.textContent.trim().split(' ');
        const cmd = input[0].toLowerCase();
        const args = input[1];

        if (cmd === 'clear') {
          this.updateHistory(cmd);
          this.clearConsole();
        } else if (cmd && cmd in this.commands) {
          this.runCommand(cmd, args);
          this.resetPrompt(term, prompt);
          $('.root').last().html(localStorage.directory);
        } else {
          this.term.innerHTML += 'Error: command not recognized';
          this.resetPrompt(term, prompt);
        }
        evt.preventDefault();
      }
    });
  }

  runCommand(cmd, args) {
    const command = args ? `${cmd} ${args}` : cmd;
    this.updateHistory(command);

    const output = this.commands[cmd](args);
    if (output) {
      this.term.innerHTML += output;
    }
  }

  resetPrompt(term, prompt) {
    const newPrompt = prompt.parentNode.cloneNode(true);
    prompt.setAttribute('contenteditable', false);

    if (this.prompt) {
      newPrompt.querySelector('.prompt').textContent = this.prompt;
    }

    term.appendChild(newPrompt);
    newPrompt.querySelector('.input').innerHTML = '';
    newPrompt.querySelector('.input').focus();
  }

  resetHistoryIndex() {
    let history = localStorage.history;

    history = history ? Object.values(JSON.parse(history)) : [];
    if (localStorage.goingThroughHistory == true) {
      localStorage.goingThroughHistory = false;
    }

    if (history.length == 0) {
      localStorage.historyIndex = -1;
    } else {
      localStorage.historyIndex = history.length - 1 > 0 ? history.length - 1 : 0;
    }
  }

  updateHistory(command) {
    let history = localStorage.history;
    history = history ? Object.values(JSON.parse(history)) : [];

    history.push(command);
    localStorage.history = JSON.stringify(history);
    localStorage.historyIndex = history.length - 1;
  }

  clearConsole() {
    const getDirectory = () => localStorage.directory;
    const dir = getDirectory();

    $('#terminal').html(
      `<p class="hidden">
          <span class="prompt">
            <span class="root">${dir}</span>
            <span class="tick">$</span>
          </span>
          <span contenteditable="true" class="input" spellcheck="false"></span>
        </p>`,
    );

    $('.input').focus();
  }
}
