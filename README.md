# Auto Commit
   A VS Code extension that automatically commits changes to your Git repository at specified intervals, helping developers save their work effortlessly.

## Features
   - Automatically commits changes at user-defined intervals.
   - Logs commit information (date, time, commit hash) to a log file.
   - Easy to start and stop via the command palette.

## Installation
   1. Open the Extensions view (`Ctrl+Shift+X`).
   2. Search for "Auto Commit".
   3. Click "Install" on the extension page.

## Usage
   1. Open a folder that is a Git repository.
   2. Open the Command Palette (`Ctrl+Shift+P`).
   3. Type "Start Auto-Commit" to begin automatic commits.
   4. To stop, use the Command Palette again and select "Stop Auto-Commit".

## Configuration
   You can configure the commit interval in minutes by adding the following to your settings:

   "auto-commit.interval": 5