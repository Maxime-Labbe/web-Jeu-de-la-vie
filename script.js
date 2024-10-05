function handleClick(e, board) {
    const stopButton = document.querySelector('.stop');
    if (stopButton.textContent.includes("Effacer")) {
        if (board[e.target.id] == 0) {
            board[e.target.id] = 1;
        } else {
            board[e.target.id] = 0;
        }
        PrintBoard(board);
    }
}

function addCases(board) {
    const $cases = document.querySelectorAll('.case_border');
    $cases.forEach(elem => {
        elem.addEventListener('click', (e) => handleClick(e, board));
        elem.handleClick = (e) => handleClick(e, board);
    });
}

function RemoveCases(board) {
    const $cases = document.querySelectorAll('.case_border');
    const $startButton = document.querySelector('.start');
    $startButton.addEventListener('click', () => {
        $cases.forEach(elem => {
            elem.removeEventListener('click', elem.handleClick);
        });
    });
}

function InitBoard(taille) {
    let board = new Array(taille).fill(0);
    const $container = document.querySelector('.container');

    for (let i = 0; i < taille; i++) {
        let caseBorder = document.createElement('div');
        caseBorder.className = 'case_border';
        caseBorder.id = i.toString();
        let caseDiv = document.createElement('div');
        caseDiv.className = 'case';
        caseDiv.id = i.toString();
        caseBorder.appendChild(caseDiv);
        $container.appendChild(caseBorder);
    }

    RemoveCases(board);
    addCases(board);

    return board;
}

function PrintBoard(board, cases = document.querySelectorAll('.case')) {
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 1) {
            cases[i].classList.add('active');
        } else {
            cases[i].classList.remove('active');
        }
    }
}

function ChangeBoard(board) {
    const NewBoard = [...board];
    i = 0;
    length = Math.sqrt(board.length);
    while (i < board.length) {
        const nb_voisins = [i % length != 0 ? board[(i - 1)] : 0,
        (i % length != 0 && i >= length) ? board[i - 1 - length] : 0,
        i >= length ? board[i - length] : 0,
        (i % length != length - 1 && i >= length) ? board[i + 1 - length] : 0,
        i % length != length - 1 ? board[i + 1] : 0,
        (i % length != length - 1 && i <= board.length - length) ? board[i + 1 + length] : 0,
        i <= board.length - length ? board[i + length] : 0,
        (i % length != 0 && i <= board.length - length) ? board[i - 1 + length] : 0]
            .filter(x => x == 1).length;
        if (nb_voisins < 2 || nb_voisins > 3) {
            NewBoard[i] = 0;
        } else {
            if (nb_voisins == 3) {
                NewBoard[i] = 1;
            }
        }
        i++;
    }
    return NewBoard;
}

function GameOfLife() {
    let Board = InitBoard(1600);
    let intervalId = null;
    let gen = 0;
    const $startButton = document.querySelector('.start');
    const $stopButton = document.querySelector('.stop');
    const $speedSlider = document.querySelector('.slider');
    const $speedValue = document.querySelector('.speed');

    $speedSlider.addEventListener('input', () => {
        $speedValue.innerHTML = "Vitesse : " + $speedSlider.value + "ms";
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                Board = ChangeBoard(Board);
                gen++;
                document.querySelector('.gen').innerHTML = "Génération " + gen;
                PrintBoard(Board);
            }, $speedSlider.value);
        }
    });

    $speedSlider.addEventListener('change', () => {
        const $cases = document.querySelectorAll('.case');
        const transitionSpeed = "all " + ($speedSlider.value < 100 ? 0 : $speedSlider.value < 250 ? $speedSlider.value * 1.5 : 500) + "ms";
        $cases.forEach(elem => {
            elem.style.transition = transitionSpeed;
        });
    });

    $startButton.addEventListener('click', () => {
        if (intervalId !== null) return;
        $stopButton.innerHTML = "<p>Arrêter</p>";
        intervalId = setInterval(() => {
            Board = ChangeBoard(Board);
            gen++;
            document.querySelector('.gen').innerHTML = "Génération " + gen;
            PrintBoard(Board);
        }, $speedSlider.value);
    });

    $stopButton.addEventListener('click', () => {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
            addCases(Board);
            $stopButton.innerHTML = "<p>Effacer</p>";
        } else {
            for (let i = 0; i < Board.length; i++) {
                Board[i] = 0;
            }
            PrintBoard(Board);
        }
    });
}

GameOfLife();