


function c(){
    return new Promise((a,b)=>{
        setTimeout(()=>{
            a({name:123});
        },1000);
    })
}

async function abc(){


   let name = await c();

   console.log(name);
   
}

abc();


async function abc1(){


    let name = await c();
 
    console.log(name);
    
 }


 async function abc3(){


    let name = await c();
 
    console.log(name);
    
 }