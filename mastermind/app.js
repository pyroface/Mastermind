$(document).ready(function() {
  
  let guess = 0;
  let selectedColor = '';
  let bGround = 'rgba(0, 0, 0, 0) linear-gradient(rgb(0, 0, 102), blue) repeat scroll 0% 0% / auto padding-box border-box';
  $('.submit-btn').hide();
  let clickCount = 0;
  let isSelected = false;
  let answerRay = makeAnswer();
  let tempRay = $('.guess-pegs');
  let guessBoxArray = [];
  let nextGrade = $($('.first-grade')[0]).parent()[0];
  for(let i = 9; i >= 0; i-- ) {
    guessBoxArray.push(tempRay[i]);
  }

  for(let i = 0; i < 10; i++) {
    let guessArray = guessBoxArray[i].getElementsByClassName("guess-peg");
    for(let j = 0; j < 4; j++) {
      $(guessArray[j]).attr('id',`g-${i}-${j}`);
    }
  }

  let masterGuessArray = [[-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1],
                          [-1, -1, -1, -1]];

  $('.submit-btn').click(function() {
    $('.active').removeClass('active');
    let gradeRay = getGrade();
    checkWin(gradeRay);
    let gradeBox = getGradeBox();
    placePegs(gradeRay, gradeBox);
    guess++;
    for(let i = 0; i < 4; i++) {
      $(`#g-${guess}-${i}`).addClass('active');
    }
    $('.submit-btn').hide();
  });

  $('.selector-inner').click(function () {
    $( "selection-container" ).each(function( i ) {
    if ( this.style.color !== "blue" ) {
      this.style.color = "blue";
    } else {
      this.style.color = "";
    }
  });
    isSelected = true;
    /*$('.selector-outer').css('background-color', 'blue');*/
    $('.selector-outer').css('-webkit-box-shadow', 'inset 0px 0px 0px blue');
    $('.selector-outer').css('-moz-box-shadow', 'inset 0px 0px 0px blue');
    $('.selector-outer').css('box-shadow', 'inset 0px 0px 0px blue');
    let peg = ($(this).parent())[0];
    selectedColor = $(this).css('background-color');
    $(peg).css('background-color', selectedColor);
    $(peg).css('-webkit-box-shadow', 'inset 10px 10px 5px #888');
    $(peg).css('-moz-box-shadow', 'inset 10px 10px 5px #888');
    $(peg).css('box-shadow', 'inset 10px 10px 5px #888');
  });

  $('.guess-peg').click(function() {
    if(isSelected) {
      if ($(this).hasClass('active')) {
        let number = parseInt($(this).css('border'));
        if(number === 1) { //insert peg
        $(this).css('background', 'none');
        $(this).css('background-color', selectedColor);
        $(this).css('border', '2px solid white');
        let coord = $(this).attr('id');
        updateMasterArray(selectedColor, coord);
        clickCount++;
        if(clickCount === 4) {
            $('.submit-btn').show();
            clickCount = 0;
        }
      } else { //peg removed
          $(this).css('background', bGround);
          $(this).css('border', '1px solid white');
          // updateMasterArray(selectedColor, coord);
          clickCount--;
        }
      }
    }
  });

  function makeAnswer() {
    let ray = [];
    for(let i = 0; i < 4; i++) {
      ray.push(Math.floor(Math.random() * 6));
    }
    return ray;
  }
  console.log(answerRay)

  function updateMasterArray(col, xy) {
    let ray = xy.split('-');
    let x = ray[1];
    let y = ray[2];
    masterGuessArray[x][y] = makeColorANumber(col);
  }

  console.log("  red = 0 \n  green = 1 \n " + 
              " yellow = 2 \n  black = 3 \n " +
              " white = 4 \n  brown = 5");
  function makeColorANumber(col) {
    if(col === 'rgb(255, 0, 0)') return 0; //red
    if(col === 'rgb(0, 128, 0)') return 1; //green
    if(col === 'rgb(255, 255, 0)') return 2; //yellow
    if(col === 'rgb(0, 0, 0)') return 3; //black
    if(col === 'rgb(255, 255, 255)') return 4; //white
    if(col === 'rgb(115, 60, 15)') return 5; //brown
    /*if(col === 'rgb(44, 140, 220)') return 5;*/ //blue
  }

  function getGrade() {
    let gradRay = [];
    let aRay = [];
    for(let i = 0; i < 4; i++) {
      aRay.push(answerRay[i]);
    }
    // Black Peg Check
    for(let i = 0; i < 4; i++) {
      if(masterGuessArray[guess][i] === aRay[i]) {
        gradRay.push('black-peg');
        aRay[i] = -1;
        masterGuessArray[guess][i] = -2;
      }
    }
    // White Peg Check
    for(let i = 0; i < 4; i++) {
      for(let j = 0; j < 4; j++) {
        if(masterGuessArray[guess][i] === aRay[j]) {
          gradRay.push('white-peg');
          aRay[j] = -1;
          masterGuessArray[guess][i] = -2;
        }
      }
    }
    return gradRay;
  }

  function getGradeBox() {
    let activeGrade =  nextGrade.getElementsByClassName("grade-pegs")[0];
    nextGrade = $(nextGrade).prev()[0];
    return activeGrade;
  }

  function placePegs(ray, box) {
    let pegRay = box.getElementsByClassName("grade-peg");
    for(let i = 0; i < ray.length; i++) {
      $(pegRay[i]).addClass(`${ray[i]}`);
    }
    $('.white-peg').css('background', 'none').css('background-color', 'white');
    $('.black-peg').css('background', 'none').css('background-color', 'black');
  }

  function checkWin(ray) {
    let rayStr = ray.join();
    if(rayStr === "black-peg,black-peg,black-peg,black-peg") {
      $('.modal').fadeIn(200);
    }
  }
  
  $( "#x" ).click(function() {
    $( ".modal" ).hide();
  });

});