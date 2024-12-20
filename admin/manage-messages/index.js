import { logout, redirectIfLoggedOut } from '../utils.js';

const saveMessage = async () => {
  const message = document.getElementById('message').value;
  const userId = localStorage.getItem('username'); 

  console.log('Message:', message);
  console.log('User ID:', userId);

  if (message.trim() === '') {
    alert('Please enter a message before saving.');
    return;
  }

  try {
    const response = await fetch('/message/save_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId ,message, date: new Date().toISOString()}),
    });

    if (response.ok) {
      alert('Message saved successfully!');
      document.getElementById('message').value = ''; // 입력란 초기화
      await fetchMessages(); // 메시지 목록 갱신
    } else {
      throw new Error('Failed to save message');
    }
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

const fetchMessages = async () => {
  try {
    const response = await fetch('/message/fetch_messages');
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched messages:', data);

      const messageTableBody = document.querySelector('#messageTable tbody');
      messageTableBody.innerHTML = ''; // 기존 메시지 목록 초기화

      data.forEach((message, index) => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.style.textAlign = 'center';
        idCell.textContent = index + 1;
        row.appendChild(idCell);

        const messageCell = document.createElement('td');
        messageCell.textContent = message.message;
        messageCell.classList.add('clickable');
        messageCell.addEventListener('click', () => SendMessage(message.message)); 
        row.appendChild(messageCell);

        const dateCell = document.createElement('td');
        dateCell.style.textAlign = 'center';
        dateCell.textContent = new Date(message.date).toLocaleDateString();
        row.appendChild(dateCell);

        const userCell = document.createElement('td');
        userCell.style.textAlign = 'center';
        userCell.textContent = message.userId;
        row.appendChild(userCell);

        const deleteCell = document.createElement('td');
        deleteCell.style.textAlign = 'center';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.setAttribute('data-id', message.id); // 서버에 전달할 ID
        deleteButton.onclick = () => deleteMessage(message.id, row); // 삭제 함수 호출
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        messageTableBody.appendChild(row);
      });
    } else {
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};


const deleteMessage = async (messageId, row) => {
  try {
    const response = await fetch(`/message/delete_message/${messageId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Message deleted successfully!');
      row.remove(); // UI에서 해당 행 삭제
    } else {
      throw new Error('Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
  }
};

const SendMessage = async (message) => {
  // 확인 창 표시
  const userConfirmed = confirm(`이 메세지를 사용자들에게 보내겠습니까?\n\n"${message}"`);
  if (!userConfirmed) {
    return; // 사용자가 취소하면 아무것도 하지 않음
  }

  // 메시지 전송
  try {
    const response = await fetch('/message/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      alert('Message sent to clients successfully!');
    } else {
      throw new Error('Failed to send message to clients');
    }
  } catch (error) {
    console.error('Error sending message to clients:', error);
  }
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  // 페이지가 로드되면 메시지 목록을 불러옴
  await fetchMessages();

  // 메시지 저장 버튼 클릭 시 saveMessage 함수 호출
  document.querySelector('#messageForm button').onclick = saveMessage;
};

redirectIfLoggedOut();
window.onload = main;
