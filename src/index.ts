import SmallSizeInfo from '@components/SmallSizeInfo/SmallSizeInfo';
import '@style/index.styl';
import Root from '@views/Root';

new SmallSizeInfo(document.body);
new Root(document.body);


// const ws = new WebSocket('wss://vdonate.ml:1234/ws?userID=5');
// ws.addEventListener('open', (e) => {
//   alert('Соединение открыто');
// });
// ws.addEventListener('message', (e) => {
//   alert(e.data);
// });
// ws.addEventListener('close', (e) => {
//   if (e.wasClean) {
//     alert(`Соединение закрыто чисто, код=${e.code} причина=${e.reason}`);
//   } else {
//     // например, сервер убил процесс или сеть недоступна
//     // обычно в этом случае event.code 1006
//     alert('Соединение прервано ' + e.code.toString());
//   }
// });
// ws.addEventListener('error', (e) => {
//   alert('ОШИБКА');
// });
