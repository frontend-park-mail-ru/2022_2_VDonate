import {addBackNotice, clearAllBackNotice} from '@actions/handlers/backNotice';
import {notice} from '@actions/handlers/notice';

class WebSocketNotice {
  private ws?: WebSocket;

  constructor(private baseURL: string) {

  }

  init(userID: number) {
    if (this.ws) return;

    this.ws = new WebSocket(this.baseURL + userID.toString());
    this.ws.addEventListener('open', () => console.log('Соединение открыто'));
    this.ws.addEventListener('message', (e) => {
      this.onMessage(e.data as string);
    });
    this.ws.addEventListener('close', (e) => {
      if (e.wasClean) {
        console.warn(`WS clear close, code=${e.code} reason=${e.reason}`);
      } else {
        console.error('WS Code: ' + e.code.toString());
      }
    });
    this.ws.addEventListener('error', () =>
      notice('Ошибка соединения с сервером. Перезагрузите страницу.'));
  }

  private onMessage(data: string) {
    addBackNotice(data);
  }

  clearAll() {
    this.ws?.send(JSON.stringify({
      cancel: true,
    }));
    clearAllBackNotice();
    notice('Уведомления очищены', 'info');
  }

  close() {
    this.ws?.close(1000, 'logout');
    this.ws = undefined;
    clearAllBackNotice();
  }
}

export default new WebSocketNotice('wss://vdonate.ml:1234/ws?userID=');
