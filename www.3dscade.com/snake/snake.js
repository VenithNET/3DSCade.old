$(document).ready(function() {
    SNAKE.init();
});

var SNAKE = (function() {
    var MAXSNAKELENGTH = 1000;

    var WIDTH = 80;
    var HEIGHT = 50;

    var EMPTY = 0;
    var SNAKE = 1;
    var WALL = 2;
    var NUMBER = 3;

    var UP = 0;
    var DOWN = 1;
    var LEFT = 2;
    var RIGHT = 3;

    var STARTING = 0;
    var PLAYING = 1;
    var CRASHED = 2;
    var GAMEOVER = 3;

    var screen;
    var canvas;
    var context;
    var numbers;

    var interval;
    var paused;

    var player;
    var state;

    function init()
    {
        player = {
            x: 49,
            y: 24,
            tail: [],
            length: 2,
            direction: UP
        };

        state = {
            score: 0,
            level: 0,
            lives: 5,
            number: -1,
            state: STARTING
        };

        screen = [];
        canvas = $("#game")[0];
        context = canvas.getContext('2d');
        paused = false;

        if(!numbers)
        {
            numbers = $("<div>")
                .css("width", "4px")
                .css("height", "8px")
                .css("background-image", "url(numbers.png)")
                .css("position", "absolute");
        }
        else
        {
            numbers.remove();
        }

        context.fillStyle = "black";
        context.fillRect(0, 0, 400, 240);

        constructLevel();
        selectNumber();
        drawLives();

        $("#level").text(state.level + 1);
        $("#score").text(state.score);

        $(document).keydown(function(event) {
            if(event.keyCode == 37 && player.direction != RIGHT) player.direction = LEFT;
            if(event.keyCode == 38 && player.direction != DOWN) player.direction = UP;
            if(event.keyCode == 39 && player.direction != LEFT) player.direction = RIGHT;
            if(event.keyCode == 40 && player.direction != UP) player.direction = DOWN;
        });
    }

    function drawLives()
    {
        $("#livesbg").empty();

        for(var i=0; i<state.lives; i++)
        {
            $("#livesbg").append($("<img>").attr("src", "life.png"))
        }
    }

    function fillOuterWall()
    {
        for(var y=0; y<50; y++)
        {
            screen[y][0] = WALL;
            screen[y][79] = WALL;
        }

        for(var x=0; x<80; x++)
        {
            screen[0][x] = WALL;
            screen[49][x] = WALL;
        }
    }

    function drawCell(x, y)
    {
        if(screen[y][x] == WALL) context.fillStyle = "red";
        else if(screen[y][x] == SNAKE) context.fillStyle = "yellow";
        else context.fillStyle = "blue";

        context.fillRect(x*5, y*4+20, 5, 4);
    }

    function drawScreen()
    {
        context.fillStyle = "blue";
        context.fillRect(0, 20, 80*5, 50*4);

        for(var y=0; y<50; y++)
        {
            for(var x=0; x<80; x++)
            {
                if(screen[y][x] != EMPTY) drawCell(x, y);
            }
        }
    }

    function selectNumber()
    {
        // Clear previous
        if(state.numberx)
        {
            screen[state.numbery][state.numberx] = EMPTY;
            screen[state.numbery+1][state.numberx] = EMPTY;
        }

        if(state.number > 0)
        {
            state.score += ((state.number + 1) * 10);
            $("#score").text(state.score);
        }

        state.number++;
        player.length = Math.min(MAXSNAKELENGTH, player.length + state.number * 4);

        if(state.number >= 9)
        {
            state.level++;
            state.number = 0;
            state.state = STARTING;
            state.timer = 0;

            $("#readyMessage").show();

            player.length = 2;
            player.tail = [];
            
            constructLevel();
            $("#level").text(state.level + 1);
        }

        do
        {
            state.numberx = Math.floor(Math.random() * (WIDTH - 4) + 2);
            state.numbery = Math.floor(Math.random() * (HEIGHT - 4) + 2);

            $(numbers)
                .css("top", (state.numbery*4+20)+"px")
                .css("left", (state.numberx*5)+"px")
                .css("background-position", -(state.number*4)+"px 0px");
        } while(screen[state.numbery][state.numberx] != EMPTY || screen[state.numbery+1][state.numberx] != EMPTY);

        screen[state.numbery][state.numberx] = NUMBER;
        screen[state.numbery+1][state.numberx] = NUMBER;
    }

    function constructLevel()
    {
        for(var y=0; y<50; y++)
        {
            screen[y] = [];

            for(var x=0; x<80; x++)
            {
                screen[y].push(EMPTY);
            }
        }

        if(state.level > 8)
        {
            fillOuterWall();

            for(var i=1; i<49; i+=2)
            {
                screen[i][9] = WALL;
                screen[i+1][19] = WALL;
                screen[i][29] = WALL;
                screen[i+1][39] = WALL;
                screen[i][49] = WALL;
                screen[i+1][59] = WALL;
                screen[i][69] = WALL;
            }

            player.x = 64;
            player.y = 6;
            player.direction = DOWN;
        }
        else if(state.level == 8)
        {
            fillOuterWall();

            for(var i=3; i<47; i++)
            {
                screen[i][i] = WALL;
                screen[i][i + 27] = WALL;
            }

            player.x = 74;
            player.y = 39;
            player.direction = UP;
        }
        else if(state.level == 7)
        {
            fillOuterWall();

            for(var i=1; i<40; i++)
            {
                screen[i][9] = WALL;
                screen[50-i][19] = WALL;
                screen[i][29] = WALL;
                screen[50-i][39] = WALL;
                screen[i][49] = WALL;
                screen[50-i][59] = WALL;
                screen[i][69] = WALL;
            }

            player.x = 64;
            player.y = 6;
            player.direction = DOWN;
        }
        else if(state.level == 6)
        {
            fillOuterWall();

            for(var i=1; i<49; i+=2)
            {
                screen[i][39] = WALL;
            }

            player.x = 64;
            player.y = 6;
            player.direction = DOWN;
        }
        else if(state.level == 5)
        {
            fillOuterWall();

            for(var i=1; i<49; i++)
            {
                if(i > 29 || i < 22)
                {
                    screen[i][9] = WALL;
                    screen[i][19] = WALL;
                    screen[i][29] = WALL;
                    screen[i][39] = WALL;
                    screen[i][49] = WALL;
                    screen[i][59] = WALL;
                    screen[i][69] = WALL;
                }
            }

            player.x = 64;
            player.y = 6;
            player.direction = DOWN;
        }
        else if(state.level == 4)
        {
            fillOuterWall();

            for(var i=12; i<39; i++)
            {
                screen[i][20] = WALL;
                screen[i][58] = WALL;
            }

            for(var i=22; i<57; i++)
            {
                screen[10][i] = WALL;
                screen[40][i] = WALL;
            }

            player.x = 49;
            player.y = 24;
            player.direction = UP;
        }
        else if(state.level == 3)
        {
            fillOuterWall();

            for(var i=3; i<30; i++)
            {
                screen[i-2][19] = WALL;
                screen[52-i][59] = WALL;
            }

            for(var i=1; i<40; i++)
            {
                screen[37][i] = WALL;
                screen[14][80-i] = WALL;
            }

            player.x = 59;
            player.y = 6;
            player.direction = LEFT;
        }
        else if(state.level == 2)
        {
            fillOuterWall();

            for(var i=9; i<40; i++)
            {
                screen[i][19] = WALL;
                screen[i][59] = WALL;
            }

            player.x = 49;
            player.y = 24;
            player.direction = UP;
        }
        else if(state.level == 1)
        {
            fillOuterWall();

            for(var i=19; i<60; i++)
            {
                screen[24][i] = WALL;
            }

            player.x = 59;
            player.y = 6;
            player.direction = LEFT;
        }
        else
        {
            fillOuterWall();

            player.x = 49;
            player.y = 24;
            player.direction = UP;
        }

        drawScreen();
    }

    function loop()
    {
        if(state.state == STARTING)
        {
            if(state.timer++ > 30)
            {
                $("#readyMessage").hide();
                state.state = PLAYING;
            }

            return;
        }

        if(state.state == CRASHED)
        {
            if(state.timer++ > 20)
            {
                $("#crashMessage").hide();
                $("#readyMessage").show();

                state.number = -1;
                player.tail = [];
                player.length = 2;
                
                constructLevel();
                selectNumber();
                drawLives();
                
                state.state = STARTING;
                state.timer = 0;
            }

            return;
        }

        if(state.state == GAMEOVER) return;

        if(player.direction == LEFT) player.x = (player.x - 1);
        if(player.direction == RIGHT) player.x = (player.x + 1) % WIDTH;
        if(player.direction == UP) player.y = (player.y - 1);
        if(player.direction == DOWN) player.y = (player.y + 1) % HEIGHT;

        if(player.x < 0) player.x += WIDTH;
        if(player.y < 0) player.y += HEIGHT;

        if(screen[player.y][player.x] == NUMBER) selectNumber();
        if(screen[player.y][player.x] == WALL || screen[player.y][player.x] == SNAKE)
        {
            crash();
            return;
        }
        
        screen[player.y][player.x] = SNAKE;
        player.tail.push({x: player.x, y: player.y});
        drawCell(player.x, player.y);

        if(player.tail.length > player.length)
        {
            screen[player.tail[0].y][player.tail[0].x] = EMPTY;
            drawCell(player.tail[0].x, player.tail[0].y);
            player.tail = player.tail.slice(1, player.tail.length);
        }
    }

    function crash()
    {
        state.lives--;
        state.timer = 0;

        if(state.lives > 0)
        {
            $("#crashMessage").show();
            state.state = CRASHED;
        }
        else
        {
            $("#gameOverMessage").show();
            drawLives();
            state.state = GAMEOVER;
        }
    }

    function start()
    {
        $("#topscreen").append(numbers);
        $("#readyMessage").show();

        if(!interval)
        {
            interval = setInterval(function() {loop();}, 100);
        }

        state.state = STARTING;
        state.timer = 0;
    }

    function pause()
    {
        if(paused)
        {
            interval = setInterval(function() {loop();}, 100);
        }
        else
        {
            clearInterval(interval);
            interval = null;
        }

        paused = !paused;
    }

    return {
        init: init,
        isGameOver: function() { return (state.state == GAMEOVER); },
        isPaused: function() { return paused; },
        loop: loop,
        pause: pause,
        start: start
    };
})();

