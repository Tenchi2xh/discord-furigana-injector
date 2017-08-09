const os = require('os');
const fs = require("fs");
const asar = require("asar");

const classIdentifier = "className: 'quote'";
const stateIdentifier = "this.state.quote";
const mainWindowOptionsIdentifier = "var mainWindowOptions = {";
const discordIdentifier = "title: 'Discord'";
const domReadyEventCallerIdentifier = "mainWindow.webContents.on('dom-ready'";


const EXITCODE = {
    OK: 0,
    PLATFORM_NOT_SUPPORTED: 1,
    PERMISSIONS_ERROR: 2
};

let config = {
    path: ""
};

switch(os.platform()) {
    case "linux":
        config.path = "/usr/share/discord/resources/app.asar";
    break;
    default:
        process.exit(EXITCODE.PLATFORM_NOT_SUPPORTED);
    break;
}

if(!fs.existsSync('tmp'))
    fs.mkdirSync('tmp');

asar.extractAll(config.path, 'tmp');

// reason nr.1 to hate babel: variable names can change without notice and there's no way to get the original
let splashFile = fs.readFileSync('tmp/splash/Splash.js').toString();
let quoteItemIndex = splashFile.indexOf(classIdentifier);
let quoteUsage = splashFile.indexOf(stateIdentifier, quoteItemIndex);
splashFile = splashFile.substr(0, quoteUsage) + `(this.state.quote + "\\nUsing: Discord-Furigana-Injector")` + splashFile.substr(quoteUsage + stateIdentifier.length, splashFile.length);
fs.writeFileSync('tmp/splash/Splash.js', splashFile);

// reason nr.2 to hate babel: ugly unreadable code
let indexFile = fs.readFileSync('tmp/index.js').toString();
let optionsIndex = indexFile.indexOf(mainWindowOptionsIdentifier);
let discordTitleIndex = indexFile.indexOf(discordIdentifier, optionsIndex);
indexFile = indexFile.substr(0, discordTitleIndex) + "title: 'Discord with furigana plugin (beta)'" + indexFile.substr(discordTitleIndex + discordIdentifier.length, indexFile.length);

let domReadyEventCallerIndex = indexFile.indexOf(domReadyEventCallerIdentifier);
var js = fs.readFileSync('furigana.js').toString();
js = js.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"').
        replace(/`/g, '\\`');
indexFile = indexFile.substr(0, domReadyEventCallerIndex) + `
mainWindow.webContents.on('dom-ready', (event) => {
    var nodeConsole = require('console');
    var console = new nodeConsole.Console(process.stdout, process.stderr);
    console.log(event);
    setTimeout(() => {
        mainWindow.webContents.executeJavaScript("${js}");
    }, 500);
});
` + indexFile.substr(domReadyEventCallerIndex, indexFile.length);
fs.writeFileSync('tmp/index.js', indexFile);

asar.createPackage('tmp/', __dirname+'/app.asar', function() {
    try {
        fs.renameSync(config.path, config.path + ".bak");
    } catch (e) {
        console.error("Permissions error");
        process.exit(EXITCODE.PERMISSIONS_ERROR);
    }
    try {
        fs.renameSync(__dirname + '/app.asar', config.path);
    } catch (e) {
        fs.renameSync(config.path + ".bak", config.path);
        console.error("Permissions error, asar");
        throw e;
        process.exit(EXITCODE.PERMISSIONS_ERROR);
    }
});