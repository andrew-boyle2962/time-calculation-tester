class time {
    constructor(hrs, mins, secs){
        this.hrs = hrs;
        this.mins = mins;
        this.secs = secs;
    };
    getTimeSeconds(){
        return this.hrs*3600 + this.mins*60 + this.secs;
    };
    setTimeFromSeconds(seconds){
        this.hrs = Math.floor(seconds/3600);
        this.mins = Math.floor((seconds%3600)/60);
        this.secs = seconds % 60;
    };
    getString(){
        let hours = this.hrs;
        let minutes = this.mins;
        let seconds = this.secs;
        if (this.hrs<10){
            hours = `0${this.hrs}`
        }
        if (this.mins<10){
            minutes = `0${this.mins}`
        }
        if (this.secs<10){
            seconds = `0${this.secs}`
        }
        return `${hours}:${minutes}:${seconds}`
    };
};

class songTime extends time {
    constructor(){
        super(0, 0, 0);
        this.hrs = 0;
        this.mins = Math.floor(Math.random()*5) + 1;
        this.secs = Math.floor(Math.random()*60);
    };
    getString(){
        let minutes = this.mins;
        let seconds = this.secs;
        if (this.mins<10){
            minutes = `0${this.mins}`;
        };
        if (this.secs<10){
            seconds = `0${this.secs}`;
        };
        return `${minutes}:${seconds}`;
    };
}

function setTimes() {

    song_container = document.getElementById("song_container");
    song_container.innerHTML = "";
    for (let i=0; i<12; i++){
        let song = new songTime()
        songTimeList.push(song)

        const row = document.createElement("div");
        row.className = "row";
        row.dataset.songID = i;

        const p = document.createElement("p");
        p.textContent = `#${String.fromCharCode(65+i)}.... ${song.getString()}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        row.appendChild(p);
        row.appendChild(checkbox);

        song_container.appendChild(row);
    };

    let total_song_length = 0;
    songTimeList.forEach(function(item,i) {
        total_song_length += item.getTimeSeconds()
    });

    targetTime = new time(Math.floor(Math.random()*20)+4, Math.floor(Math.random()*60), Math.floor(Math.random()*60));
    let targetTimeSeconds = targetTime.getTimeSeconds();

    difference = Math.floor(Math.random()*(total_song_length - 2*60));
    seconds = targetTimeSeconds-difference;
    currTime.setTimeFromSeconds(targetTimeSeconds - difference);

    document.getElementById('current_time_display').innerText = currTime.getString();
    document.getElementById('target_time_display').innerText = targetTime.getString();
};

function minutesInputFunc(event) {
    x = document.getElementById("minutes_input");
    if (x.value.length >= 2){
        document.getElementById("seconds_input").focus();
    };
};
function ENTER_func() {
    // User input through number fields (time remaining)
    let user_mins = parseInt(Math.floor( parseFloat(document.getElementById('minutes_input').value)));
    let user_secs = parseInt(Math.floor( parseFloat(document.getElementById('seconds_input').value)));
    if(Number.isInteger(user_mins) == false){
        user_mins = 0;
    };
    if(Number.isInteger(user_secs) == false){
        user_secs = 0;
    };
    userTime.mins = user_mins;
    userTime.secs = user_secs;

    // Calculate and display error
    let error_secs = userTime.getTimeSeconds() - difference;
    let early_late = '   BANG ON';
    if (error_secs<0){
        early_late = '   EARLY';
    } else if(error_secs>0){
        early_late = '   LATE';
    };
    let abserror = Math.abs(error_secs);
    let errorTime = new time(0,0,0);
    errorTime.setTimeFromSeconds(abserror);
    let diffTime = new time(0,0,0);
    diffTime.setTimeFromSeconds(difference);
    document.getElementById('difference_time_display').innerText = diffTime.getString();
    document.getElementById('error_time_display').innerText = errorTime.getString() + early_late;

    // Get total song time from user marked checkboxes
    const rows = document.querySelectorAll(".row");
    let user_song_time_seconds = 0;
    rows.forEach((row) => {
        if (row.querySelector("input").checked){
            const songID = row.dataset.songID;
            const time = songTimeList[songID].getTimeSeconds()
            user_song_time_seconds += time
        };
    });

    // Calculate and display error based on selected songs
    error_secs = user_song_time_seconds - difference;
    early_late = '   BANG ON';
    if (error_secs<0){
        early_late = '   EARLY';
    } else if(error_secs>0){
        early_late = '   LATE';
    };
    abserror = Math.abs(error_secs);
    errorTime.setTimeFromSeconds(abserror);
    let userSongTime = new time(0,0,0);
    userSongTime.setTimeFromSeconds(user_song_time_seconds);
    document.getElementById('user_song_time_display').innerText = userSongTime.getString();
    document.getElementById('song_time_error_display').innerText = errorTime.getString() + early_late;

    document.getElementById("results_div").style.display = "block";
};

function NEW_TEST_func(){
    setTimes();
    document.getElementById('minutes_input').value="";
    document.getElementById('seconds_input').value="";
    document.getElementById("results_div").style.display = "none";
};

function main(){
    document.getElementById("minutes_input").focus();
    document.getElementById("minutes_input").addEventListener('keypress', minutesInputFunc);
    document.getElementById("ENTER").addEventListener('click', ENTER_func);
    document.getElementById("NEW_TEST").addEventListener('click', NEW_TEST_func);
    // make pressing enter also do ENTER_func
    // have a test be a series of ten Qs and show total difference / avg difference
    // show time taken for 10 Qs / per Answer
    // error + time taken as competency metric??
    setTimes();
};

let difference;
let userTime = new time(0, 0 , 0);
let targetTime = new time(0, 0 , 0);
let currTime = new time(0, 0 , 0);
let songTimeList = [];

main();