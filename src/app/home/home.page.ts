import { Component } from '@angular/core';
import { of } from 'rxjs';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  
  percent:number=0;
  radius:number=100;
  fullTime:any='00:01:30';
  timer:any=false;
  minutes:number=0;
  seconds:any=0;
  progress:any=0;
  
  elapsed:any={
    h:'00',
    m:'00',
    s:'00'

  }

  overallTimer:any=false;
  countDownTimer: any = false;
  timeLeft: any = {
    m: '00',
    s: '00'
  };
  remainingTime = `${this.timeLeft.m}:${this.timeLeft.s}`;
  constructor(private insomnia:Insomnia, ){
    let autoHide: boolean = true;
   // this.navigationBar.setUp(autoHide);

  }
  
  startTimer(){
    if(this.timer){
      clearInterval(this.timer); 
    }

    
      this.progress=0;
       this.percent=0;
      this.timer=false;

      let timeSplit=this.fullTime.split(":");
      this.minutes=timeSplit[1];
      this.seconds=timeSplit[2];

      let totalseconds=Math.floor(this.minutes*60)+parseInt((this.seconds));
      let secondsLeft = totalseconds;

      let forwardsTimer = () => {
        if (this.percent == this.radius) clearInterval(this.timer)
        this.percent = Math.floor((this.progress / totalseconds) * 100)
        ++this.progress
      }

      let backwardsTimer = () => {
        if (secondsLeft >= 0) {
          this.timeLeft.m = Math.floor(secondsLeft / 60)
          this.timeLeft.s = secondsLeft - (60 * this.timeLeft.m)
          this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(this.timeLeft.s, 2)}`
          secondsLeft--;
        }
      }

      // run once when clicked
      forwardsTimer()
      backwardsTimer()

      // timers start 1 second later
      this.countDownTimer = setInterval(backwardsTimer, 1000)
      this.timer = setInterval(forwardsTimer, 1000)
      if(!this.overallTimer){
        this.progressTimer();
        this.insomnia.keepAwake();  
      }
      // this.timer=setInterval(()=>{

      //    if(this.percent==this.radius)
      //        clearInterval(this.timer);
        
      //   this.percent=Math.floor((this.progress/totalseconds)*100)
      //   ++this.progress
      // },1000)
  }
  progressTimer(){
    let countdownDate=new Date();
    this.overallTimer=setInterval(()=>{
      if(this.percent==this.radius)
         clearInterval(this.overallTimer);
      let now=new Date().getTime();
      let distance =now -countdownDate.getTime();
      this.elapsed.h=Math.floor(( distance%(1000*60*60*24))/(1000*60*60));
      this.elapsed.m=Math.floor(( distance%(1000*60*60))/(1000*60));
      this.elapsed.s=Math.floor(( distance%(1000*60))/(1000));
      this.elapsed.h=this.pad(this.elapsed.h,2);
      this.elapsed.m=this.pad(this.elapsed.m,2);
      this.elapsed.s=this.pad(this.elapsed.s,2);
      
    },1000)
  }
  stopTimer() {
    clearInterval(this.countDownTimer);
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.countDownTimer = false;
    this.overallTimer = false;
    this.timer = false;    
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: '00',
      m: '00',
      s: '00'
    }
    this.timeLeft = {
      m: '00',
      s: '00'
    }
    this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(this.timeLeft.s, 2)}`;
    this.insomnia.allowSleepAgain()
  }
  pad(num,size){
    let s=num+"";
    while(s.length<size) s="0"+s;
    return s;
  }
}
