async function inicio(){
    const contenedor= document.getElementById("contenedor");
    const carrito=document.getElementById("carrito");
    carrito.style.display="none";
    try {
        let divCol1=document.createElement("div");
        divCol1.className="col";

        let divCard1=document.createElement("div");
        divCard1.className="card h-100";


        let response1= await fetch('https://www.googleapis.com/books/v1/volumes?q=don%20quijote');
        let data1= await response1.json();

        let imagen1= document.createElement("img");
        imagen1.className="card-img-top";
        if(data1.items[0].volumeInfo.imageLinks.thumbnail!=undefined){
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
          myHeaders.append("Content-Type", "application/json");
                    
          const resposes= await fetch("https://google.serper.dev/images", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `don quijote libro`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          let src1= datar.images[0].imageUrl;
          imagen1.src=src1;
          divCard1.append(imagen1);
        }

        
        let divCardB1=document.createElement("div");
        divCardB1.className="card-body";

        let h51= document.createElement("h5");
        h51.className="card-title";
        let titulo1= data1.items[1].volumeInfo.title;
        h51.textContent=titulo1;
        divCardB1.append(h51);

        let p1= document.createElement("p");
        p1.className="card-text";
        let autor1= data1.items[1].volumeInfo.authors[0];
        let fecha1= data1.items[1].volumeInfo.publishedDate;

       
            try {
                const libro= "don quijote";
        
                var myHeaders = new Headers();
                myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
                myHeaders.append("Content-Type", "application/json");
                
                const resposes= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro descripcion`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar= await resposes.json();
                const resposes1= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro precio`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar1= await resposes1.json();
                let afuera=[];
                for(let x=0; datar1.organic.length>x ; x++){
                  let precio= datar1.organic[x].snippet;
                  let separado= precio.split(". ");
                  for(let y=0; separado.length>y ; y++){
                    let precioFinal= parseInt(separado[y]);
                    if(precioFinal>5000 & precioFinal<100000){
                      afuera.push(precioFinal);
                    } 
                  }
                }
                let saber=0;
                let dato= datar.answerBox.snippet;
                p1.innerHTML=`<strong>Autor:</strong> ${autor1}<br><strong>Fecha de publicación:</strong> ${fecha1}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                if(afuera[0]==undefined){
                  let segunda= datar1.organic[0].ratingCount *1000;
                  saber+=segunda
                  st.innerText=`$${segunda}`;
                  p1.append(st);
                  divCardB1.append(p1);
                } else{
                  saber+=afuera[0]
                  st.innerText=`$${afuera[0]}`;
                  p1.append(st);
                  divCardB1.append(p1);
                }

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){
                  if(document.getElementById(`${titulo1}`)!=null){
                    let todoTr= document.getElementById(`${titulo1}`);
                    todoTr.querySelector('input').value++;
                    let precio= parseInt(todoTr.querySelector('input').value) * saber;
                    todoTr.querySelector(".precio").textContent=`$${precio}`;
                    let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                  } else{
                    const paraComprar=document.getElementById("paraComprar");

                    const tr1= document.createElement("tr");
                    tr1.id=`${titulo1}`;

                    const td1=document.createElement("td");
                    td1.textContent=`${titulo1}`;
                    tr1.append(td1);

                    const td3=document.createElement("td");
                    td3.className="precio";
                    td3.id=`${contador}`;
                    contador+=1;
                    td3.textContent=`$${saber}`;

                    const td2=document.createElement("td");
                    const inpu=document.createElement("input");
                    inpu.style.width="50px";
                    inpu.type="number";
                    inpu.value=1;
                    inpu.min=1;

                    function actualizarTotal() {
                      let precio = inpu.value * saber;
                      td3.textContent = `$${precio}`;
                      let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                    }

                    inpu.addEventListener('input', function(){
                      if (inpu.value < 0) {
                        inpu.value = "1";
                      }
                      actualizarTotal();
                    });
                    
                    inpu.addEventListener('change', function(){
                      actualizarTotal();
                    });
                    
                    td2.append(inpu);
                    tr1.append(td2);
                    
                    tr1.append(td3);

                    let td4=document.createElement("td");
                    let boton2= document.createElement("button");
                    boton2.textContent="🗑️";
                    boton2.addEventListener('click',function(){
                      tr1.remove();
                      let valor1=td3.textContent.split("$");
                      let valorR= parseInt(valor1[1]);
                      let valor2= document.getElementById("aPagar").textContent.split("$");
                      let valorF= parseInt(valor2[1]);
                      let calculo= valorF-valorR;
                      document.getElementById("aPagar").textContent=`$${calculo}`;
                    })
                    td4.append(boton2);
                    tr1.append(td4);

                    paraComprar.append(tr1);
                    let todos = document.querySelectorAll(".precio");
                    
                    let guardar=0

                    todos.forEach(element => {
                      let numero=element.textContent.split("$");
                      guardar+=parseInt(numero[1]);
                    });
                    
                    document.getElementById("aPagar").textContent=`$${guardar}`;
                  }

                });
                boton1.textContent="Añadir 🛒";
                divCardB1.append(boton1);

            } catch (error) {
                console.log(error);
            }
        
        divCard1.append(divCardB1);
        divCol1.append(divCard1);
        contenedor.append(divCol1);
        
        ////

        let divCol2=document.createElement("div");
        divCol2.className="col";

        let divCard2=document.createElement("div");
        divCard2.className="card h-100";


        let response2= await fetch('https://www.googleapis.com/books/v1/volumes?q=el%20principito');
        let data2= await response2.json();

        let imagen2= document.createElement("img");
        imagen2.className="card-img-top";
        if(data2.items[1].volumeInfo.imageLinks.smallThumbnail!=undefined){
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
          myHeaders.append("Content-Type", "application/json");
                    
          const resposes= await fetch("https://google.serper.dev/images", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `el principito libro`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          let src1= datar.images[0].imageUrl;
          imagen2.src=src1;
          divCard2.append(imagen2);
        } 
        
        let divCardB2=document.createElement("div");
        divCardB2.className="card-body";

        let h52= document.createElement("h5");
        h52.className="card-title";
        let titulo2= data2.items[0].volumeInfo.title;
        h52.textContent=titulo2;
        divCardB2.append(h52);

        let p2= document.createElement("p");
        p2.className="card-text";
        let autor2= data2.items[0].volumeInfo.authors[0];
        let fecha2= data2.items[0].volumeInfo.publishedDate;

        
            try {
                const libro= "el principito";
        
                var myHeaders = new Headers();
                myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
                myHeaders.append("Content-Type", "application/json");
                
                const resposes= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro descripcion`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar= await resposes.json();
                const resposes1= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `el principito libro precio`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar1= await resposes1.json();

                let afuera2=[];
                for(let x=0; datar1.organic.length>x ; x++){
                  let precio= datar1.organic[x].snippet;
                  let separado= precio.split(". ");
                  for(let y=0; separado.length>y ; y++){
                    let precioFinal= parseInt(separado[y]);
                    if(precioFinal>5000 & precioFinal<100000){
                      afuera2.push(precioFinal);
                    }
                  }
                }

                let saber2=0;
                let dato= datar.answerBox.snippet;
                p2.innerHTML=`<strong>Autor:</strong> ${autor2}<br><strong>Fecha de publicación:</strong> ${fecha2}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                if(afuera2[0]==undefined){
                  let segunda= datar1.organic[0].ratingCount *1000;
                  saber2+=segunda
                  st.innerText=`$${segunda}`;
                  p2.append(st);
                  divCardB2.append(p2);
                } else{
                  saber2+=afuera2[0]
                  st.innerText=`$${afuera2[0]}`;
                  p2.append(st);
                  divCardB2.append(p2);
                }

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){
                  if(document.getElementById(`${titulo2}`)!=null){
                    let todoTr= document.getElementById(`${titulo2}`);
                    todoTr.querySelector('input').value++;
                    let precio= parseInt(todoTr.querySelector('input').value) * saber2;
                    todoTr.querySelector(".precio").textContent=`$${precio}`;
                    let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                  } else{
                    const paraComprar=document.getElementById("paraComprar");

                    const tr1= document.createElement("tr");
                    tr1.id=`${titulo2}`;

                    const td1=document.createElement("td");
                    td1.textContent=`${titulo2}`;
                    tr1.append(td1);

                    const td3=document.createElement("td");
                    td3.className="precio";
                    td3.id=`${contador}`;
                    contador+=1;
                    td3.textContent=`$${saber2}`;

                    const td2=document.createElement("td");
                    const inpu=document.createElement("input");
                    inpu.style.width="50px";
                    inpu.type="number";
                    inpu.value=1;
                    inpu.min=1;

                    function actualizarTotal() {
                      let precio = inpu.value * saber2;
                      td3.textContent = `$${precio}`;
                      let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                    }

                    inpu.addEventListener('input', function(){
                      if (inpu.value < 0) {
                        inpu.value = "1";
                      }
                      actualizarTotal();
                    });
                    
                    inpu.addEventListener('change', function(){
                      actualizarTotal();
                    });
                    
                    td2.append(inpu);
                    tr1.append(td2);
                    
                    tr1.append(td3);

                    let td4=document.createElement("td");
                    let boton2= document.createElement("button");
                    boton2.textContent="🗑️";
                    boton2.addEventListener('click',function(){
                      tr1.remove();
                      let valor1=td3.textContent.split("$");
                      let valorR= parseInt(valor1[1]);
                      let valor2= document.getElementById("aPagar").textContent.split("$");
                      let valorF= parseInt(valor2[1]);
                      let calculo= valorF-valorR;
                      document.getElementById("aPagar").textContent=`$${calculo}`;
                    })
                    td4.append(boton2);
                    tr1.append(td4);

                    paraComprar.append(tr1);
                    let todos = document.querySelectorAll(".precio");
                    
                    let guardar=0

                    todos.forEach(element => {
                      let numero=element.textContent.split("$");
                      guardar+=parseInt(numero[1]);
                    });
                    
                    document.getElementById("aPagar").textContent=`$${guardar}`;
                  }

                });
                boton1.textContent="Añadir 🛒";
                divCardB2.append(boton1);


            } catch (error) {
                console.log(error);
            }
        
        divCard2.append(divCardB2);
        divCol2.append(divCard2);
        contenedor.append(divCol2);

        ////

        let divCol3=document.createElement("div");
        divCol3.className="col";

        let divCard3=document.createElement("div");
        divCard3.className="card h-100";


        let response3= await fetch('https://www.googleapis.com/books/v1/volumes?q=Las%20aventuras%20de%20Alicia%20en%20el%20país%20de%20las%20maravillas');
        let data3= await response3.json();

        let imagen3= document.createElement("img");
        imagen3.className="card-img-top";
        if(data3.items[1].volumeInfo.imageLinks.smallThumbnail!=undefined){
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
          myHeaders.append("Content-Type", "application/json");
                    
          const resposes= await fetch("https://google.serper.dev/images", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `Las aventuras de Alicia en el país de las maravillas libro`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          let src1= datar.images[0].imageUrl;
          imagen3.src=src1;
          divCard3.append(imagen3);
        } 

        
        let divCardB3=document.createElement("div");
        divCardB3.className="card-body";

        let h53= document.createElement("h5");
        h53.className="card-title";
        let titulo3= data3.items[1].volumeInfo.title;
        h53.textContent=titulo3;
        divCardB3.append(h53);

        let p3= document.createElement("p");
        p3.className="card-text";
        let autor3= data3.items[1].volumeInfo.authors[0];
        let fecha3= data3.items[1].volumeInfo.publishedDate;

        if(data1.items[0].volumeInfo.description==null){
            try {
                const libro= "Las aventuras de Alicia en el país de las maravillas";
        
                var myHeaders = new Headers();
                myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
                myHeaders.append("Content-Type", "application/json");
                
                const resposes= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro descripcion`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar= await resposes.json();
                const resposes1= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro precio`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar1= await resposes1.json();
                let afuera3=[];
                for(let x=0; datar1.organic.length>x ; x++){
                  let precio= datar1.organic[x].snippet;
                  let separado= precio.split(". ");
                  for(let y=0; separado.length>y ; y++){
                    let precioFinal= parseInt(separado[y]);
                    if(precioFinal>5000 & precioFinal<100000){
                      if(precioFinal!=undefined){
                        afuera3.push(precioFinal);
                        console.log(precioFinal);
                      }
                    }
                  }
                }
                let saber3=0;
                let dato= datar.answerBox.snippet;
                p3.innerHTML=`<strong>Autor:</strong> ${autor3}<br><strong>Fecha de publicación:</strong> ${fecha3}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                if(afuera3[0]==undefined){
                  let segunda= datar1.organic[0].ratingCount *1000;
                  saber3+=segunda
                  st.innerText=`$${segunda}`;
                  p3.append(st);
                  divCardB3.append(p3);
                } else{
                  saber3+=afuera3[0]
                  st.innerText=`$${afuera3[0]}`;
                  p3.append(st);
                  divCardB3.append(p3);
                }

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){
                  if(document.getElementById(`${titulo3}`)!=null){
                    let todoTr= document.getElementById(`${titulo3}`);
                    todoTr.querySelector('input').value++;
                    let precio= parseInt(todoTr.querySelector('input').value) * saber3;
                    todoTr.querySelector(".precio").textContent=`$${precio}`;
                    let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                  } else{
                    const paraComprar=document.getElementById("paraComprar");

                    const tr1= document.createElement("tr");
                    tr1.id=`${titulo3}`;

                    const td1=document.createElement("td");
                    td1.textContent=`${titulo3}`;
                    tr1.append(td1);

                    const td3=document.createElement("td");
                    td3.className="precio";
                    td3.id=`${contador}`;
                    contador+=1;
                    td3.textContent=`$${saber3}`;

                    const td2=document.createElement("td");
                    const inpu=document.createElement("input");
                    inpu.style.width="50px";
                    inpu.type="number";
                    inpu.value=1;
                    inpu.min=1;

                    function actualizarTotal() {
                      let precio = inpu.value * saber3;
                      td3.textContent = `$${precio}`;
                      let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                    }

                    inpu.addEventListener('input', function(){
                      if (inpu.value < 0) {
                        inpu.value = "1";
                      }
                      actualizarTotal();
                    });
                    
                    inpu.addEventListener('change', function(){
                      actualizarTotal();
                    });
                    
                    td2.append(inpu);
                    tr1.append(td2);
                    
                    tr1.append(td3);

                    let td4=document.createElement("td");
                    let boton2= document.createElement("button");
                    boton2.textContent="🗑️";
                    boton2.addEventListener('click',function(){
                      tr1.remove();
                      let valor1=td3.textContent.split("$");
                      let valorR= parseInt(valor1[1]);
                      let valor2= document.getElementById("aPagar").textContent.split("$");
                      let valorF= parseInt(valor2[1]);
                      let calculo= valorF-valorR;
                      document.getElementById("aPagar").textContent=`$${calculo}`;
                    })
                    td4.append(boton2);
                    tr1.append(td4);

                    paraComprar.append(tr1);
                    let todos = document.querySelectorAll(".precio");
                    
                    let guardar=0

                    todos.forEach(element => {
                      let numero=element.textContent.split("$");
                      guardar+=parseInt(numero[1]);
                    });
                    
                    document.getElementById("aPagar").textContent=`$${guardar}`;
                  }

                });
                boton1.textContent="Añadir 🛒";
                divCardB3.append(boton1);


            } catch (error) {
                console.log(error);
            }
        }
        divCard3.append(divCardB3);
        divCol3.append(divCard3);
        contenedor.append(divCol3);

        ////
        /*
        let divCol4=document.createElement("div");
        divCol4.className="col";

        let divCard4=document.createElement("div");
        divCard4.className="card h-100";


        let response4= await fetch('https://www.googleapis.com/books/v1/volumes?q=El%20código%20Da%20Vinci');
        let data4= await response4.json();

        let imagen4= document.createElement("img");
        imagen4.className="card-img-top";
        if(data4.items[1].volumeInfo.imageLinks.smallThumbnail!=undefined){
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "46005d8c664792c6a59c46ceba5a6cab8fb71f0c");
          myHeaders.append("Content-Type", "application/json");
                    
          const resposes= await fetch("https://google.serper.dev/images", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `El código Da Vinci libro`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          let src1= datar.images[0].imageUrl;
          imagen4.src=src1;
          divCard4.append(imagen4);
        } 

        
        let divCardB4=document.createElement("div");
        divCardB4.className="card-body";

        let h54= document.createElement("h5");
        h54.className="card-title";
        let titulo4= data4.items[1].volumeInfo.title;
        h54.textContent=titulo4;
        divCardB4.append(h54);

        let p4= document.createElement("p");
        p4.className="card-text";
        let autor4= data4.items[1].volumeInfo.authors[0];
        let fecha4= data4.items[1].volumeInfo.publishedDate;

            try {
                const libro= "El código Da Vinci";
        
                var myHeaders = new Headers();
                myHeaders.append("X-API-KEY", "46005d8c664792c6a59c46ceba5a6cab8fb71f0c");
                myHeaders.append("Content-Type", "application/json");
                
                const resposes= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro descripcion`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar= await resposes.json();
                const resposes1= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro precio`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar1= await resposes1.json();
                let afuera=[];
                for(let x=0; datar1.organic.length>x ; x++){
                  let precio= datar1.organic[x].snippet;
                  let separado= precio.split(". ");
                  for(let y=0; separado.length>y ; y++){
                    let precioFinal= parseInt(separado[y]);
                    if(precioFinal>5000 & precioFinal<100000){
                      afuera.push(precioFinal);
                    }
                  }
                }
                let dato= datar.answerBox.snippet;
                p4.innerHTML=`<strong>Autor:</strong> ${autor4}<br><strong>Fecha de publicación:</strong> ${fecha4}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                st.innerText=`$${afuera[0]}`;
                p4.append(st);
                divCardB4.append(p4);

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){});
                boton1.textContent="Añadir 🛒";
                divCardB4.append(boton1);

            } catch (error) {
                console.log(error);
            }
        divCard4.append(divCardB4);
        divCol4.append(divCard4);
        contenedor.append(divCol4);

        ////

        let divCol5=document.createElement("div");
        divCol5.className="col";

        let divCard5=document.createElement("div");
        divCard5.className="card h-100";


        let response5= await fetch('https://www.googleapis.com/books/v1/volumes?q=El%20alquimista');
        let data5= await response5.json();

        let imagen5= document.createElement("img");
        imagen5.className="card-img-top";
        if(data5.items[1].volumeInfo.imageLinks.smallThumbnail!=undefined){
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "46005d8c664792c6a59c46ceba5a6cab8fb71f0c");
          myHeaders.append("Content-Type", "application/json");
                    
          const resposes= await fetch("https://google.serper.dev/images", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `El alquimista libro`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          let src1= datar.images[0].imageUrl;
          imagen5.src=src1;
          divCard5.append(imagen5);
        }

        
        let divCardB5=document.createElement("div");
        divCardB5.className="card-body";

        let h55= document.createElement("h5");
        h55.className="card-title";
        let titulo5= data5.items[1].volumeInfo.title;
        h55.textContent=titulo5;
        divCardB5.append(h55);

        let p5= document.createElement("p");
        p5.className="card-text";
        let autor5= data5.items[1].volumeInfo.authors[0];
        let fecha5= data5.items[1].volumeInfo.publishedDate;

            try {
                const libro= "El alquimista";
        
                var myHeaders = new Headers();
                myHeaders.append("X-API-KEY", "46005d8c664792c6a59c46ceba5a6cab8fb71f0c");
                myHeaders.append("Content-Type", "application/json");
                
                const resposes= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro descripcion`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar= await resposes.json();
                const resposes1= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro precio`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar1= await resposes1.json();
                let afuera=[];
                for(let x=0; datar1.organic.length>x ; x++){
                  let precio= datar1.organic[x].snippet;
                  let separado= precio.split(". ");
                  for(let y=0; separado.length>y ; y++){
                    let precioFinal= parseInt(separado[y]);
                    if(precioFinal>5000 & precioFinal<100000){
                      afuera.push(precioFinal);
                    }
                  }
                }
                let dato= datar.answerBox.snippet;
                p5.innerHTML=`<strong>Autor:</strong> ${autor5}<br><strong>Fecha de publicación:</strong> ${fecha5}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                st.innerText=`$${afuera[0]}`;
                p5.append(st);
                divCardB5.append(p5);

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){});
                boton1.textContent="Añadir 🛒";
                divCardB5.append(boton1);

            } catch (error) {
                console.log(error);
            }

        divCard5.append(divCardB5);
        divCol5.append(divCard5);
        contenedor.append(divCol5);

        ////

        let divCol6=document.createElement("div");
        divCol6.className="col";

        let divCard6=document.createElement("div");
        divCard6.className="card h-100";


        let response6= await fetch('https://www.googleapis.com/books/v1/volumes?q=Heidi');
        let data6= await response6.json();

        let imagen6= document.createElement("img");
        imagen6.className="card-img-top";
        if(data6.items[1].volumeInfo.imageLinks.smallThumbnail!=undefined){
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "46005d8c664792c6a59c46ceba5a6cab8fb71f0c");
          myHeaders.append("Content-Type", "application/json");
                    
          const resposes= await fetch("https://google.serper.dev/images", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `Heidi libro`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          let src1= datar.images[0].imageUrl;
          imagen6.src=src1;
          divCard6.append(imagen6);
        } 

        
        let divCardB6=document.createElement("div");
        divCardB6.className="card-body";

        let h56= document.createElement("h5");
        h56.className="card-title";
        let titulo6= data6.items[0].volumeInfo.title;
        h56.textContent=titulo6;
        divCardB6.append(h56);

        let p6= document.createElement("p");
        p6.className="card-text";
        let autor6= data6.items[0].volumeInfo.authors[0];
        let fecha6= data6.items[0].volumeInfo.publishedDate;

            try {
                const libro= "Heidi";
        
                var myHeaders = new Headers();
                myHeaders.append("X-API-KEY", "46005d8c664792c6a59c46ceba5a6cab8fb71f0c");
                myHeaders.append("Content-Type", "application/json");
                
                const resposes= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro descripcion`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar= await resposes.json();
                const resposes1= await fetch("https://google.serper.dev/search", {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                      "q": `${libro} libro precio`,
                      "gl": "ar",
                      "hl": "es-419"
                    }),
                    redirect: 'follow',
                  });
                const datar1= await resposes1.json();
                let afuera=[];
                for(let x=0; datar1.organic.length>x ; x++){
                  let precio= datar1.organic[x].snippet;
                  let separado= precio.split(". ");
                  for(let y=0; separado.length>y ; y++){
                    let precioFinal= parseInt(separado[y]);
                    if(precioFinal>5000 & precioFinal<100000){
                      afuera.push(precioFinal);
                    }
                  }
                }
                let dato= datar.answerBox.snippet;
                p6.innerHTML=`<strong>Autor:</strong> ${autor6}<br><strong>Fecha de publicación:</strong> ${fecha6}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                st.innerText=`$${afuera[0]}`;
                p6.append(st);
                divCardB6.append(p6);

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){});
                boton1.textContent="Añadir 🛒";
                divCardB6.append(boton1);

            } catch (error) {
                console.log(error);
            }
        
        divCard6.append(divCardB6);
        divCol6.append(divCard6);
        contenedor.append(divCol6);*/

    } catch (error) {
        console.log(error)
    }
}
document.addEventListener('DOMContentLoaded', inicio());

document.getElementById("inicio").addEventListener('click', function(){
    document.getElementById("contenedor").textContent=``;
    inicio();
});

let contador=1;

document.getElementById("formulario").addEventListener('submit', async function(event){
  event.preventDefault();
  try{
    const contenedor= document.getElementById("contenedor");
    document.getElementById("contenedor").textContent=``;
    const libro= document.getElementById("search").value;
      
    let response1= await fetch(`https://www.googleapis.com/books/v1/volumes?q=${libro}`);
    let data1= await response1.json();

    for(let i=0; data1.items.length>i ; i++){
      let divCol1=document.createElement("div");
      divCol1.className="col";
      
      let divCard1=document.createElement("div");
      divCard1.className="card h-100";

      
      let titulo1= data1.items[i].volumeInfo.title;

      let imagen1= document.createElement("img");
      imagen1.className="card-img-top";
      
      var myHeaders = new Headers();
      myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
      myHeaders.append("Content-Type", "application/json");
                
      const resposes= await fetch("https://google.serper.dev/images", {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            "q": `${titulo1} libro`,
            "gl": "ar",
            "hl": "es-419"
          }),
          redirect: 'follow',
        });
      const datar= await resposes.json();
      let src1= await datar.images[0].imageUrl;
      imagen1.src=src1;
      divCard1.append(imagen1);

      
      let divCardB1=document.createElement("div");
      divCardB1.className="card-body";
      let h51= document.createElement("h5");
      h51.className="card-title";
      h51.textContent=titulo1;
      divCardB1.append(h51);
      let p1= document.createElement("p");
      p1.className="card-text";
      let autor1= "";
      let fecha1= data1.items[i].volumeInfo.publishedDate;
      try {      
          var myHeaders = new Headers();
          myHeaders.append("X-API-KEY", "cd3481afa0350fe792c0ca081e380739e1dee83b");
          myHeaders.append("Content-Type", "application/json");
          
          const respose12= await fetch("https://google.serper.dev/search", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `${libro} libro autor`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const data12= await respose12.json();
          if(data12.answerBox==null || data12.answerBox==undefined){
            let autorb= await data12.organic[0].sitelinks[0].title;
            autor1+=autorb
          } else{
            let autor= await data12.answerBox.answer;
            autor1+=autor;
          }
          

          const resposes= await fetch("https://google.serper.dev/search", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `${titulo1} libro descripcion`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar= await resposes.json();
          const resposes1= await fetch("https://google.serper.dev/search", {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "q": `${titulo1} libro precio`,
                "gl": "ar",
                "hl": "es-419"
              }),
              redirect: 'follow',
            });
          const datar1= await resposes1.json();
          let afuera=[];
          for(let x=0; datar1.organic.length>x ; x++){
            let precio= datar1.organic[x].snippet;
            let separado= precio.split(". ");
            for(let y=0; separado.length>y ; y++){
              let precioFinal= parseInt(separado[y]);
              if(precioFinal>3000 & precioFinal<100000){
                if(precioFinal==undefined){
                  console.log("No esta definido");
                } else{
                  afuera.push(precioFinal);
                }
              }
            }
          } 
          let saber=0;
                let dato= datar.organic[0].snippet;
                p1.innerHTML=`<strong>Autor:</strong> ${autor1}<br><strong>Fecha de publicación:</strong> ${fecha1}<br><strong>Descrición del libro:</strong> ${dato}<br>`;
                let st= document.createElement("strong");
                if(afuera[0]==undefined){
                  let segunda= datar1.organic[0].ratingCount *1000;
                  saber+=segunda
                  st.innerText=`$${segunda}`;
                  p1.append(st);
                  divCardB1.append(p1);
                } else{
                  saber+=afuera[0]
                  st.innerText=`$${afuera[0]}`;
                  p1.append(st);
                  divCardB1.append(p1);
                }

                let boton1=document.createElement("button");
                boton1.className="btn btn-dark";
                boton1.addEventListener('click', function(){
                  if(document.getElementById(`${titulo1}`)!=null){
                    let todoTr= document.getElementById(`${titulo1}`);
                    todoTr.querySelector('input').value++;
                    let precio= parseInt(todoTr.querySelector('input').value) * saber;
                    todoTr.querySelector(".precio").textContent=`$${precio}`;
                    let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                  } else{
                    const paraComprar=document.getElementById("paraComprar");

                    const tr1= document.createElement("tr");
                    tr1.id=`${titulo1}`;

                    const td1=document.createElement("td");
                    td1.textContent=`${titulo1}`;
                    tr1.append(td1);

                    const td3=document.createElement("td");
                    td3.className="precio";
                    td3.id=`${contador}`;
                    contador+=1;
                    td3.textContent=`$${saber}`;

                    const td2=document.createElement("td");
                    const inpu=document.createElement("input");
                    inpu.style.width="50px";
                    inpu.type="number";
                    inpu.value=1;
                    inpu.min=1;

                    function actualizarTotal() {
                      let precio = inpu.value * saber;
                      td3.textContent = `$${precio}`;
                      let todos = document.querySelectorAll(".precio");
                      let guardar1 = 0;
                      todos.forEach(element => {
                        let numero = element.textContent.split("$");
                        guardar1 += parseInt(numero[1]);
                      });
                      document.getElementById("aPagar").textContent = `$${guardar1}`;
                    }

                    inpu.addEventListener('input', function(){
                      if (inpu.value < 0) {
                        inpu.value = "1";
                      }
                      actualizarTotal();
                    });
                    
                    inpu.addEventListener('change', function(){
                      actualizarTotal();
                    });
                    
                    td2.append(inpu);
                    tr1.append(td2);
                    
                    tr1.append(td3);

                    let td4=document.createElement("td");
                    let boton2= document.createElement("button");
                    boton2.textContent="🗑️";
                    boton2.addEventListener('click',function(){
                      tr1.remove();
                      let valor1=td3.textContent.split("$");
                      let valorR= parseInt(valor1[1]);
                      let valor2= document.getElementById("aPagar").textContent.split("$");
                      let valorF= parseInt(valor2[1]);
                      let calculo= valorF-valorR;
                      document.getElementById("aPagar").textContent=`$${calculo}`;
                    })
                    td4.append(boton2);
                    tr1.append(td4);

                    paraComprar.append(tr1);
                    let todos = document.querySelectorAll(".precio");
                    
                    let guardar=0

                    todos.forEach(element => {
                      let numero=element.textContent.split("$");
                      guardar+=parseInt(numero[1]);
                    });
                    
                    document.getElementById("aPagar").textContent=`$${guardar}`;
                  }

                });
                boton1.textContent="Añadir 🛒";
                divCardB1.append(boton1);

      } catch (error) {
          console.log(error);
      }

      divCard1.append(divCardB1);
      divCol1.append(divCard1);
      contenedor.append(divCol1);
    }

  } catch(error){
    console.log(error)
  }
})

document.getElementById("abrir").addEventListener('click', function(){
    const carrito=document.getElementById("carrito");
    if(carrito.style.display!="block"){
        carrito.style.display="block";
    } else{
        carrito.style.display="none";
    }
})

document.getElementById("comprar").addEventListener('click', function(){
  let valor2= document.getElementById("aPagar").textContent.split("$");
  let valorF= parseInt(valor2[1]);
  if(valorF==0){
    alert("Elija al menos un libro para comprar")
  } else{
    alert("A partir de ahora, le pido que complete los datos")
    let DNI= prompt("Escriba el DNI del titular de la tarjeta");
    while(DNI=="" || DNI==null){
      DNI= prompt("Escriba el DNI del titular de la tarjeta");
    }
    let nombre= prompt("Escriba el nombre del titular de la tarjeta");
    while(nombre=="" || nombre==null){
      nombre= prompt("Escriba el nombre del titular de la tarjeta");
    }
    let vencimiento= prompt("Escriba la fecha de vencimiento de la tarjeta");
    while(vencimiento=="" || vencimiento==null){
      vencimiento= prompt("Escriba la fecha de vencimiento de la tarjeta");
    }
    alert("Estamos procesando los datos");
    alert("¡Felicidades! La compra ha sido exitosa");
    var lugar=prompt("Escriba el lugar al que quiere que le lleguen los libros");
    while(lugar=="" || lugar==null){
      lugar= prompt("Escriba el lugar al que quiere que le lleguen los libros");
    }
    alert(`El/los libros que compraste llegaran al lugar de destino en 2 días`);
    alert("Gracias por su compra 😊");
    document.getElementById("paraComprar").innerHTML="";
    document.getElementById("aPagar").textContent="$0";
  }
})
