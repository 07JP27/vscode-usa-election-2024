import * as vscode from 'vscode';
import axios from 'axios';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);

    // 初回の更新
    updateStatus();

    // 1分ごとに更新
    setInterval(updateStatus, 60000);
}

async function updateStatus() {
    try {
        const response = await axios.get('https://data.ddhq.io/electoral_college/2024');
        const candidates = response.data.candidates;

        const harrisVotes = candidates.find((c: any) => c.last_name === 'Harris')?.electoral_votes_total || 0;
        const trumpVotes = candidates.find((c: any) => c.last_name === 'Trump')?.electoral_votes_total || 0;

        const status = `Harris(${harrisVotes}) vs Trump(${trumpVotes})`;
        statusBarItem.text = status;
        statusBarItem.show();
    } catch (error) {
        console.error('Error updating election status:', error);
    }
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
