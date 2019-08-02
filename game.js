function start() {
   init();
   //Перейти на игровой экран через сек, когда карты уже выложены на стол
   setTimeout(() => {
      document.querySelector('.start').classList.toggle('hidden');
      document.querySelector('.game').classList.toggle('hidden');
   }, 1000);
}

function restart() {
   deleteFrontCards();
   visibleBackCards();
   document.getElementById('score').textContent = '0';
   document.querySelector('.start').classList.remove('hidden');
   document.querySelector('.end').classList.add('hidden');
   
}

//Получить коллекцию div.front, удалить стили .closed, удалить вложенные img
function deleteFrontCards() {
   let frontCards = document.querySelectorAll('.front');
      for (let i = 0; i < frontCards.length; i++) {
         frontCards[i].classList.remove('closed');
         frontCards[i].children[0].remove();
      }
}

//получить коллекцию div.back, если у img есть .flip180 - удалить
//(актуально, если предыдущая игра была завершена)
function visibleBackCards() {
   let backCards = document.querySelectorAll('.back');
      for (let i = 0; i < backCards.length; i++) {
         if (backCards[i].children[0].classList.contains('flip180')) {
            backCards[i].children[0].classList.remove('flip180')
         }
      }
} 

function init() {
    
  //массив id карт
   let cards = [
      '2D','2H','2S','2C',
      '3D','3H','3S','3C',
      '4D','4H','4S','4C',
      '5D','5H','5S','5C',
      '6D','6H','6S','6C',
      '7D','7H','7S','7C',
      '8D','8H','8S','8C',
      '9D','9H','9S','9C',
      '0D','0H','0S','0C',
      'JD','JH','JS','JC',
      'QD','QH','QS','QC',
      'KD','KH','KS','KC',
      'AD','AH','AS','AC'
   ]

   //Массив для карт, которые будут учавствовать в игре
   let cardsInGame = [];

    //Функция для микса
    function arrMix(arr) {
      return arr.sort(function () {
         return (Math.random() - 0.5);
      });
   }

   //запустить игру
   startGame();

   function startGame() {

      //Перемешать колоду
      cards = arrMix(cards);

      //Сгенерировать случайное целое число от 0 до 52-i (9 раз)
      //выбрать карту из массива под индексом со случайным числом
      //удалить карту из исходного массива и добавить в игровой
      for (let i = 0; i < 9; i++) {
         let randomNum = Math.floor(Math.random() * (52 - i));
         cardsInGame.push(cards[randomNum]);
         cards.splice(randomNum, 1);
      }
      
      //дублировать игровой массив и перемешать
      cardsInGame = cardsInGame.concat(cardsInGame);
      cardsInGame = arrMix(cardsInGame);

      //получить коллекцию div.front и навешать событие по клику
      let frontBlock = document.querySelectorAll('.front'); 
      for (let i = 0; i <frontBlock.length; i++) {
         frontBlock[i].addEventListener('click', showCard);  
      }

      //Добавить карты из игрового массива на стол
      for (let i = 0; i < cardsInGame.length; i++) {
         let newCard = document.createElement('img');                //создать img
         newCard.src = 'assets/cards/' + cardsInGame[i] + '.png';    //путь 
         newCard.classList.add('card', 'flip180');                   //добавить стили css
         frontBlock[i].dataset.id = cardsInGame[i];                    //присвоить data-атрибут
         frontBlock[i].appendChild(newCard);                           //добавить в div.front
      }

      //закрыть карты
      //Получить коллекцию элементов img и перевернуть
      function cardsClosed() {
         let cards = document.querySelectorAll('img.card');
            for (let i = 0; i < cards.length; i++) {
               cards[i].classList.toggle('flip180');
            }
      }
      setTimeout(cardsClosed, 3000);
      setTimeout(cardsClosed, 8000);

      //Массив для передержки карт ко нажатию. Не может содержать больше 2 карт
      let clickedCard = [];
      let score = 0;
      let scoreItem = document.getElementById('score');

      //Показать карту по клику
      //если выбранная карта закрыта и открыто меньше 2 карт 
      //открыть карту и добавить в массив для сравнения, записать игроку 5 очков и показать сумму
      //если уже открыто 2 карты - вызвать функцию сравнения через секунду
      function showCard(event) {
         let target = event.target; //div.front

         //если первый и единственный ребенок div.front, т.е. img, имеет стили .flip180 (закрытая карта) - 
         //открой img и закрой первого и единтвенного ребенка (img) соседа (div.back)
         if (target.children[0].classList.contains('flip180') && clickedCard.length < 2) {
            target.children[0].classList.toggle('flip180');
            target.nextElementSibling.children[0].classList.toggle('flip180');
            clickedCard.push(target);
            scoreItem.textContent = score += 5;

            if (clickedCard.length == 2) {
               setTimeout(compare, 1000);
            }
         }
      }

      //Сравнить две карты
      //если id двух карт одинаковые - вывести иx из игры и проверить, не закончилась ли игра
      //если не одинаковые - закрыть карты, отнять очки
      function compare() {
         if (clickedCard[0].dataset.id === clickedCard[1].dataset.id) {
            scoreItem.textContent = score  += 20;
            inactiveCard();
            checkGameOver();
         } else {
            clickedCard[0].children[0].classList.toggle('flip180');
            clickedCard[0].nextElementSibling.children[0].classList.toggle('flip180');
            clickedCard[1].children[0].classList.toggle('flip180');
            clickedCard[1].nextElementSibling.children[0].classList.toggle('flip180');
            scoreItem.textContent = score -= 10;
         } 
         clickedCard = [];
      }

      //вывести карты из игры (остаются на столе, становятся неактивными из-за стиля)
      function inactiveCard() {
         clickedCard[0].classList.add('closed');
         clickedCard[1].classList.add('closed');
      }

      //игра окончена или нет
      //получить коллекцию открытых карт, и если все карты на столе открыты (18 карт) - игра закончена
      //передать управление функции gameOver
      //если открытых карт не 18 - выйти из функции
      function checkGameOver() {
         let card = document.getElementsByClassName('closed');
            if (card.length === 18) {
               gameOver();
            } else {
               return;
            }
      }

      //перейти на экран поздравления, показать финальный счет
      function gameOver() {
         document.querySelector('.game').classList.toggle('hidden');
         document.querySelector('.end').classList.toggle('hidden');
         document.getElementById('total').textContent = score;
      }
   }
}
