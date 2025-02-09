# Obsidian arXiv Paper Linker

A simple Obsidian plugin that helps you quickly search and link to arXiv papers in your notes.

## Features

- Search arXiv papers directly from Obsidian
- Convert text selections into links to arXiv papers
- View paper details including title, authors, and publication date
- Fast search using arXiv's official API

## How to Use

### Using the Command Palette
1. Select text in your note
2. Open the command palette (Ctrl/Cmd + P)
3. Search for "Create arXiv Link from Selection"
4. Choose the relevant paper from search results
5. The selected text will be automatically converted into a link to the arXiv paper

### Alternative: Using a Hotkey
1. Go to Settings > Hotkeys
2. Assign a hotkey to the "Create arXiv Link from Selection" command
3. Select text in your note
4. Use your configured hotkey
5. Choose the relevant paper from search results
6. The selected text will be automatically converted into a link to the arXiv paper

## Installation

### From Obsidian Community Plugins
1. Open Settings in Obsidian
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "arXiv Paper Linker"
4. Install the plugin
5. Enable the plugin in your list of installed plugins

### Manual Installation
1. Clone this repository
2. Install Node.js and npm
3. Run `npm install` to install dependencies
4. Run `npm run build` to build the plugin
5. Create a folder `.obsidian/plugins/arxiv-paper-linker` in your Obsidian vault
6. Copy `main.js`, `manifest.json`, and `styles.css` to the folder
7. Reload Obsidian
8. Enable the plugin in your list of installed plugins

## Development
1. Clone this repository
2. Install Node.js and npm
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start compilation in watch mode

## License
MIT
