# Discord Furigana Injector

<img width=430 src="https://user-images.githubusercontent.com/4116708/28990536-b669da42-797e-11e7-9e68-4d8bd42d0a92.png" />

## Usage

- Make sure you have [mecab](https://github.com/taku910/mecab)
    - On OS X: `brew install mecab`
    - On Ubuntu: `sudo apt-get install mecab mecab-ipadic mecab-ipadic-utf8`

- Open the Discord developer console `View` → `Developer` → `Toggle Developer Tools`
    - On OS X: <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>I</kbd>
    - Other: <kbd>CTRL</kbd> + <kbd>⇧</kbd> + <kbd>I</kbd>

- Paste in the content of `furigana.js`

To stop the injection, either execute `clearInterval(a)` or restart Discord with <kbd>⌘</kbd> + <kbd>R</kbd> / <kbd>CTRL</kbd> + <kbd>R</kbd>

## Future

- Use [mecab-emscripten](https://github.com/fasiha/mecab-emscripten) to allow for easy cross-platform distribution with no need for manual installing of mecab
- Find a cleaner way to inject furigana
- Make installers for easy installation that do not involve pasting in the console
