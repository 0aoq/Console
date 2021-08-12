let cmdSuccess = false

let colors = {
    user: "rgb(79, 248, 116)",
    system: "rgb(248, 245, 79)",

    return: {
        success: this.textcolor,
        error: "rgb(255, 87, 87)"
    }
}

const returntxt = function(container, type, msg, from, color) {
    if (from) {
        container.insertAdjacentHTML("beforeend", `
<p>
<pre style="display: inline-block; color: ${color || "#fff"}; margin: 0;"">[${type}${from}]</pre>
<pre style="display: inline-block; margin: 0;">${msg}</pre>
</p>
`)
    } else {
        if (!type.search("/")) {
            container.insertAdjacentHTML("beforeend", `
    <pre style="color: ${colors.return.error}; margin: 0;">[${type}] ${msg}</pre>
`)
        } else {
            container.insertAdjacentHTML("beforeend", `
    <pre style="color: ${colors.return.success}; margin: 0;">[${type}] ${msg}</pre>
`)
        }
    }
}

function terminal() {
    setTimeout(() => {
        let container = this.container
        this.background = this.configOpts.background || "rgb(30, 32, 48)"
        this.textcolor = this.configOpts.textcolor || "#fff"
        this.startmsg = this.configOpts.startmsg || "Web console test running successfully"
        this.cmds = this.configOpts.cmds || []

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
    :root {
        --console-background: ${this.background};
    }

    .--consoleRendered {
        overflow-x: hidden;
        background: var(--console-background);
        font-family: Segoe WPC,Segoe UI,sans-serif;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeSpeed;
        margin: 0;
        overflow-wrap: break-word;
        padding: 0;
        word-wrap: break-word;
        color: white;
        height: 100%;
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
        margin: 0;
        margin-bottom: 0.3em;
        margin-top: 0;
    }
            
    .--consoleRendered input {
        background: transparent;
        resize: none;
        outline: none;
        height: auto;
        color: white;
        display: block;
        border: none;
        font-family: monospace;
        white-space: pre;
        width: 100vw;
        margin-top: 0.5em;
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

                document.body.innerHTML = ""
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
        }, ]

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
            container.insertAdjacentHTML("beforeend", `
                <form id="newline_form">
                    <input placeholder="[&] New Line" name="cmd" id="cmd" autocomplete="off"></input>
                    <button style="display: none;">Submit</button>
                </form>
            `)

            // Command Submit

            document.getElementById("newline_form").addEventListener('submit', e => {
                e.preventDefault()

                const cmdValue = document.getElementById("newline_form").cmd.value

                returntxt(container, "@", cmdValue, "user", colors.user)

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

                document.getElementById("newline_form").remove()

                returninput()
                document.getElementById("cmd").focus()
            })

            document.addEventListener('contextmenu', event => {
                if (contextmenu_enabled == false) {
                    event.preventDefault()
                }
            });

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

        returntxt(container, "@", this.startmsg, "main", colors.system)
        returninput()
    }, 1);
}

terminal.prototype = {
    render: function(container, config) {
        this.container = container
        this.configOpts = config
    },
}