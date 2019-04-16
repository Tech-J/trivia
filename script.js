var quizObj={
    score:0,
    gameStart:true,
    name: "",
    questionNo: 10,
    difficulty: "",
    category: ""
}

function elementSelector(selector){
    return document.querySelectorAll(selector);
}

function fieldInput(selector,displayEl,eventType){
    var elements = elementSelector(selector)  
    elements.forEach((el)=>{
        fieldInputEvents(el,displayEl,eventType)
    })
}
function fieldInputEvents(element, selector,eventType){
    element.addEventListener(eventType,function(event){
        fieldInputUpdate(event, selector)
    })
}

function fieldInputUpdate(event, select){
    var nameEl = document.querySelector(select)
    nameEl.innerHTML=event.target.value;
    quizObj[`${nameEl.className}`]=event.target.value;
}

function populateQuestions(){
    var questionEl=elementSelector('.question')[0]
    quizObj.questions[0].incorrect_answers.splice(Math.floor(Math.random()*quizObj.questions[0].incorrect_answers.length),0,quizObj.questions[0].correct_answer);
    questionEl.innerHTML=quizObj.questions[0].question;
    populateAnswers()
}

function populateAnswers(){
    var answersEl=elementSelector('.answers')
    quizObj.questions[0].incorrect_answers
    answersEl.forEach((el,index)=>{
        el.innerHTML= quizObj.questions[0].incorrect_answers[index];
        el.addEventListener('click',checkAnswer)
    })
}

function checkAnswer(events){
    console.log(events)
    events.target.removeEventListener('click', checkAnswer)
    events.target.innerHTML == quizObj.questions[0].correct_answer ? scoreUpdate() :nextQuestion();
}

function scoreUpdate(score){
    quizObj['score']++
    var score = elementSelector('.score')
    score[0].textContent=quizObj['score']
    nextQuestion() 
}

function nextQuestion() {
    quizObj.questions.splice(0,1)
    if (quizObj.questions.length!==0){
        populateQuestions()
    }
    else{
        return elementSelector('.answers').forEach((el)=>{
        el.removeEventListener('click', checkAnswer)
        })   
    }
}

function animationAddClass(){
    var quizContainer = elementSelector('.quizformContainer')[0]
    var playerContainer = elementSelector('.playerInfoContainer')[0]
    var triviaGame = elementSelector('.triviaGame')[0]
    quizContainer.classList.add('zip')
    playerContainer.classList.add('slideDown')
    triviaGame.classList.add('fadeIn')
}

function gameStart(){
    var el = elementSelector('.triviaStartGame-btn')
    el[0].addEventListener('click',(event)=>{
        getGame(quizObj)
        animationAddClass()
    })
}

function triviaCategories(categories){
    var categoryContainer = elementSelector('.triviaCategory>select')[0]
    categories.forEach((categoryObj)=>{
        var newCategoryEl= document.createElement('option')
        newCategoryEl.textContent=categoryObj.name
        newCategoryEl.value=categoryObj.id
        categoryContainer.appendChild(newCategoryEl)
    })
}

function getGame(gameObj){
    axios.get(`https://opentdb.com/api.php?amount=${gameObj.questionNo}&category=${gameObj.category}&difficulty=${gameObj.difficulty}&type=multiple`)
    .then((data)=>{
        quizObj['questions']=data.data.results
        populateQuestions()
    })
    .catch((err)=>{
        console.log(err)
    })
}

function getTriviaCategories(){
    axios.get('https://opentdb.com/api_category.php')
    .then((data)=>{
        triviaCategories(data.data.trivia_categories)
    })
    .catch((err)=>{
        console.log(err)
    }) 
}

fieldInput('.nameInputField','.name','input')
fieldInput('.triviaQuestionAmt-btn','.questionNo','click')
fieldInput('.triviaDifficulty-btn','.difficulty','click')
fieldInput('#triviaCatSelection','.category','change')
getTriviaCategories()
gameStart()