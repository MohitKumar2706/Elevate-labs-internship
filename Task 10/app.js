let input=document.querySelector("#input");
let button=document.querySelector(".btn");

let defi=document.querySelector(".Definations");
let partof=document.querySelector(".partofspeech")
let so=document.querySelector(".sound");


function emptyEveryThing(){
    defi.innerText="";
    partof.innerText="";
    so.innerText="";
    count=0;
}

function definationsAndExamples(entry0){
    
    let definations=entry0.meanings[0].definitions;
    let count=1;
    for (let i of definations)
    {
        let para=document.createElement("P")
        para.innerHTML=`<b>Defination ${count}= </b> ${i.definition} `
        defi.appendChild(para);
        count ++;

        if(i.example){
        let expara=document.createElement("p");
        expara.innerHTML=(`<b> Example is =</b> ${i.example}`)
        expara.classList.add("exam");
        defi.appendChild(expara); 
        }

    }
}

function partofspeech(entry0){
    let partSpeech=entry0.meanings[0].partOfSpeech;
     if(partSpeech){
        let partpara=document.createElement("p");
        partpara.innerHTML=(`<b> Part Of Speech is =</b> ${partSpeech}`)
        partpara.classList.add("part");
        partof.appendChild(partpara); 
        }
}


function soundofword(entry0){
    let sound=entry0.phonetics[0].audio;
    if(sound){
   let audio=document.createElement("audio")
   audio.controls=true;
   audio.src=sound;
    so.appendChild(audio);
    }

}

button.addEventListener("click", async (e)=>{
    e.preventDefault();
    emptyEveryThing()
    let val=input.value;
    let url=`https://api.dictionaryapi.dev/api/v2/entries/en/${val}`
try{
    let res=await fetch(url);
    let ans=await res.json()
    let entry0=ans[0];

    definationsAndExamples(entry0);

    partofspeech(entry0);

    soundofword(entry0);

}catch(err){
    console.log(err)
    alert("Error!")
}

    
})