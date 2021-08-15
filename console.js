let cmdSuccess = false

let colors = {
    system: "rgb(248, 245, 79)",

    return: {
        success: "rgb(79, 248, 116)",
        error: "rgb(255, 87, 87)"
    },

    shadow: {
        success: "0 0 1px #001716, 0 0 2px #55c58752, 0 0 3px #55c58752, 0 0 5px #55c58752 !important",
        error: "0 0 1px #000, 0 0 5px #fc1f2e3d, 0 0 3px #fc1f2e3d, 0 0 14px #fc1f2e3d !important",
        system: "0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575 !important"
    }
}

const createAndApend = function(element, __, appendTo) {
    const e = document.createElement(element)
    e.classList.add("--viewline")
    if (__) { __(e) }
    appendTo.appendChild(e)
}

const returntxt = function(container, type, msg, from, $class) {
    if (from) {
        createAndApend("div", function(e) {
            e.innerHTML = `<pre class="${$class || null}">[${type}${from}] <span class="--console1">${msg}</span></pre>`
        }, container)
    } else {
        if (!type.search("/")) {
            createAndApend("div", function(e) {
                e.innerHTML = `<pre class="--console4">[${type}] ${msg}</pre>`
            }, container)
        } else {
            createAndApend("div", function(e) {
                if (from !== undefined) {
                    e.innerHTML = `<pre class="--console3">[${type}${from}] <span class="--console1">${msg}</span></pre>`
                } else {
                    e.innerHTML = `<pre class="--console3">[${type}] <span class="--console1">${msg}</span></pre>`
                }
            }, container)
        }
    }
}

let math = {
    get_rand: function() { // generate a random number
        let $ = Math.pow(Math.random() * (Math.PI + Math.SQRT2) * Math.sqrt(100), 1.5).toString()
        $ = $.replaceAll(".", "")
        return parseInt($)
    }
}

function terminal() {
    setTimeout(() => {
        let identifier = math.get_rand()
        let container = this.container

        createAndApend("section", function(e) {
            e.classList.remove("--viewline")
            e.classList.add("--")
            e.innerHTML = `<div class="--consoleTopbar" style="user-select: none;">
    <p class="important">Console</p>
    <p>Running</p>
</div>`
        }, this.container)

        createAndApend("div", function(e) {
            e.classList.remove("--viewline")
            e.style["margin-top"] = "1.5em"
        }, this.container)

        this.background = this.configOpts.background || "rgb(30, 32, 48)"
        this.hoverBackground = this.configOpts.hoverBackground || "#222436"
        this.textcolor = this.configOpts.textcolor || "#fff"
        this.startmsg = this.configOpts.startmsg || "Web console test running successfully"
        this.cmds = this.configOpts.cmds || []
        this.readOnly = this.configOpts.readOnly || false

        const configOpts = {
            background: this.configOpts.background || "rgb(30, 32, 48)",
            hoverBackground: this.configOpts.hoverBackground || "#222436",
            textcolor: this.configOpts.textcolor || "#fff",
            startmsg: this.configOpts.startmsg || "Web console test running successfully",
            cmds: this.configOpts.cmds || [],
            readOnly: this.configOpts.readOnly || false,
        }

        let currentsettings = [{
            webconsole: this.webconsole,
            background: this.background,
            textcolor: this.textcolor,
            startmsg: this.startmsg
        }]

        // Styles

        container.classList.add("--consoleRendered")
        container.innerHTML += `
<!-- TEST CONSOLE -->
<!-- 0aoq/Console - https://github.com/0aoq/Console -->
<!-- --- -->
<style>
    /* 0aoq/Console - Console styles */
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

    :root {
        --console-background: ${this.background};
    }

    .--consoleRendered {
        overflow-x: hidden !important;
        background: var(--console-background) !important;
        font-family: Segoe WPC,Segoe UI,sans-serif !important;
        -moz-osx-font-smoothing: grayscale !important;
        -webkit-font-smoothing: antialiased !important;
        text-rendering: optimizeSpeed !important;
        margin: 0 !important;
        overflow-wrap: break-word !important;
        padding: 0 !important;
        word-wrap: break-word !important;
        color: white !important;
        height: 100%;
        display: flex !important;
        flex-direction: column !important;
    }
            
    .--consoleRendered::selection {
        background: white;
        color: black;
    }
            
    .--consoleRendered::-moz-selection {
        background: white;
        color: black;
    }
            
    .--consoleRendered pre {
        font-size: small !important;
        font-family: 'Fira Code', monospace;
    }
            
    .--consoleRendered input {
        background: transparent;
        resize: none;
        outline: none;
        height: auto;
        color: white;
        display: inline-block;
        border: none;
        font-family: 'Fira Code', monospace;
        white-space: pre;
        width: 80vw;
        font-size: small !important;
        padding: 0 !important;
    }

    .--viewline {
        transition: all 0.1s;
        padding-bottom: 3px;
    }

    .--viewline:hover {
        background: ${this.hoverBackground}; 
    }

    .--consoleRendered form {
        transition: all 0.1s;
        margin-top: 0.8em;
        padding-bottom: 3px;
        border-top: rgb(28, 28, 44) solid 1px;
        border-bottom: rgb(28, 28, 44) solid 1px;
    }

    .--consoleRendered form:hover {
        background: ${this.hoverBackground}; 
    }

    .--viewline pre {
        word-wrap: break-word !important;
    }

    /* ==================== */
    /* CONSOLE TOPBAR       */
    /* ==================== */

    .--consoleTopbar {
        display: flex;
        gap: 0.1em;
        border-bottom: rgb(20, 21, 32) solid 1px;
        background: rgb(28, 29, 44) !important;
        position: fixed;
        width: 100%;
    }
    
    .--consoleTopbar p {
        font-size: small;
        padding: 3px;
        padding-left: 10px;
        padding-right: 10px;
        color: white;
        font-weight: 600;
    }
    
    .--consoleTopbar p.important {
        font-weight: 605;
        background: rgb(62, 104, 215);
    }

    /* ==================== */
    /* CONSOLE COLORS       */
    /* ==================== */

    .--console1 { /* plaintext */
        display: inline; 
        margin: 0; 
        padding: 0; 
        color: white; 
        text-shadow: none;
    }

    .--console2 { /* system */
        display: inline; 
        color: ${colors.system}; 
        text-shadow: ${colors.shadow.system};
        margin: 0; 
        padding: 0;
    }

    .--console3 { /* success */
        display: inline; 
        color: ${colors.return.success}; 
        text-shadow: ${colors.shadow.success};
        margin: 0; 
        padding: 0;
    }

    .--console4 { /* error */
        display: inline; 
        color: ${colors.return.error}; 
        text-shadow: ${colors.shadow.error};
        margin: 0; 
        padding: 0;
    }
</style>
<!-- --- -->
        `

        // Params/Variables

        function getbool(txt) {
            if (txt == "true") { return true } else if (txt == "false") { return false }
        }

        let contextmenu_enabled = false

        let cmd_history = []

        let commands = [{
            title: "test1",
            args: false,
            run: function(args) {
                cmdSuccess = true
                console.log("test1")
            }
        }, {
            title: "test2",
            args: true,
            run: function(args) {
                cmdSuccess = true
                console.log(`test2 ${args[1]}`)
            }
        }, {
            title: "clear",
            args: false,
            run: function(args) {
                cmdSuccess = true

                document.querySelectorAll(".--viewline").forEach((element) => {
                    element.remove()
                })
                document.getElementById(`newline_form:${identifier}`).remove()
                returninput()
            }
        }, {
            title: "fs",
            args: true,
            run: function(args) {
                cmdSuccess = true
                if (args[1] == "info") {
                    let fileHandle;

                    async function getFile() {
                        [fileHandle] = await window.showOpenFilePicker();
                        var file = await fileHandle.getFile()

                        returntxt(container, "#", `FILE INFORMATION: {
name: "${file.name}",
size: "${file.size} bytes",
lastmodified: "${file.lastModifiedDate}"
}`)
                    }

                    getFile()
                } else if (args[1] == "content") {
                    let fileHandle;

                    async function getFile() {
                        [fileHandle] = await window.showOpenFilePicker();
                        var file = await fileHandle.getFile()

                        returntxt(container, "#", `{ "${await file.text()}" }`)
                    }

                    getFile()
                }
            }
        }, {
            title: "time",
            args: false,
            run: function(args) {
                cmdSuccess = true

                returntxt(container, "#", new Date().toLocaleString())
            }
        }, {
            title: "history",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] == "-c") {
                    cmd_history = []
                    window.localStorage.setItem("cmd_history", cmd_history)
                } else if (args[1] == "-ls") {
                    var json = JSON.parse(window.localStorage.getItem("cmd_history"))

                    for (let node of json) {
                        var int = 0
                        returntxt(container, "#", node[int].value)
                        int++
                    }
                }
            }
        }, {
            title: "full",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] == "true") {
                    let elem = document.documentElement
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                    }
                } else if (args[1] == "false") {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { /* IE11 */
                        document.msExitFullscreen();
                    }
                }
            }
        }, {
            title: "exit",
            args: false,
            run: function(args) {
                cmdSuccess = true

                window.close()
            }
        }, {
            title: "get",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] == "settings") {
                    returntxt(container, "#", JSON.stringify(currentsettings))
                } else if (args[1] == "webconsole") {
                    returntxt(container, "#", "Testing for webconsole support, sending console log.")
                    console.log("If you can see this without opening devtools, the webconsole is enabled.")
                }
            }
        }, {
            title: "re",
            args: false,
            run: function(args) {
                cmdSuccess = true

                window.location.reload()
            }
        }, {
            title: "JSON",
            args: false,
            run: function(args) {
                cmdSuccess = true

                returntxt(container, "/", "JSON is not currently supported in this version of the terminal.")
            }
        }, {
            title: "spm",
            args: true,
            run: function(args) {
                cmdSuccess = true

                returntxt(container, "/", "Super Plugin Manager is currently disabled on this system.")
            }
        }, {
            title: "random",
            args: true,
            run: function(args) {
                cmdSuccess = true

                let number = 0

                if (args[2] == "random") {
                    number = Math.floor(Math.random() * (+100 - +32)) + +32
                    console.log(args[2])
                } else if (args[2] != "0") {
                    number = args[2]
                }

                if (args[1] == "string" && number) {
                    const getString = function(length) {
                        let result = []
                        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?'
                        let charactersLength = characters.length
                        for (let i = 0; i < length; i++) {
                            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
                        }
                        return result.join('')
                    }

                    returntxt(container, "#", getString(number))
                } else {
                    returntxt(container, "/", "Cannot generate a random string with the length of 0 or null.")
                }
            }
        }, {
            title: "contextmenu",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] != null && args[1] == "true" || args[1] == "false") {
                    contextmenu_enabled = getbool(args[1])
                    returntxt(container, "#", `web: contextmenu_enabled = ${contextmenu_enabled}`)
                } else {
                    returntxt(container, "/", `Cannot change the value of contextmenu_enabled to the value "${args[1]}"`)
                }
            }
        }, {
            title: "activateWallet",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] != null) {
                    if (!window.localStorage.getItem("user__cointsWaller")) {
                        new wallet(args[1], 0)
                        returntxt(container, "#", `Wallet created.`)
                    }
                }
            }
        }, {
            title: "readWallet",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] != null) {
                    if (args[1] == "current") {
                        const __json = JSON.parse(window.localStorage.getItem("user__coinsWallet"))
                        returntxt(container, "$", `Name: ${__json.displayName}, Coins: ${__json.coins}`)
                    }
                }
            }
        }, {
            title: "github",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] === "view") {
                    window.open(`https://github.com/${args[2]}`)
                } else if (args[1] === "edit") {
                    window.open(`https://github.dev/${args[2]}`)
                } else if (args[1] === "new") {
                    window.open(`https://github.com/new`)
                }
            }
        }, {
            title: "debug",
            args: true,
            run: function(args) {
                cmdSuccess = true

                if (args[1] === "instance") {
                    returntxt(container, "#", `Instance: ${identifier}`)
                }
            }
        },]

        /*
        COMMAND TEMPLATE

        {
            title: "",
            args: false,
            run: function(args) {
                cmdSuccess = true

                // do something
            }
        },

        */

        // Load wallet cmd

        class wallet {
            constructor(displayName, coins) {
                this.displayName = displayName
                this.coins = coins

                this.saveString = JSON.stringify({
                    displayName: this.displayName,
                    coins: this.coins
                })

                // window.localStorage.setItem(this.displayName + "__coinsWallet", this.saveString)
                window.localStorage.setItem("user__coinsWallet", this.saveString)
            }
        }

        function addCoins(coins) {
            const __json = JSON.parse(window.localStorage.getItem("user__coinsWallet"))
            __json.coins = __json.coins + coins
            window.localStorage.setItem("user__coinsWallet", JSON.stringify(__json))

            setTimeout(() => {
                addCoins(coins)
            }, 2000);
        }

        if (window.localStorage.getItem("user__coinsWallet")) {
            addCoins(1.5)
        }

        // Load custom commands

        for (command of this.cmds) {
            commands.push(command)
        }

        // Returns (new inputs/labels)

        // returntxt: moved to public function

        const returninput = function() {
            if (configOpts.readOnly !== true) {
                container.insertAdjacentHTML("beforeend", `
<form id="newline_form:${identifier}" style="display: inline-block;">
    <pre style="display: inline-block; color: ${colors.return.success}; margin: 0; text-shadow: ${colors.shadow.success};">[@user]</pre>
    <input placeholder="[&] New Line" name="cmd" id="cmd:${identifier}" autocomplete="off" style="display: inline-block;"></input>
    <button style="display: none;" id="submit:${identifier}">Submit</button>
</form>
            `)

                // Command Submit

                document.getElementById(`newline_form:${identifier}`).addEventListener('submit', e => {
                    e.preventDefault()
                    e.stopImmediatePropagation()

                    const cmdValue = document.getElementById(`newline_form:${identifier}`).cmd.value

                    returntxt(container, "@", cmdValue, "user", "--console3")

                    for (let command of commands) {
                        if (command.args) {
                            if (!cmdValue.search(command.title)) {
                                if (cmdValue.split(" ")[1]) {
                                    command.run(cmdValue.split(" "))
                                } else {
                                    returntxt(container, "/", `${cmdValue} requires arguments.`)
                                }

                                setTimeout(() => {
                                    cmdSuccess = false
                                }, 1);
                            }
                        } else {
                            if (command.title == cmdValue) {
                                command.run(cmdValue.split(" "))

                                setTimeout(() => {
                                    cmdSuccess = false
                                }, 1);
                            }
                        }
                    }

                    cmd_history.push([{ value: cmdValue }])
                    setTimeout(() => {
                        window.localStorage.setItem("cmd_history", JSON.stringify(cmd_history))
                    }, 1);

                    if (!cmdSuccess) { // Check is command was run
                        returntxt(container, "/", `${cmdValue} is not recognized as a valid command.`)
                    }

                    document.getElementById(`newline_form:${identifier}`).remove()

                    returninput()
                    document.getElementById(`cmd:${identifier}`).focus()
                })
            }

            document.addEventListener('contextmenu', event => {
                if (contextmenu_enabled == false) {
                    event.preventDefault()
                }
            });

            /* container.addEventListener("click", () => {
                document.getElementById("cmd").focus()
            }) */

            // Log Site Console Events

            console.log = function(msg) {
                returntxt(container, "@", msg, "webconsole_log")
            }

            console.warn = function(msg) {
                returntxt(container, "@", msg, "webconsole_warn")
            }

            console.error = function(msg) {
                returntxt(container, "@", msg, "webconsole_error")
            }
        }

        returntxt(container, "@", this.startmsg, "main", "--console2")
        returninput()

        if (this.callback) {
            this.callback({
                container: container,
                identifier: identifier,
                run: function(command) {
                    document.getElementById(`cmd:${identifier}`).value = command
                    document.getElementById(`submit:${identifier}`).click()
                }
            })
        }
    }, 0.0001);
}

terminal.prototype = {
    render: function(container, config, callback) {
        this.container = container
        this.configOpts = config
        this.callback = callback
    },
}