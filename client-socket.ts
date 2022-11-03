import * as readline from 'readline';
import { io } from 'socket.io-client';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getInput = (msg: string): Promise<string> =>
  new Promise((resolve) => {
    rl.question(msg, (data) => {
      resolve(data);
    });
  });

const socket = io('http://localhost:3000');

const isConnected = (): Promise<boolean> =>
  new Promise((resolve) => {
    socket.on('connect', async function () {
      console.log('Connected');
      resolve(true);
    });
  });

const sendMessage = async (room: string) => {
  const msg = await getInput('Type message: ');
  socket.emit('message', { roomName: room, msg });

  return sendMessage(room);
};

async function main() {
  await isConnected();
  const room = await getInput('enter room you want to enter: ');
  socket.emit('enter-room', room);

  socket.on(room, console.log);
  socket.on('new-member', console.log);
  socket.on('technician', console.log);

  sendMessage(room);
}
main();
