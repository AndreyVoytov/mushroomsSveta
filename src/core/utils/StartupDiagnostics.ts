import Game from '../../view/game/Game';
import UserService from '../service/UserService';

// Opt-in, local-only report: no saved player data or network upload.
export default class StartupDiagnostics {
    public static start(): void {
        if (!/[?&]loaddebug(?:=|&|$)/.test(window.location.search)) return;

        const started = Date.now();
        let lastCompleted = started;
        let lastFile = '(ещё нет)';
        let observedGame: any = null;
        const events: string[] = [];
        const log = (message: string) => {
            events.push(Math.round((Date.now() - started) / 1000) + 'с: ' + message);
            if (events.length > 12) events.shift();
        };
        window.addEventListener('error', (event: ErrorEvent) => {
            log('Ошибка: ' + event.message + ' ' + (event.filename || '').split('/').pop() + ':' + event.lineno);
        });
        window.addEventListener('unhandledrejection', (event: any) => {
            log('Promise: ' + String(event.reason && event.reason.message || event.reason));
        });

        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;left:4px;right:4px;bottom:4px;z-index:2147483647;padding:8px;background:#fff;color:#111;border:2px solid #555;font:13px sans-serif;';
        const title = document.createElement('div');
        title.textContent = 'Диагностика загрузки — load-debug-1';
        const report = document.createElement('textarea');
        report.readOnly = true;
        report.setAttribute('aria-label', 'Отчёт загрузки');
        report.style.cssText = 'display:block;box-sizing:border-box;width:100%;height:24vh;margin:6px 0;font:12px monospace;color:#111;background:#fff;';
        const copy = document.createElement('button');
        copy.textContent = 'Скопировать отчёт';
        copy.style.cssText = 'font:16px sans-serif;padding:8px;';
        copy.onclick = () => {
            report.focus();
            report.select();
            report.setSelectionRange(0, report.value.length);
            const clipboard = (navigator as any).clipboard;
            const fallback = () => {
                copy.textContent = document.execCommand('copy') ? 'Отчёт скопирован' : 'Выделите и скопируйте текст';
            };
            if (clipboard && clipboard.writeText) {
                clipboard.writeText(report.value).then(() => copy.textContent = 'Отчёт скопирован', fallback);
            } else fallback();
        };
        panel.appendChild(title);
        panel.appendChild(report);
        panel.appendChild(copy);
        document.body.appendChild(panel);

        const refresh = () => {
            const game: any = Game.getInstance();
            if (game && observedGame !== game) {
                observedGame = game;
                game.load.onFileComplete.add((progress: number, key: string, success: boolean) => {
                    lastCompleted = Date.now();
                    lastFile = key + (success ? ' OK' : ' ERROR');
                    if (!success) log('Не загрузился файл: ' + key);
                });
                game.load.onLoadComplete.add(() => log('Очередь загрузки завершена'));
                game.canvas.addEventListener('webglcontextlost', () => log('Потерян WebGL-контекст'));
            }
            const lines = [
                'load-debug-1 / ' + Math.round((Date.now() - started) / 1000) + 'с',
                navigator.userAgent,
                'Экран: ' + window.innerWidth + 'x' + window.innerHeight + ', DPR: ' + window.devicePixelRatio
            ];
            if (!game) lines.push('Ожидание создания игры / локализации');
            else {
                const loader: any = game.load;
                const state = game.state.current;
                lines.push('Этап: ' + (state === 'LoadingScreen' || state === 'BootSettings' ? state : 'Игровой экран'));
                lines.push('Рендер: ' + (game.renderType === Phaser.WEBGL ? 'WebGL' : 'Canvas')
                    + ', пауза: ' + game.paused + ', WebP: ' + Game.CAN_USE_WEBP);
                lines.push('Загрузка: ' + loader.isLoading + ', файлы: ' + loader._loadedFileCount + '/' + loader._totalFileCount);
                lines.push('Последний: ' + lastFile + ', ' + Math.round((Date.now() - lastCompleted) / 1000) + 'с назад');
                lines.push('Профиль готов: ' + UserService.userLoaded);
                (loader._flightQueue || []).forEach((file: any) => {
                    const xhr = file.requestObject;
                    lines.push('Ожидание: ' + file.key + ' [' + file.type + '] '
                        + String(file.requestUrl || file.url).split('?')[0]
                        + (xhr && typeof xhr.readyState === 'number' ? ' readyState=' + xhr.readyState : ''));
                });
                const gl = game.renderer && game.renderer.gl;
                if (gl) lines.push('WebGL потерян: ' + gl.isContextLost());
            }
            lines.push.apply(lines, events);
            // Leave the selected text stable while the user copies it manually.
            if (document.activeElement !== report) report.value = lines.join('\n');
        };
        refresh();
        window.setInterval(refresh, 1000);
    }
}
