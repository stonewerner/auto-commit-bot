import * as vscode from 'vscode';
import simpleGit from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';

let intervalId: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Auto-Commit extension is now active!');

    let startDisposable = vscode.commands.registerCommand('auto-commit.start', () => {
        startAutoCommit();
    });

    let stopDisposable = vscode.commands.registerCommand('auto-commit.stop', () => {
        stopAutoCommit();
    });

    context.subscriptions.push(startDisposable, stopDisposable);
}

async function makeCommit() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const git = simpleGit(rootPath);

    // Check if the directory is a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
        vscode.window.showErrorMessage('Current workspace is not a git repository');
        return;
    }

    const now = new Date();
    const dateTimeString = now.toISOString();

    try {
        await git.add('.');
        const commitResult = await git.commit(`Auto-commit: ${dateTimeString}`);
        const commitHash = commitResult.commit;

        await git.push('origin', 'main');

        const logEntry = `Commit made at ${dateTimeString}\nCommit Hash: ${commitHash}\n\n`;
        const logPath = path.join(rootPath, 'auto-commit-log.txt');
        fs.appendFileSync(logPath, logEntry, 'utf8');

        vscode.window.showInformationMessage('Auto-commit successful');
    } catch (error) {
        vscode.window.showErrorMessage(`Auto-commit failed: ${error}`);
    }
}

function startAutoCommit() {
    if (intervalId) {
        vscode.window.showInformationMessage('Auto-Commit is already running');
        return;
    }

    const config = vscode.workspace.getConfiguration('auto-commit');
    const intervalMinutes = config.get<number>('interval') || 5;
    const intervalMs = intervalMinutes * 60 * 1000;

    intervalId = setInterval(makeCommit, intervalMs);
    vscode.window.showInformationMessage(`Auto-Commit started (interval: ${intervalMinutes} minutes)`);
}

function stopAutoCommit() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
        vscode.window.showInformationMessage('Auto-Commit stopped');
    } else {
        vscode.window.showInformationMessage('Auto-Commit is not running');
    }
}

export function deactivate() {
    if (intervalId) {
        clearInterval(intervalId);
    }
}