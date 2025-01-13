Check out my chat app on https://react-chat-app-front.vercel.app/

Chat Implementation:

Login and Logout:
Users must log in by entering their first and last names. A Logout button is also available.

Default Chats:
Upon logging in, the user sees three "default" (empty) chats. The user can click on any chat and send a message. After a 3-second delay, the user receives a response from the backend in the form of a quote and author, fetched by the backend from the ZenQuotes API via an HTTP request using Axios. All messages are stored in the database, so when the user logs in again, they will see all sent and received messages in the default chats.

New Chat Creation:
The "New Chat" button allows the user to create a new chat by entering any name and surname of the person they wish to chat with in a dialog box. The user can create as many chats as they like, add messages to them, and receive automatic replies from the backend via the ZenQuotes API. The same principle applies to created chats as to default ones: all messages, as well as the name and surname of the "conversation partner," are saved to the database and remain accessible upon the user’s next login.

Delete Chat:
Next to the name of each chat in the chat list, there is a red button that allows the user to delete any chat, with a confirmation prompt before the action is executed.

Frontend:
Built using React.js, a library for building user interfaces.
Utilized Vite for fast project building and optimization, providing instant rebuilds and high performance during development.
Data from the frontend (messages, chats, users) is sent to the server via WebSocket, where it is processed and stored in MongoDB Atlas, a cloud service for MongoDB data storage.

Backend:
Built using Express.js, a web framework for Node.js, enabling HTTP request handling and the implementation of a RESTful API.
Socket.io is used for real-time communication, enabling bidirectional interaction between the client and server.
The backend supports creating and deleting chats, as well as storing message history for each chat.

Database:
MongoDB Atlas is used to store chat data, including the user's first and last names, their chats, and messages.

Deployment:
The backend (server) is deployed on Render, which supports automatic deployment of applications using WebSocket.
The frontend is deployed on Vercel.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Реалізація чату:

- Login and Logout: Користувачу потрібно залогінитися, ввівши прізвище та ім'я. Також є кнопка Logout.

- Дефолтні чати: Залогований користувач одразу бачить 3 "дефолтних" чати (пустих). Користувач може клікнути на будь-яких чат і написати повідомлення. Із затримкою 3 сек. він отримує відповідь з бекенду у вигляді цитати відомої людини і автора (бекенд у свою чергу отримує цю цитати від ZenQuotes API через http запит через axios). Всі повідомлення зберігаються в базі даних і перелогувавшись користувач побачить всі повідомлення (отримані і відправлені) в дефолтних чатах.

-  Створення нового чату: Кнопка New Chat дозволяє створити новий чат, ввівши в діалоговому вікні довільні ім`я та прізвище людини, з ким користувач буде вести діалог. Користувач може створювати  скільки завгодно чатів, додавати повідомлення до них та отримувати автоматичні відповіді з бекенда від ZenQuotes API . Зі створеними чатами реалізовано той самий принцип, що і з попередньо визначеними: всі повідомлення та ім'я і прізвище "співрозмовника" зберігаються в базу даних і є доступними при наступному логуванні конкретного користувача. 

- Видалення чату: Біля назви кожного чату у списку чатів також є червона кнопка, що дозволяє видалити будь-який чат, попередньо підтвердивши цю дію.
  
Фронтенд:
- Реалізовано за допомогою React.js, бібліотеки для створення інтерфейсів користувача. 
- Використано Vite для швидкої збірки та оптимізації проекту, що забезпечує миттєву перезбірку та високу продуктивність при розробці.
- Дані з фронтенду (повідомлення, чати, користувачі) передаються на сервер через WebSocket, де вони обробляються та зберігаються у MongoDB Atlas — хмарному сервісі для зберігання даних MongoDB.

Бекенд:
- Реалізовано за допомогою Express.js, веб-фреймворку для Node.js, який забезпечує обробку HTTP запитів та реалізацію RESTful API.
- Для зв'язку в реальному часі використовується Socket.io, що дозволяє здійснювати двостороннє спілкування між клієнтом і сервером.
- Бекенд також підтримує можливість створення та видалення чатів, а також збереження історії повідомлень для кожного чату.

База даних:
- Використано MongoDB Atlas для зберігання даних чату, таких як ім'я та прізвище  користувача, його чати та повідомлення. 

Розгортання:
- Бекенд (server) розгорнуто на платформі Render, що дозволяє автоматично розгортати додаток, що працює з WebSocket.
- Фронтенд розгорнуто на платформі Vercel. 
