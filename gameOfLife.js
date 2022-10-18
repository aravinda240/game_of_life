var gameOfLife = {
    rows: 50,
    cols: 100,
    playing: false,
    grid: new Array(this.rows),
    nextGrid: new Array(this.rows),
    timer:'',

    init: function() {
        this.drawGrid();
        this.setGridArray();
        this.resetGridArray();
        this.actions();
    },

    setGridArray: function () {
        for (var i = 0; i < this.rows; i++) {
            this.grid[i] = new Array(this.cols);
            this.nextGrid[i] = new Array(this.cols);
        }
    },

    drawGrid: function() {
        var gridContainer = $('#gridContainer');
        var table = $("<table>");

        for (var i = 0; i < this.rows; i++) {
            var tr = $("<tr>");
            for (var j = 0; j < this.cols; j++) {
                var cellId = i + "_" + j;
                var cell = $("<td id='"+cellId+"' class='dead cell' >");
                tr.append(cell);
            }
            table.append(tr);
        }
        gridContainer.append(table);
        this.cellClickHandler();
    },

    cellClickHandler: function() {
        $(".cell").click(function(){
            var rowcol = $(this).attr('id').toString().split("_");
            var row = rowcol[0];
            var col = rowcol[1];
            var obj = $(this);
            if(obj.hasClass("live")) {
                obj.removeClass("live");
                obj.addClass("dead");
                gameOfLife.grid[row][col] = 0;
            } else {
                obj.removeClass("dead");
                obj.addClass("live");
                gameOfLife.grid[row][col] = 1;
            }
        });
    },

    resetGridArray: function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.grid[i][j] = 0;
                this.nextGrid[i][j] = 0;
            }
        }
    },

    actions: function() {
        $('#start').click(function(){
            if (gameOfLife.playing) {
                gameOfLife.playing = false;
                clearTimeout(gameOfLife.timer);
            } else {
                gameOfLife.playing = true;
                gameOfLife.play();
            }
        })
        $('#stop').click(function(){
            gameOfLife.playing = false;
            clearTimeout(this.timer);
            $('.live').each(function(){
                $(this).removeClass('live');
                $(this).addClass('dead');
            })
            gameOfLife.resetGridArray();
        })
    },

    play: function () {
        gameOfLife.computeNextGen();
        if (gameOfLife.playing) {
            gameOfLife.timer = setTimeout(gameOfLife.play, 100);
        }
    },

    computeNextGen: function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.applyRules(i, j);
            }
        }
        this.copyAndResetGrid();
        this.updateView();
    },

    updateView: function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var cell = $("#"+i + "_" + j);
                if (this.grid[i][j] == 0) {
                    cell.addClass('dead');
                    cell.removeClass('live');
                } else {
                    cell.addClass('live');
                    cell.removeClass('dead');
                }
            }
        }
    },

    applyRules: function(row, col) {
        var numNeighbors = this.countNeighbors(row, col);
        if (this.grid[row][col] == 1) {
            if (numNeighbors < 2) {
                this.nextGrid[row][col] = 0;
            } else if (numNeighbors == 2 || numNeighbors == 3) {
                this.nextGrid[row][col] = 1;
            } else if (numNeighbors > 3) {
                this.nextGrid[row][col] = 0;
            }
        } else if (this.grid[row][col] == 0) {
            if (numNeighbors == 3) {
                this.nextGrid[row][col] = 1;
            }
        }
    },

    copyAndResetGrid: function() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.grid[i][j] = this.nextGrid[i][j];
                this.nextGrid[i][j] = 0;
            }
        }
    },

    countNeighbors(row, col) {
        var count = 0;
        if (row-1 >= 0) {
            if (this.grid[row-1][col] == 1) count++;
        }
        if (row-1 >= 0 && col-1 >= 0) {
            if (this.grid[row-1][col-1] == 1) count++;
        }
        if (row-1 >= 0 && col+1 < this.cols) {
            if (this.grid[row-1][col+1] == 1) count++;
        }
        if (col-1 >= 0) {
            if (this.grid[row][col-1] == 1) count++;
        }
        if (col+1 < this.cols) {
            if (this.grid[row][col+1] == 1) count++;
        }
        if (row+1 < this.rows) {
            if (this.grid[row+1][col] == 1) count++;
        }
        if (row+1 < this.rows && col-1 >= 0) {
            if (this.grid[row+1][col-1] == 1) count++;
        }
        if (row+1 < this.rows && col+1 < this.cols) {
            if (this.grid[row+1][col+1] == 1) count++;
        }
        return count;
    }
}

$(document).ready(function () {
    gameOfLife.init();
});
