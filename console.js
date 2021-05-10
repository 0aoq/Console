// Params/Variables

var cmdSuccess = false

var cmd_history = []

var colors = {
    user: "rgb(79, 248, 116)",
    system: "rgb(248, 245, 79)",

    return: {
        success: "#fff",
        error: "rgb(255, 87, 87)"
    }
}

var commands = [{
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

                returntxt("#", `FILE INFORMATION: {
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

                returntxt("#", `{ "${await file.text()}" }`)
            }

            getFile()
        }
    }
}, {
    title: "time",
    args: false,
    run: function(args) {
        cmdSuccess = true

        returntxt("#", new Date().toLocaleString())
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
                returntxt("#", node[int].value)
                int++
            }
        }
    }
}]

// Returns (new inputs/labels)

const returntxt = function(type, msg, from, color) {
    if (from) {
        document.body.insertAdjacentHTML("beforeend", `
            <pre style="display: inline-block; color: ${color}">[${type}${from}]</pre>
            <pre style="display: inline-block;">${msg}</pre>
            <pre style="margin: 0; margin-bottom: 0;"></pre>
        `)
    } else {
        if (!type.search("/")) { // don't ask me to explain why this works, because I don't know
            document.body.insertAdjacentHTML("beforeend", `
                <pre style="color: ${colors.return.error}">[${type}] ${msg}</pre>
            `)
        } else {
            document.body.insertAdjacentHTML("beforeend", `
                <pre style="color: ${colors.return.success}">[${type}] ${msg}</pre>
            `)
        }
    }
}

const returninput = function(after) {
    document.body.insertAdjacentHTML("beforeend", `
        <form id="newline_form">
            <input placeholder="[&] New Line" name="cmd" id="cmd" autocomplete="off"></input>
            <button style="display: none;">Submit</button>
        </form>
    `)

    // Command Submit

    document.getElementById("newline_form").addEventListener('submit', e => {
        e.preventDefault()

        const cmdValue = document.getElementById("newline_form").cmd.value

        returntxt("@", cmdValue, "user", colors.user)

        for (let command of commands) {
            if (command.args) {
                if (!cmdValue.search(command.title)) {
                    if (cmdValue.split(" ")[1]) {
                        command.run(cmdValue.split(" "))
                    } else {
                        returntxt("/", `${cmdValue} requires arguments.`)
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

        var cmdRun = [{
            value: cmdValue
        }]

        cmd_history.push(cmdRun)
        setTimeout(() => {
            window.localStorage.setItem("cmd_history", JSON.stringify(cmd_history))
        }, 1);

        if (!cmdSuccess) {
            returntxt("/", `${cmdValue} is not recognized as a valid command.`)
        } else {
            returntxt("#", "Command ran successfully.")
        }

        document.getElementById("newline_form").remove()

        returninput()
        $("#cmd").focus()
    })

    document.body.addEventListener('keydown', () => {
        $("#cmd").focus()
    })

    // Log Site Console Events

    console.log = function(msg) {
        returntxt("@", msg, "webconsole_log")
    }

    console.warn = function(msg) {
        returntxt("@", msg, "webconsole_warn")
    }

    console.error = function(msg) {
        returntxt("@", msg, "webconsole_error")
    }
}

returntxt("@", "Console loaded.", "main", colors.system)
returninput()